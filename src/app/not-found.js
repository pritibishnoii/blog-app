import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-md mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-bold mb-3">404</h1>
      <p className="text-gray-400 mb-6">This page doesn&apos;t exist, or the post was removed.</p>
      <Link href="/" className="text-primary hover:underline">
        Back to home
      </Link>
    </main>
  );
}
