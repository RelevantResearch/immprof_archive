import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        await connectDB();

        // Clear existing data
        await BlogPost.deleteMany({});

        // Read the JSON file with better error handling
        const filePath = path.join(process.cwd(), '..', 'blog_posts3.json');

        // Read file and sanitize
        let fileContents = fs.readFileSync(filePath, 'utf8');

        // Try to parse with lenient mode
        let posts;
        try {
            posts = JSON.parse(fileContents);
        } catch (parseError) {
            // If parsing fails, try to fix common issues
            console.log('Attempting to fix JSON...');
            fileContents = fileContents.replace(/[\u0000-\u001F]+/g, ''); // Remove control characters
            posts = JSON.parse(fileContents);
        }

        // Filter out invalid posts and sanitize data
        const validPosts = posts.filter((post: any) => {
            return post.title && post.basename && post.category && post.date_parsed;
        }).map((post: any) => ({
            ...post,
            body: post.body || '',
            extended_body: post.extended_body || '',
            excerpt: post.excerpt || '',
            keywords: post.keywords || '',
        }));

        // Insert in batches to avoid memory issues
        const batchSize = 100;
        let totalInserted = 0;

        for (let i = 0; i < validPosts.length; i += batchSize) {
            const batch = validPosts.slice(i, i + batchSize);
            await BlogPost.insertMany(batch, { ordered: false }).catch((err) => {
                console.log(`Batch ${i / batchSize + 1} partial success:`, err.writeErrors?.length || 0, 'errors');
            });
            totalInserted += batch.length;
            console.log(`Processed ${totalInserted} / ${validPosts.length} posts`);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully processed ${totalInserted} blog posts`,
            count: totalInserted,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
}
