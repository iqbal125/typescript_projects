import type { Context, Next } from "hono";

// Rate limiting store
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Mock rate limiting middleware
export const rateLimit = (maxRequests: number, windowMs: number) => {
    return async (c: Context, next: Next) => {
        const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
        const now = Date.now();

        let entry = rateLimitStore.get(ip);

        // Reset if window expired
        if (!entry || now > entry.resetTime) {
            entry = {
                count: 0,
                resetTime: now + windowMs
            };
            rateLimitStore.set(ip, entry);
        }

        // Check limit
        if (entry.count >= maxRequests) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
            return c.json({
                error: "Too many requests",
                retryAfter: `${retryAfter}s`
            }, 429);
        }

        // Increment counter
        entry.count++;

        // Add rate limit headers
        c.header('X-RateLimit-Limit', maxRequests.toString());
        c.header('X-RateLimit-Remaining', (maxRequests - entry.count).toString());
        c.header('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

        await next();
    };
};
