/** @format */

import connectDB from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import PostCard from "@/components/PostCard";
import TagChips from "@/components/TagChips";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page || "1", 10));
  const tag = params?.tag || null;

  await connectDB();

  const filter = { status: "published" };
  if (tag) filter.tags = tag;

  const [posts, total, allTags] = await Promise.all([
    Post.find(filter)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Post.countDocuments(filter),
    Post.distinct("tags", { status: "published" }),
  ]);

  const serialized = JSON.parse(JSON.stringify(posts));

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {tag ? `Posts tagged #${tag}` : "Latest posts"}
        </h1>
        <p className="text-gray-400">
          Read, write, and share — no heavy CMS required.
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="mb-8">
          <TagChips tags={allTags} activeTag={tag} />
        </div>
      )}

      {serialized.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-lg mb-1">
            No posts {tag ? `tagged #${tag}` : "yet"}.
          </p>
          <p className="text-sm">Be the first to write one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serialized.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={Math.ceil(total / PAGE_SIZE) || 1}
        basePath="/"
        extraParams={tag ? `&tag=${encodeURIComponent(tag)}` : ""}
      />
    </main>
  );
}
