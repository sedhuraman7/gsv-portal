
import mongoose, { Schema, model, models } from 'mongoose';

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    domain: { type: String },
    deadline: { type: Date }
}, { timestamps: true });

const Task = models.Task || model('Task', TaskSchema);

export default Task;
