import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload — cover image upload (multipart/form-data, field name "file")
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, { folder: 'blog-app' });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    // Edge case per doc: "Image upload fails → fallback to default placeholder cover"
    // (handled client-side by leaving coverImage empty if this errors)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
