import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';

import audioRoutes from './Endpoints/audioRoutes.js';
import userRoutes from './Endpoints/userRoutes.js';
import authRoutes from './Endpoints/authRoutes.js';

import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '../.env' }); // Load environment variables from a .env file into process.env

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('MONGO_URI is not defined in the environment variables');
    process.exit(1);
}

const connectToMongoDB = async () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        })
            .then(() => {
                console.log('MongoDB connected');
                resolve();
            })
            .catch((err) => {
                console.error('Error connecting to MongoDB:', err.message);
                reject(err);
            });
    });
};

connectToMongoDB();

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    console.log(`Request made to: ${req.originalUrl} at ${req.requestTime}`);
    next();
})

const router = express.Router();
app.use('/api', router);

router.use('/', audioRoutes);
router.use('/', userRoutes);
router.use('/', authRoutes);
app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

export default app;