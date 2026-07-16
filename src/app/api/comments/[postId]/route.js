import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';

// GET /api/comments/[postId] — flat list; nesting is reconstructed client-side via parentComment
export async function GET(req, { params }) {
  try {
    await connectDB();
    const comments = await Comment.find({ post: params.postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(comments);
  } catch (err) {
    console.error('Get comments error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
