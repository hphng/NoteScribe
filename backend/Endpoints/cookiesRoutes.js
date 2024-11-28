import express from 'express';

const cookieRoutes = express.Router();

//SET COOKIE
cookieRoutes.post('/cookies', (req, res) => {
    console.log("IN POST ROUTE OF /cookies")
    res.cookie('authToken', '6', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        // maxAge: 1000 * 60 * 60 * 24 * 7
    });
    res.status(200).json({ message: 'Cookie set successfully.' });
})

//GET COOKIE
cookieRoutes.get('/cookies', (req, res) => {
    console.log("IN GET ROUTE OF /cookies")
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'No token found.' });
    }
    // console.log(req.cookies)
    res.status(200).json({ message: 'Token found.', token });
})

export default cookieRoutes;