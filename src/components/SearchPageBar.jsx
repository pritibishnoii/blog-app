'use client';

import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';

export default function SearchPageBar({ initialQuery }) {
  const router = useRouter();
  return (
    <SearchBar
      initialValue={initialQuery}
      onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
    />
  );
}
