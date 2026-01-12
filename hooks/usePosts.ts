import { useState, useEffect } from 'react';
import { buildQueryString } from '@/lib/utils/helpers';

export interface Post {
    _id: string;
    title: string;
    basename: string;
    category: string;
    date: string;
    date_parsed: string;
    excerpt: string;
    body: string;
    author: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PostFilters {
    category?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
}

interface UsePostsResult {
    posts: Post[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
}

export const usePosts = (
    filters: PostFilters,
    page: number,
    limit: number = 12
): UsePostsResult => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Extract filter values for dependency array
    const { category, search, dateFrom, dateTo } = filters;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                const params: Record<string, any> = {
                    page,
                    limit,
                };

                if (category && category !== 'all') {
                    params.category = category;
                }

                if (search) {
                    params.search = search;
                }

                if (dateFrom) {
                    params.dateFrom = dateFrom;
                }

                if (dateTo) {
                    params.dateTo = dateTo;
                }

                const queryString = buildQueryString(params);
                const res = await fetch(`/api/posts?${queryString}`);

                if (!res.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data = await res.json();
                setPosts(data.posts || []);
                setPagination(data.pagination);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setPosts([]);
                setPagination(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category, search, dateFrom, dateTo, page, limit]);

    return {
        posts,
        pagination,
        loading,
        error,
    };
};

export const useCategories = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');

                if (!res.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await res.json();
                setCategories(data.categories || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};

export const useDateRange = () => {
    const [dateRange, setDateRange] = useState<{
        minDate: string | null;
        maxDate: string | null;
    }>({
        minDate: null,
        maxDate: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDateRange = async () => {
            try {
                const res = await fetch('/api/posts/date-range');

                if (!res.ok) {
                    throw new Error('Failed to fetch date range');
                }

                const data = await res.json();
                setDateRange(data);
            } catch (err) {
                console.error('Failed to fetch date range:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDateRange();
    }, []);

    return { dateRange, loading };
};
