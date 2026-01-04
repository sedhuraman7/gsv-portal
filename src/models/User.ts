
import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },

    // Student Specific Fields
    phone: { type: String },
    college: { type: String },
    department: { type: String },
    year: { type: String },
    domain: { type: String },
    about: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    resumeUrl: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
