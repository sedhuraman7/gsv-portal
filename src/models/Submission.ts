
import mongoose, { Schema, model, models } from 'mongoose';

const SubmissionSchema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }, // URL or text
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Submission = models.Submission || model('Submission', SubmissionSchema);

export default Submission;
