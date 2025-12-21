import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET() {
    try {
        await connectDB();

        const categories = await BlogPost.distinct('category', { status: 'Publish' });

        return NextResponse.json({ categories: categories.sort() });
    } catch (error) {
        console.error('Categories fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
