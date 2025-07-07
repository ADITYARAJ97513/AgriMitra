import connectDB from '@/lib/mongoose';
import { CommunityPost } from '@/models/CommunityPost';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  await connectDB();
  const { id } = params;
  const body = await req.json();

  const post = await CommunityPost.findById(id);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  // Add the new answer
  post.answers.unshift({
    author: body.author,
    answer: body.answer,
    timestamp: new Date()
  });

  await post.save();

  // ✅ Re-fetch the updated post to include latest answers
  const updatedPost = await CommunityPost.findById(id);

  return NextResponse.json(updatedPost);
}
