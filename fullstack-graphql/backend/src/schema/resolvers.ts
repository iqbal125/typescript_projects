interface Book {
    id: string;
    title: string;
    author: string;
}

// Sample data
const books: Book[] = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: '3', title: '1984', author: 'George Orwell' },
];

export const resolvers = {
    Query: {
        books: () => books,
        book: (_: any, { id }: { id: string }) => books.find((book) => book.id === id),
    },
    Mutation: {
        addBook: (_: any, { title, author }: { title: string; author: string }) => {
            const newBook: Book = {
                id: String(books.length + 1),
                title,
                author,
            };
            books.push(newBook);
            return newBook;
        },
    },
};
