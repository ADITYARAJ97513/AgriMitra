import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  author: String,
  answer: String,
  timestamp: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
});

const communityPostSchema = new mongoose.Schema({
  author: String,
  question: String,
  timestamp: { type: Date, default: Date.now },
  answers: [answerSchema],
});

export const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', communityPostSchema);
