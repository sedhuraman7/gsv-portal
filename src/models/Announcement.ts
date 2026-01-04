
import mongoose, { Schema, model, models } from 'mongoose';

const AnnouncementSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Announcement = models.Announcement || model('Announcement', AnnouncementSchema);

export default Announcement;
