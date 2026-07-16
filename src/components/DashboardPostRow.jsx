'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Heart, Clock } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { useToast } from '@/context/ToastContext';

export default function DashboardPostRow({ post }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showToast('Post deleted');
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-white/5">
      <div className="min-w-0">
        <span
          className={`inline-block mb-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
            post.status === 'published' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-gray-400'
          }`}
        >
          {post.status}
        </span>
        <div>
          <Link
            href={post.status === 'published' ? `/post/${post.slug}` : `/edit-post/${post._id}`}
            className="font-medium truncate hover:text-primary transition"
          >
            {post.title}
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readTime} min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {post.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> {post.likes?.length || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/edit-post/${post._id}`}
          className="text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition"
        >
          Edit
        </Link>
        <button
          onClick={() => setConfirmOpen(true)}
          className="text-sm px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
        >
          Delete
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this post?"
        description="This can't be undone. Comments on this post will be deleted too."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
      />
    </div>
  );
}
