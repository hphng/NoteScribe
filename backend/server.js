import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import passport from './Utils/passportConfig.js';
import cookieParser from 'cookie-parser';

import audioRoutes from './Endpoints/audioRoutes.js';
import userRoutes from './Endpoints/userRoutes.js';
import authRoutes from './Endpoints/authRoutes.js';
import cookiesRoutes from './Endpoints/cookiesRoutes.js';

import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '../.env' }); // Load environment variables from a .env file into process.env

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const BASE_URL = process.env.BASE_URL;

if (!mongoURI) {
    console.error('MONGO_URI is not defined in the environment variables');
    process.exit(1);
}

const connectToMongoDB = async (retries = 5) => {
    while (retries) {
        try {
            await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 5000
            });
            console.log('MongoDB connected');
            break;
        } catch (err) {
            console.error(`MongoDB connection failed: ${err.message}. Retrying (${retries} attempts left)...`);
            retries -= 1;
            if (retries === 0) process.exit(1);
            await new Promise(res => setTimeout(res, 5000)); // Retry after 5 seconds
        }
    }
};

connectToMongoDB();

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(
    {
        origin: BASE_URL,
        credentials: true
    }
));
app.use(cookieParser());

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
router.use('/', cookiesRoutes);

app.use('/api', (req, res) => {
    res.status(404).send({ message: 'Not found' });
});

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;