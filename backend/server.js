import express, { json } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

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
