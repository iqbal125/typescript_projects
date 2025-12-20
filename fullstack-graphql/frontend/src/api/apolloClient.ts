import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Create an HTTP link to the GraphQL server
const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
});

// Create the Apollo Client instance
const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export default apolloClient;
