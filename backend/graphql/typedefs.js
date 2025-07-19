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

  type Notification {
    id: ID!
    user: User!
    message: String!
    post: Post!
    createdAt: String!
    seen: Boolean!
  }

  type Event {
    id: ID!
    description: String!
    date: String!
    cancelled: Boolean!
    createdAt: String!
    createdBy: User!
  }

  type Query {
    login(email: String!, password: String!): User
    getPosts: [Post]
    getUser(id: ID!): User
    getPostsByUser(userId: ID!): [Post]
    getAllNotifications(skip: Int, limit: Int, search: String): [Notification]
    getEvents: [Event]
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
    markNotificationSeen(id: ID!): Notification
    addEvent(description: String!, date: String!): Event!
    updateEvent(id: ID!, description: String!, date: String!): Event
    cancelEvent(id: ID!): Event
  }
`;
