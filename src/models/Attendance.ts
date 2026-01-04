
import mongoose, { Schema, model, models } from 'mongoose';

const AttendanceSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
    comments: { type: String }
}, { timestamps: true });

const Attendance = models.Attendance || model('Attendance', AttendanceSchema);

export default Attendance;
