/**
 * Error response utility
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
    error: string;
    details?: string;
}

/**
 * Error handler utility
 */
export class ErrorHandler {
    static handle(error: unknown): { status: number; message: string } {
        if (error instanceof ApiError) {
            return {
                status: error.statusCode,
                message: error.message,
            };
        }

        if (error instanceof Error) {
            console.error('Unexpected error:', error);
            return {
                status: 500,
                message: 'Internal server error',
            };
        }

        console.error('Unknown error:', error);
        return {
            status: 500,
            message: 'An unknown error occurred',
        };
    }
}
