import express from 'express';
import User from '../Database Schema/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_TIME = process.env.JWT_EXPIRES_TIME;

const authRoutes = express.Router();

//SIGN UP (CREATE NEW USER)
authRoutes.post('/auth/singup', async (req, res) => {
    console.log("IN POST ROUTE OF /auth/signup")
    const { name, email, password, photo } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
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

        return res.status(200).json({token, newUser});
    } catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
})

//LOGIN (GET USER DATA BY EMAIL AND PASSWORD)
authRoutes.post('/login', async (req, res) => {
    console.log("IN POST ROUTE OF /auth/login")
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'User data not found.' });
        }
        const checkPassword = await user.comparePassword(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME });
        return res.status(200).json({token});
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
})

export default authRoutes;