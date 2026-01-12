import { NextRequest } from 'next/server';
import { PostFilters, PaginationParams } from '@/lib/services/postService';

export class QueryParser {
    /**
     * Parse pagination parameters from request
     */
    static parsePagination(searchParams: URLSearchParams): PaginationParams {
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '12', 10)));

        return { page, limit };
    }

    /**
     * Parse filter parameters from request
     */
    static parseFilters(searchParams: URLSearchParams): PostFilters {
        const filters: PostFilters = {};

        const category = searchParams.get('category');
        if (category) {
            filters.category = category;
        }

        const search = searchParams.get('search');
        if (search) {
            filters.search = search.trim();
        }

        const dateFrom = searchParams.get('dateFrom');
        if (dateFrom && this.isValidDate(dateFrom)) {
            filters.dateFrom = dateFrom;
        }

        const dateTo = searchParams.get('dateTo');
        if (dateTo && this.isValidDate(dateTo)) {
            filters.dateTo = dateTo;
        }

        const status = searchParams.get('status');
        if (status) {
            filters.status = status;
        }

        return filters;
    }

    /**
     * Validate date string
     */
    private static isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }

    /**
     * Parse all query parameters from request
     */
    static parseRequest(request: NextRequest) {
        const searchParams = request.nextUrl.searchParams;
        return {
            filters: this.parseFilters(searchParams),
            pagination: this.parsePagination(searchParams),
        };
    }
}
