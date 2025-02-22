import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { NextRequest } from "next/server";

// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Export as App Router handler
const handler = startServerAndCreateNextHandler(server);
export async function GET(request: NextRequest) {
    return handler(request);
}

export async function POST(request: NextRequest) {
    return handler(request);
}
