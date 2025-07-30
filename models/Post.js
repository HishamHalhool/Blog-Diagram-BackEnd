import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  createdBy: { type: String, required: true },
  userId: { type: Number, required: true }
});

export default mongoose.model('Post', postSchema); 