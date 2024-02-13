import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import { ApolloServer } from '@apollo/server';

const server = new ApolloServer({ typeDefs, resolvers });


export default server;