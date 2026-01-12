/**
 * Format date to YYYY-MM-DD
 */
export const formatDateToInput = (date: Date | string | null): string => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toISOString().split('T')[0];
};

/**
 * Format date to readable string
 */
export const formatDateToReadable = (dateString: string | Date): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Extract text from HTML and limit length
 */
export const extractTextFromHTML = (html: string, maxLength: number = 200): string => {
    const text = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text;
};

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
        }
    });

    return searchParams.toString();
};
