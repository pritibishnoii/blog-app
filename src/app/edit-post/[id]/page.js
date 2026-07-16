import { notFound, redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/auth';
import PostEditorForm from '@/components/PostEditorForm';

export default async function EditPostPage({ params }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');

  await connectDB();
  const post = await Post.findById(id).lean();
  if (!post) notFound();

  // Ownership check, per Decision Paths doc
  if (post.author.toString() !== session.user.id) {
    redirect('/dashboard');
  }

  const serialized = JSON.parse(JSON.stringify(post));

  return <PostEditorForm mode="edit" initialPost={serialized} />;
}
