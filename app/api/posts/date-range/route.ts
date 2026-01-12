import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PostService } from '@/lib/services/postService';
import { ErrorHandler } from '@/lib/utils/errorHandler';

export async function GET() {
    try {
        await connectDB();

        const dateRange = await PostService.getDateRange();

        return NextResponse.json(dateRange);
    } catch (error) {
        const { status, message } = ErrorHandler.handle(error);
        return NextResponse.json({ error: message }, { status });
    }
}
