import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/auth';
import { postSchema } from '@/lib/validations';
import { slugify, randomSuffix } from '@/lib/slugify';
import { calculateReadTime } from '@/lib/readTime';
import { generateExcerpt } from '@/lib/excerpt';
import { rateLimit } from '@/lib/rateLimit';

const PAGE_SIZE = 10; // per TRD: "Pagination (limit 10 posts/page)"

// GET /api/posts?page=1&tag=react&q=search&author=<id>&mine=true
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const tag = searchParams.get('tag');
    const q = searchParams.get('q');
    const authorId = searchParams.get('author');
    const mine = searchParams.get('mine') === 'true';

    const filter = {};

    if (mine) {
      // Dashboard "My Posts" — needs auth, shows drafts + published
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: 'Login required' }, { status: 401 });
      }
      filter.author = session.user.id;
    } else {
      // Public feed / search / author profile — published only
      filter.status = 'published';
      if (authorId) filter.author = authorId;
    }

    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Post.countDocuments(filter),
    ]);

    return NextResponse.json({
      posts,
      pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) || 1 },
    });
  } catch (err) {
    console.error('List posts error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// POST /api/posts — create post (draft or published)
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const rl = rateLimit(`create-post:${session.user.id}`, { limit: 10, windowMs: 60_000 });
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests, slow down' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { title, content, tags, coverImage, status } = parsed.data;
    await connectDB();

    // Duplicate slug edge case: append random suffix
    let slug = slugify(title);
    const clash = await Post.findOne({ slug });
    if (clash) slug = `${slug}-${randomSuffix()}`;

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt: generateExcerpt(content),
      coverImage: coverImage || '',
      author: session.user.id,
      tags: tags || [],
      status: status || 'draft',
      readTime: calculateReadTime(content),
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error('Create post error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
