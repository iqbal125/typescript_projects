// Mock third-party API responses
interface UserData {
    id: number;
    name: string;
    email: string;
}

interface PostData {
    id: number;
    userId: number;
    title: string;
    body: string;
}

interface CommentData {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API calls
export const mockApi = {
    async getUser(id: number): Promise<UserData> {
        await delay(Math.random() * 1000 + 500); // 500-1500ms delay
        return {
            id,
            name: `User ${id}`,
            email: `user${id}@example.com`
        };
    },

    async getPost(id: number): Promise<PostData> {
        await delay(Math.random() * 1000 + 500);
        return {
            id,
            userId: Math.floor(Math.random() * 10) + 1,
            title: `Post Title ${id}`,
            body: `This is the body of post ${id}`
        };
    },

    async getComments(postId: number): Promise<CommentData[]> {
        await delay(Math.random() * 1000 + 500);
        return Array.from({ length: 3 }, (_, i) => ({
            id: postId * 10 + i,
            postId,
            name: `Commenter ${i + 1}`,
            email: `commenter${i + 1}@example.com`,
            body: `Comment ${i + 1} on post ${postId}`
        }));
    },

    async getUserPosts(userId: number): Promise<PostData[]> {
        await delay(Math.random() * 1000 + 500);
        return Array.from({ length: 5 }, (_, i) => ({
            id: userId * 100 + i,
            userId,
            title: `Post ${i + 1} by User ${userId}`,
            body: `Content of post ${i + 1}`
        }));
    }
};
