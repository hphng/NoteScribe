import express from 'express';
import User from '../Database Schema/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_TIME = process.env.JWT_EXPIRES_TIME;

const authRoutes = express.Router();

//SIGN UP (CREATE NEW USER)
authRoutes.post('/auth/signup', async (req, res) => {
    console.log("IN POST ROUTE OF /auth/signup (local signup)")
    const { name, email, password, photo } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ email, provider: 'local' });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists, please login.' });
        }
        const newUser = new User({
            name,
            email,
            password,
            photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.status(200).json({token, newUser});
    } catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
})

//LOGIN (GET USER DATA BY EMAIL AND PASSWORD)
authRoutes.post('/auth/login', async (req, res) => {
    console.log("IN POST ROUTE OF /auth/login")
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email, provider: 'local' }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User data not found.' });
        }
        const checkPassword = await user.comparePassword(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME });
        
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.status(200).json({token});
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
})

//LOGOUT
authRoutes.get('/auth/logout', (req, res) => {
    console.log("IN GET ROUTE OF /auth/logout")
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logout successful.' });
})

authRoutes.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
})) 

authRoutes.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        const { token, user } = req.user;
        console.log("Successfully authenticated with Google.")
        console.log(user);
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        res.redirect('/');
    }
)

authRoutes.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
})) 

authRoutes.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        const { token, user } = req.user;
        console.log("Successfully authenticated with Facebook.")
        console.log(user);
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        res.redirect('/');
    }
)

authRoutes.get('/auth/github', passport.authenticate('github', {
   scope: ['user:email']
}))

authRoutes.get('/auth/github/callback', 
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        const { token, user } = req.user;
        console.log("Successfully authenticated with Github.")
        console.log(user);
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
        res.redirect('/');
    }
)

export default authRoutes;