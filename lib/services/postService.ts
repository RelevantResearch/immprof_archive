import BlogPost, { IBlogPost } from '@/models/BlogPost';

export interface PostFilters {
    category?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PostsResult {
    posts: IBlogPost[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export class PostService {
    /**
     * Build MongoDB query based on filters
     */
    private static buildQuery(filters: PostFilters): any {
        const query: any = {
            status: filters.status || 'Publish'
        };

        // Category filter
        if (filters.category && filters.category !== 'all') {
            query.category = filters.category;
        }

        // Search filter - optimize with $or only when needed
        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { body: { $regex: filters.search, $options: 'i' } },
                { excerpt: { $regex: filters.search, $options: 'i' } },
            ];
        }

        // Date range filter - MongoDB stores dates as ISO strings, so compare as strings
        if (filters.dateFrom || filters.dateTo) {
            query.date_parsed = {};

            if (filters.dateFrom) {
                // Convert to ISO string for comparison (YYYY-MM-DDTHH:MM:SS)
                const fromDate = new Date(filters.dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                const fromString = fromDate.toISOString().split('.')[0]; // Remove milliseconds
                query.date_parsed.$gte = fromString;
            }

            if (filters.dateTo) {
                // Set to end of day for inclusive filtering
                const endDate = new Date(filters.dateTo);
                endDate.setHours(23, 59, 59, 999);
                const toString = endDate.toISOString().split('.')[0]; // Remove milliseconds
                query.date_parsed.$lte = toString;
            }
        }

        return query;
    }

    /**
     * Get posts with pagination and filters
     */
    static async getPosts(
        filters: PostFilters,
        pagination: PaginationParams
    ): Promise<PostsResult> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const query = this.buildQuery(filters);

        // Execute query and count in parallel for better performance
        const [posts, total] = await Promise.all([
            BlogPost.find(query)
                .sort({ date_parsed: -1 })
                .skip(skip)
                .limit(limit)
                .select('-__v') // Exclude version key
                .lean()
                .exec(),
            BlogPost.countDocuments(query).exec(),
        ]);

        return {
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get single post by basename
     */
    static async getPostByBasename(basename: string): Promise<IBlogPost | null> {
        return BlogPost.findOne({
            basename,
            status: 'Publish'
        })
            .select('-__v')
            .lean()
            .exec();
    }

    /**
     * Get all unique categories
     */
    static async getCategories(): Promise<string[]> {
        const categories = await BlogPost.distinct('category', {
            status: 'Publish'
        }).exec();

        return categories.sort();
    }

    /**
     * Get date range of published posts
     */
    static async getDateRange(): Promise<{ minDate: string | null; maxDate: string | null }> {
        const [minPost, maxPost] = await Promise.all([
            BlogPost.findOne({ status: 'Publish' })
                .sort({ date_parsed: 1 })
                .select('date_parsed')
                .lean()
                .exec(),
            BlogPost.findOne({ status: 'Publish' })
                .sort({ date_parsed: -1 })
                .select('date_parsed')
                .lean()
                .exec(),
        ]);

        return {
            minDate: minPost?.date_parsed || null,
            maxDate: maxPost?.date_parsed || null,
        };
    }
}
