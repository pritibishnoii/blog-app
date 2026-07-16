'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function CoverImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange(data.url);
    } catch {
      // Edge case per doc: "Image upload fails → fallback to default placeholder cover"
      showToast('Upload failed — using placeholder cover instead', 'error');
      onChange('');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-white/10">
          <Image src={value} alt="Cover" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 aspect-[16/9] rounded-lg border border-dashed border-white/15 cursor-pointer hover:border-white/30 transition text-gray-500">
          <Upload className="w-6 h-6" />
          <span className="text-sm">{uploading ? 'Uploading...' : 'Upload cover image'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
    </div>
  );
}
