'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from './RichTextEditor';
import CoverImageUpload from './CoverImageUpload';
import TagInput from './TagInput';
import { PrimaryButton, SecondaryButton } from './Buttons';
import { useToast } from '@/context/ToastContext';

export default function PostEditorForm({ mode = 'create', initialPost = null }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave(status) {
    setError('');

    // Validate: title & content non-empty (per Decision Paths doc)
    if (!title.trim() || !content.trim() || content === '<p></p>') {
      setError('Title and content are required to publish.');
      return;
    }

    setSaving(true);
    try {
      const payload = { title: title.trim(), content, tags, coverImage, status };
      const url = mode === 'edit' ? `/api/posts/${initialPost._id}` : '/api/posts';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      showToast(status === 'published' ? 'Published!' : 'Draft saved');
      router.push(status === 'published' ? `/post/${data.slug}` : '/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-content mx-auto px-6 py-10 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{mode === 'edit' ? 'Edit post' : 'New post'}</h1>

      <CoverImageUpload value={coverImage} onChange={setCoverImage} />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="text-2xl font-semibold bg-transparent border-b border-white/10 pb-3 focus:outline-none focus:border-primary placeholder:text-gray-600"
      />

      <TagInput tags={tags} onChange={setTags} />

      <RichTextEditor content={content} onChange={setContent} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
        <SecondaryButton onClick={() => handleSave('draft')} disabled={saving}>
          Save Draft
        </SecondaryButton>
        <PrimaryButton onClick={() => handleSave('published')} disabled={saving}>
          {saving ? 'Publishing...' : 'Publish'}
        </PrimaryButton>
      </div>
    </div>
  );
}
