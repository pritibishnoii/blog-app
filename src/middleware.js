import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';

// Uses the edge-compatible config only — no Mongoose/Credentials here.
const { auth } = NextAuth(authConfig);

// Protected routes per TRD: /dashboard, /create-post (+ /edit-post, the natural
// extension of "own posts control" from the PRD's must-have Edit/Delete feature).
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/create-post') ||
    pathname.startsWith('/edit-post');

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/create-post/:path*', '/edit-post/:path*'],
};
