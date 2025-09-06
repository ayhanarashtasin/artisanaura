import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open', index: true },
}, { timestamps: true });

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

export default HelpRequest;


