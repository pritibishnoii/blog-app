'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

// Nav bar shrink/blur on scroll, per UI/UX brief
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      animate={{
        paddingTop: scrolled ? 10 : 18,
        paddingBottom: scrolled ? 10 : 18,
      }}
      transition={{ duration: 0.25 }}
      className={`sticky top-0 z-50 px-6 border-b transition-colors ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-white/10'
          : 'bg-background border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center gap-6">
        <Link href="/" className="text-xl font-bold tracking-tight shrink-0">
          blog<span className="text-primary">.</span>app
        </Link>

        <div className="flex-1 max-w-md hidden sm:block">
          <SearchBar
            compact
            onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
          />
        </div>

        <nav className="flex items-center gap-3 ml-auto text-sm">
          {status === 'authenticated' ? (
            <>
              <Link
                href="/create-post"
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
              >
                Write
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : status === 'loading' ? (
            <div className="w-20 h-8 rounded-lg bg-white/5 animate-pulse" />
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
