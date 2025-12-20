import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

async function startServer() {
    // Create an instance of ApolloServer
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    // Start the server
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });

    console.log(`🚀 Server ready at: ${url}`);
}

startServer().catch((err) => {
    console.error('Error starting server:', err);
});
