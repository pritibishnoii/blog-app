'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

// Heart pop/scale animation on click, per UI/UX brief
export default function LikeButton({ postId, initialLiked, initialCount }) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!session) {
      showToast('Login to like this post', 'error');
      return;
    }
    if (busy) return;

    // optimistic update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => (nextLiked ? c + 1 : c - 1));
    setBusy(true);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.likeCount);
    } catch {
      // revert on failure
      setLiked(liked);
      setCount(count);
      showToast('Could not update like, try again', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
      aria-pressed={liked}
    >
      <motion.span
        whileTap={{ scale: 1.4 }}
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-5 h-5 ${liked ? 'fill-accent text-accent' : 'text-gray-400'}`}
        />
      </motion.span>
      {count}
    </button>
  );
}
