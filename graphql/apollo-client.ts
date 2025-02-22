import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = () =>
    new ApolloClient({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
        cache: new InMemoryCache(),
    });

export const getApolloClient = (): ApolloClient<NormalizedCacheObject> => {
    if (!apolloClient) {
        apolloClient = createApolloClient();
    }
    return apolloClient;
};
