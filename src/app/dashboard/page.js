import Link from 'next/link';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/auth';
import DashboardPostRow from '@/components/DashboardPostRow';

export default async function DashboardPage() {
  const session = await auth(); // middleware guarantees this exists
  await connectDB();

  const posts = await Post.find({ author: session.user.id }).sort({ createdAt: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(posts));

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My posts</h1>
        <Link
          href="/create-post"
          className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
        >
          New Post
        </Link>
      </div>

      {serialized.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-lg mb-1">You haven&apos;t written anything yet.</p>
          <p className="text-sm">Your first post is one click away.</p>
        </div>
      ) : (
        <div>
          {serialized.map((post) => (
            <DashboardPostRow key={post._id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
