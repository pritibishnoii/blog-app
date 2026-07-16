import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { auth } from '@/auth';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import TagChips from '@/components/TagChips';

export default async function PostPage({ params }) {
  const { slug } = await params;
  await connectDB();

  const session = await auth();
  const post = await Post.findOne({ slug }).populate('author', 'name avatar bio').lean();

  if (!post) notFound();

  // Draft or Published visibility rule, per Decision Paths doc
  const isOwner = session?.user?.id === post.author?._id?.toString();
  if (post.status === 'draft' && !isOwner) notFound();

  if (!isOwner) {
    await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });
  }

  const comments = await Comment.find({ post: post._id })
    .populate('author', 'name avatar')
    .sort({ createdAt: 1 })
    .lean();

  const serializedPost = JSON.parse(JSON.stringify(post));
  const serializedComments = JSON.parse(JSON.stringify(comments));

  const authorName = post.author?.name || 'Deleted User'; // edge case: user deleted
  const liked = session?.user ? post.likes.some((id) => id.toString() === session.user.id) : false;

  return (
    <main className="max-w-content mx-auto px-6 py-10">
      {post.status === 'draft' && (
        <div className="mb-6 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
          This post is a draft — only visible to you.
        </div>
      )}

      <TagChips tags={post.tags} />

      <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4 leading-tight">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
        {post.author ? (
          <Link href={`/author/${post.author._id}`} className="hover:text-white transition">
            by {authorName}
          </Link>
        ) : (
          <span>by {authorName}</span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> {post.views} views
        </span>
      </div>

      {post.coverImage && (
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <article
        className="prose prose-invert max-w-none prose-headings:font-semibold"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-8 pt-6 border-t border-white/10">
        <LikeButton postId={serializedPost._id} initialLiked={liked} initialCount={post.likes.length} />
      </div>

      <CommentSection postId={serializedPost._id} initialComments={serializedComments} />
    </main>
  );
}
