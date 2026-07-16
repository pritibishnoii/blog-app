<!-- @format -->

# Blog App

Full-stack blog platform — Next.js 15 (App Router) + MongoDB + Mongoose.
Built from the attached PRD/TRD as source of truth (MVP + the chosen nice-to-haves:
comments, likes, tags, image upload, animations).

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable                                                                 | Where to get it                                           |
| ------------------------------------------------------------------------ | --------------------------------------------------------- |
| `MONGODB_URI`                                                            | MongoDB Atlas → Connect → Drivers                         |
| `NEXTAUTH_SECRET`                                                        | run `openssl rand -base64 32`                             |
| `NEXTAUTH_URL`                                                           | `http://localhost:3000` for local dev                     |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary dashboard (only needed for cover image upload) |

```bash
npm run dev
```

Visit http://localhost:3000.

## What's implemented

**Auth** — NextAuth v5 (Credentials + JWT), signup/login, bcrypt password hashing,
`middleware.js` protecting `/dashboard`, `/create-post`, `/edit-post`.

**Posts** — create/edit/delete (owner-only), draft vs published, paginated feed
(10/page), single post view, view counter, auto-generated slug (with duplicate
handling) + excerpt + read time.

**Tags & Search** — tag filter chips, text search on title (MongoDB text index).

**Comments** — nested replies, cascade-deleted when a post is deleted.

**Likes** — toggle like, optimistic UI update.

**Cover images** — Cloudinary upload, falls back to placeholder on failure.

**Animations** — page fade transitions, scroll-reveal + hover-lift on post cards,
heart pop on like, skeleton loaders, navbar blur/shrink on scroll, slide-in
comments, slide-in toasts.

**Rich text** — Tiptap editor (Bold, Italic, Heading, Code, Link, Image).
