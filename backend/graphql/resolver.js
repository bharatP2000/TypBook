const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  Query: {
    getPosts: async () => {
      return await Post.find().sort({ createdAt: -1 }).populate('user', 'username profilepic');
    },
    login: async (_, { email, password }) => {
      // console.log("Login attempt for:", password);

      const user = await User.findOne({ email });
      // console.log("User:", user);
      if (!user) {
        throw new Error('User not found');
      }
      console.log(user.password);
      if (password !== user.password) {
        throw new Error('Incorrect password');
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        id: user._id,
        email: user.email,
        username: user.username,
        token,
      };
    },
  },

  Mutation: {
    createPost: async (_, { content, image, caption }, context) => {
      const userId = context.user.id;

      const post = new Post({
        content,
        image,
        caption,
        createdAt: new Date().toISOString(),
        user: userId,
      });

      return await post.save();
    },
    likePost: async (_, { id }) => {
      return await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    },
    commentPost: async (_, { id }) => {
      return await Post.findByIdAndUpdate(id, { $inc: { comments: 1 } }, { new: true });
    },
  },
};
