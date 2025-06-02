const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
    nativePlace: String
    address: String
    mobileNumber: String
    profilePicture: String
    coverPicture: String
  }

  type Post {
    id: ID!
    text: String
    imageBase64: String
    user: User!
    createdAt: String
  }

  type Query {
    login(email: String!, password: String!): User
    getPosts: [Post]
    getUser(id: ID!): User
    getPostsByUser(userId: ID!): [Post]
  }

  type Mutation {
    createPost(text: String, imageBase64: String): Post
    updateUserProfile(
      nativePlace: String
      address: String
      mobileNumber: String
      profilePicture: String
      coverPicture: String
    ): User
  }
`;
