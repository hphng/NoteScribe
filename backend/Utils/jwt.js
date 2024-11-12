import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import util, { promisify } from 'util';
import User  from '../Database Schema/User.js';

dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_TIME = process.env.JWT_EXPIRES_TIME;


/* 
    1) Getting token and check if it's there

    2) Verification token

    3) Check if user still exists

    4) Check if user changed password after the token was issued
*/
export const authMiddleware = async (req, res, next) => {
    console.log("In authMiddleware")
    //    1) Getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        return res.status(401).json({ message: 'Please log in to get access.' });
    }

    //    2) Verification token
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, JWT_SECRET)
        // console.log(decoded);
    }catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired, please log in again.' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token, please log in again.' });
        } else {
            console.error('Error verifying token:', error.message);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    //    3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(401).json({ message: 'The user belonging to this token does no longer exist' });
    }
    // console.log(user);

    //    4) Check if user changed password after the token was issued
    if(user.changePasswordAfter(decoded.iat)){
        return res.status(401).json({ message: 'User recently changed password! Please log in again.' });
    }

    req.user = user;
    next();
}