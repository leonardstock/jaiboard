import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = () =>
    new ApolloClient({
        uri: "http://localhost:3000/api/graphql", // App Router API path
        cache: new InMemoryCache(),
    });

export const getApolloClient = (): ApolloClient<NormalizedCacheObject> => {
    if (!apolloClient) {
        apolloClient = createApolloClient();
    }
    return apolloClient;
};
