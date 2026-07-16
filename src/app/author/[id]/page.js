import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Post from '@/models/Post';
import PostCard from '@/components/PostCard';

export default async function AuthorPage({ params }) {
  const { id } = await params;
  await connectDB();

  const user = await User.findById(id).select('name avatar bio createdAt').lean();
  if (!user) notFound();

  const posts = await Post.find({ author: id, status: 'published' })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .lean();

  const serialized = JSON.parse(JSON.stringify(posts));

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-semibold shrink-0">
          {user.name[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-400 text-sm mt-1">{user.bio}</p>}
        </div>
      </div>

      {serialized.length === 0 ? (
        <p className="text-gray-500">No published posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serialized.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
