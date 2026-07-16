import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/auth';

// POST /api/posts/[id]/like — toggle like
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    await connectDB();
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const userId = session.user.id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({ liked: !alreadyLiked, likeCount: post.likes.length });
  } catch (err) {
    console.error('Like post error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
