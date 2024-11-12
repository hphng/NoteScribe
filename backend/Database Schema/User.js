import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true, 
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false,
    },
    photo: {
        type: String,
    },
    passwordChangedAt: {
        type: Date,
    },
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare the password entered by the user with the hashed password in the database
userSchema.methods.comparePassword = async function(enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

const User = mongoose.model('User', userSchema);

export default User;