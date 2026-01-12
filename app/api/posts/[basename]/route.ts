import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PostService } from '@/lib/services/postService';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ basename: string }> }
) {
    try {
        await connectDB();
        const { basename } = await params;

        const post = await PostService.getPostByBasename(basename);

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ post });
    } catch (error) {
        const { status, message } = ErrorHandler.handle(error);
        return NextResponse.json({ error: message }, { status });
    }
}
