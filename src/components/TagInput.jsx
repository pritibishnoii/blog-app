'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ tags, onChange, max = 8 }) {
  const [input, setInput] = useState('');

  function addTag() {
    const t = input.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < max) {
      onChange([...tags, t]);
    }
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2">
      {tags.map((tag) => (
        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
          #{tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))}>
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length < max ? 'Add tag, press Enter' : ''}
        disabled={tags.length >= max}
        className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none placeholder:text-gray-500"
      />
    </div>
  );
}
