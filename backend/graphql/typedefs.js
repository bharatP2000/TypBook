const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Post {
    id: ID!
    content: String!
    image: String
    caption: String
    createdAt: String
    likes: Int
    comments: Int
    user: User!
  }

  type Query {
    login(email: String!, password: String!): User
    getPosts: [Post]
  }

  type Mutation {
    createPost(content: String!, image: String, caption: String): Post
    likePost(id: ID!): Post
    commentPost(id: ID!): Post
    updatePost(id: ID!, content: String, image: String, caption: String): Post
  }
`;
