import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Blog App',
  description: 'A modern full-stack blog platform built with Next.js 15 and MongoDB.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-background text-foreground min-h-screen`}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <PageTransition>{children}</PageTransition>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
