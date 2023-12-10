const typeDefs = `#graphql
  type Book {
    title: [String]
  }
  type Query {
    books: [Book]
  }
`;

export default typeDefs;