import connectDB from '@/lib/mongoose';
import { CommunityPost } from '@/models/CommunityPost';

export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = params;

  const deleted = await CommunityPost.findByIdAndDelete(id);
  if (!deleted) return new Response('Post not found', { status: 404 });

  return new Response('Post deleted', { status: 200 });
}
