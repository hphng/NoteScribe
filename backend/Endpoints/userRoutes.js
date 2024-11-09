import express from 'express';
import User from '../Database Schema/User.js';
import mongoose from 'mongoose';

const userRoutes = express.Router();

// GET ALL USERS
userRoutes.get('/user', async (req, res) => {
    return res.status(200).json({ message: 'This is user data from the user route.' });
});

//CREATE NEW USER
userRoutes.post('/user', async (req, res) => {
    console.log("IN POST ROUTE OF /user")
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
        return res.status(200).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}) 

//GET USER DATA BY ID
userRoutes.get('/user/:userId', async (req, res) => {
    console.log("IN GET ROUTE OF /user/:userId")
    const { userId } = req.params;
    if (!userId) {
        return res.status(404).json({ message: 'User ID is required.' });
    }

    if (!mongoose.isValidObjectId(userId)) {
        console.log('Invalid User ID format:', userId);
        return res.status(404).json({ message: 'User data not found.' });
    }
    try {
        const userData = await User.findOne({ _id: userId });
        if (!userData) {
            return res.status(404).json({ message: 'User data not found.' });
        }
        return res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
})
// router.get('/users/:id', getUserById);
// router.post('/users', createUser);
// router.put('/users/:id', updateUser);
// router.delete('/users/:id', deleteUser);

export default userRoutes;