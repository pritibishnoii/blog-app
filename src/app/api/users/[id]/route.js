import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// GET /api/users/[id] — public author profile info (name, avatar, bio)
export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await User.findById(params.id).select('name avatar bio createdAt');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
