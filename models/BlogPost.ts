import mongoose, { Schema, Model } from 'mongoose';

export interface IBlogPost {
    author: string;
    author_email: string;
    title: string;
    status: string;
    allow_comments: number;
    convert_breaks: string;
    allow_pings: number;
    basename: string;
    category: string;
    unique_url: string;
    date: string;
    body: string;
    extended_body: string;
    excerpt: string;
    keywords: string;
    date_parsed: string; // Stored as ISO string in MongoDB
}

const BlogPostSchema = new Schema<IBlogPost>(
    {
        author: { type: String, required: true },
        author_email: { type: String, required: true },
        title: { type: String, required: true },
        status: { type: String, default: 'Publish' },
        allow_comments: { type: Number, default: 1 },
        convert_breaks: { type: String, default: 'wysiwyg' },
        allow_pings: { type: Number, default: 0 },
        basename: { type: String, required: true, unique: true },
        category: { type: String, required: true, index: true },
        unique_url: { type: String, required: true },
        date: { type: String, required: true },
        body: { type: String, required: true },
        extended_body: { type: String, default: '' },
        excerpt: { type: String, default: '' },
        keywords: { type: String, default: '' },
        date_parsed: { type: String, required: true, index: true }, // Stored as ISO string
    },
    {
        timestamps: true,
    }
);

// Create indexes for better search performance
BlogPostSchema.index({ title: 'text', body: 'text', excerpt: 'text' });
BlogPostSchema.index({ category: 1, date_parsed: -1 });

const BlogPost: Model<IBlogPost> =
    mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
