import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";

// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Export as App Router handler
const handler = startServerAndCreateNextHandler(server);
export { handler as GET, handler as POST };
