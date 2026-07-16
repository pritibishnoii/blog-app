'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { PrimaryButton } from './Buttons';

function buildTree(comments) {
  const byId = {};
  comments.forEach((c) => (byId[c._id] = { ...c, replies: [] }));
  const roots = [];
  comments.forEach((c) => {
    if (c.parentComment && byId[c.parentComment]) {
      byId[c.parentComment].replies.push(byId[c._id]);
    } else {
      roots.push(byId[c._id]);
    }
  });
  return roots;
}

function CommentInput({ onSubmit, placeholder = 'Add a comment...', autoFocus = false }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return; // edge case: empty comment blocked
    setSubmitting(true);
    await onSubmit(trimmed);
    setText('');
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 mt-1" />
      <div className="flex-1 flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
        />
        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={submitting || !text.trim()} className="px-4 py-1.5 text-sm">
            {submitting ? 'Posting...' : 'Post'}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}

function CommentItem({ comment, onReply, depth = 0 }) {
  const [replying, setReplying] = useState(false);
  const authorName = comment.author?.name || 'Deleted User';

  return (
    <div className={depth > 0 ? 'ml-11 mt-4 pl-4 border-l border-white/10' : 'mt-6'}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-xs font-medium">
          {authorName[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">{authorName}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-300 mt-1">{comment.text}</p>
          <button
            onClick={() => setReplying((r) => !r)}
            className="text-xs text-gray-500 hover:text-white mt-1 transition"
          >
            Reply
          </button>

          {replying && (
            <div className="mt-3">
              <CommentInput
                placeholder={`Reply to ${authorName}...`}
                autoFocus
                onSubmit={async (text) => {
                  await onReply(text, comment._id);
                  setReplying(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {comment.replies?.map((reply) => (
          <motion.div
            key={reply._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CommentItem comment={reply} onReply={onReply} depth={depth + 1} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function CommentSection({ postId, initialComments }) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [comments, setComments] = useState(initialComments);

  async function handleSubmit(text, parentComment = null) {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, text, parentComment }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to post comment');
      }
      const newComment = await res.json();
      // slide-in new comment from bottom, per UI/UX brief
      setComments((prev) => [...prev, newComment]);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const tree = buildTree(comments);

  return (
    <section className="mt-12 pt-8 border-t border-white/10">
      <h3 className="text-lg font-semibold mb-4">
        Comments {comments.length > 0 && <span className="text-gray-500">({comments.length})</span>}
      </h3>

      {session ? (
        <CommentInput onSubmit={(text) => handleSubmit(text)} />
      ) : (
        <p className="text-sm text-gray-500">
          Login to join the conversation.
        </p>
      )}

      <div>
        {tree.map((c) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CommentItem comment={c} onReply={handleSubmit} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
