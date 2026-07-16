'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ initialValue = '', onSearch, compact = false }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search posts, tags..."
        className={`w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60 ${
          compact ? 'py-1.5' : 'py-2.5'
        }`}
      />
    </form>
  );
}
