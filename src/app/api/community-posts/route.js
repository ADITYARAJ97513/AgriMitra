import connectDB from '@/lib/mongoose'; // use your existing mongoose.js
import { CommunityPost } from '@/models/CommunityPost';

export async function GET() {
  await connectDB();
  const posts = await CommunityPost.find().sort({ timestamp: -1 });
  return Response.json(posts);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const post = await CommunityPost.create(body);
  return Response.json(post);
}
