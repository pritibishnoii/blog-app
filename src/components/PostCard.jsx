'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Clock } from 'lucide-react';
import TagChips from './TagChips';

// Fade-in + slide-up on scroll, hover lift — per UI/UX brief animation spec
export default function PostCard({ post }) {
  const authorName = post.author?.name || 'Deleted User'; // edge case: user deleted

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden hover:shadow-lg hover:shadow-primary/10 hover:border-white/20 transition-shadow transition-colors"
    >
      <Link href={`/post/${post.slug}`}>
        <div className="relative aspect-[16/9] bg-white/5">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
              No cover image
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col gap-3">
        <TagChips tags={post.tags} />

        <Link href={`/post/${post.slug}`}>
          <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
          <span>by {authorName}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime} min
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> {post.likes?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
