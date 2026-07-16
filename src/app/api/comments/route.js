import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { auth } from '@/auth';
import { commentSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rateLimit';

// POST /api/comments — add a comment (or nested reply via parentComment)
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const rl = rateLimit(`create-comment:${session.user.id}`, { limit: 15, windowMs: 60_000 });
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests, slow down' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { postId, text, parentComment } = parsed.data;
    await connectDB();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comment = await Comment.create({
      post: postId,
      author: session.user.id,
      text,
      parentComment: parentComment || null,
    });

    await comment.populate('author', 'name avatar');

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error('Create comment error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
