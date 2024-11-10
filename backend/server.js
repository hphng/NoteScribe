import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import audioRoutes from './Endpoints/audioRoutes.js';
import userRoutes from './Endpoints/userRoutes.js';
import authRoutes from './Endpoints/AuthRoute.js';

dotenv.config({path: '../.env'}); // Load environment variables from a .env file into process.env

const app = express();
const PORT = process.env.PORT || 5000;
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
  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
app.use('/api', router);

router.use('/', audioRoutes);
router.use('/', userRoutes);
router.use('/', authRoutes);

app.get('/api/data', (req, res) => {
    const sampleData = {
        message: 'This is data from the backend.',
    };
    res.json(sampleData);
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
