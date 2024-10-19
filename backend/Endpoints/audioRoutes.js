import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});

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
    console.log("IN POST ROUTE OF /audio")
    const { documentName, transcription, translation, language } = req.body;
    const audioFile = req.file;
    console.log("AUDIO FILE: ", audioFile)
    console.log("DOCUMENT NAME: ", req.body)
    if (!audioFile) {
        return res.status(400).json({ message: 'Audio file is required.' });
    }
    if (!transcription || !translation || !language) {
        return res.status(400).json({ message: 'Document name, transcription, translation, and language are required.' });
    }
    try {
        //Create a unique key for the audio file of S3
        const s3Key = `audio/${Date.now()}_${documentName}.mp3`;
        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: audioFile.buffer,
            ContentType: audioFile.mimetype,
        };
        // Upload audio file to S3 bucket
        await s3Client.send(new PutObjectCommand(s3Params));
        console.log('Audio file uploaded to S3 bucket:', s3Key);
        // Get the URL of the audio file in the S3 bucket to store in the MONGO
        const s3AudioUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;


        // Store the audio data in the mongoDB
        


        return res.status(200).json({ message: 'Audio data has been posted to the audio route sucessfully.' });
    } catch (error) {
        console.error('Error posting audio data:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
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