import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ basename: string }> }
) {
    try {
        await connectDB();
        const { basename } = await params;

        const post = await BlogPost.findOne({ basename, status: 'Publish' }).lean();

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error('Post fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}
