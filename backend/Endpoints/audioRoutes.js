import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const upload = multer();
const audioRoutes = express.Router();

//configure AWS S3 bucket
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

//GET ALL AUDIO DATA
audioRoutes.get('/audio', async (req, res) => {
    return res.status(200).json({ message: 'This is audio data from the audio route.' });
})

//GET AUDIO DATA BY ID
audioRoutes.get('/audio/:id', async (req, res) => {
    const { id } = req.params;
    return res.status(200).json({ message: `This is audio data from the audio route with id: ${id}` });
})

//POST AUDIO DATA
audioRoutes.post('/audio', upload.single('audio'), async (req, res) => {
    const { documentName, transcription, translation, language } = req.body;
    const audioFile = req.file;

    if(!audioFile) {
        return res.status(400).json({ message: 'Audio file is required.' });
    }

    if(!documentName || !transcription || !translation || !language) {
        return res.status(400).json({ message: 'Document name, transcription, translation, and language are required.' });
    }
    return res.status(200).json({ message: 'Audio data has been posted to the audio route sucessfully.' });
})

//PUT AUDIO DATA
audioRoutes.put('/audio/:id', async (req, res) => {
    const { id } = req.params;
    return res.status(200).json({ message: `Audio data has been updated with id: ${id}` });
})

//DELETE AUDIO DATA
audioRoutes.delete('/audio/:id', async (req, res) => {
    const { id } = req.params;
    return res.status(200).json({ message: `Audio data has been deleted with id: ${id}` });
})

export default audioRoutes;