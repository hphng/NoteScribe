import express from 'express';

const audioRoute = express.Router();

//GET ALL AUDIO DATA
audioRoute.get('/audio', async (req, res) => {
    return res.status(200).json({ message: 'This is audio data from the audio route.' });
})

//GET AUDIO DATA BY ID
audioRoute.get('/audio/:id', async (req, res) => {
    const { id } = req.params;
    return res.status(200).json({ message: `This is audio data from the audio route with id: ${id}` });
})

//POST AUDIO DATA
audioRoute.post('/audio', async (req, res) => {
    return res.status(200).json({ message: 'Audio data has been posted to the audio route.' });
})

//PUT AUDIO DATA
audioRoute.put('/audio/:id', async (req, res) => {
    const { id } = req.params;
    return res.status(200).json({ message: `Audio data has been updated with id: ${id}` });
})

//DELETE AUDIO DATA
audioRoute.delete('/audio/:id', async (req, res) => {
    const { id } = req.params;
    return res.status(200).json({ message: `Audio data has been deleted with id: ${id}` });
})

export default audioRoute;