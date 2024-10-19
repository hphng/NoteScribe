import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import audioRoute from './Endpoints/audioRoutes.js';

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
  

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

const router = express.Router();
router.use('/', audioRoute);

app.use('/api', router);

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
