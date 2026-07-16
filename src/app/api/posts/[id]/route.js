import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { auth } from '@/auth';
import { postSchema } from '@/lib/validations';
import { calculateReadTime } from '@/lib/readTime';
import { generateExcerpt } from '@/lib/excerpt';

async function findPost(idOrSlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byId = await Post.findById(idOrSlug).populate('author', 'name avatar bio');
    if (byId) return byId;
  }
  return Post.findOne({ slug: idOrSlug }).populate('author', 'name avatar bio');
}

// GET /api/posts/[id]  — id can be a slug (public view) or a Mongo _id
export async function GET(req, { params }) {
  try {
    await connectDB();
    const post = await findPost(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    post.views += 1;
    await post.save();

    return NextResponse.json(post);
  } catch (err) {
    console.error('Get post error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// PUT /api/posts/[id] — owner only
export async function PUT(req, { params }) {
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
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = postSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const updates = parsed.data;
    if (updates.content) {
      updates.excerpt = generateExcerpt(updates.content);
      updates.readTime = calculateReadTime(updates.content);
    }

    Object.assign(post, updates);
    await post.save();

    return NextResponse.json(post);
  } catch (err) {
    console.error('Update post error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] — owner only, cascades to comments (per edge cases doc)
export async function DELETE(req, { params }) {
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
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete post error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
