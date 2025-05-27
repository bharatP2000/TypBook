const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  Query: {
    getPosts: async () => {
      return await Post.find().sort({ createdAt: -1 }).populate('user');
    },
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
    getPostsByUser: async (_, { userId }) => {
      return await Post.find({ user: userId }).sort({ createdAt: -1 }).populate('user');
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
        { expiresIn: '7d' }
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
    createPost: async (_, { text, imageBase64 }, context) => {
      const { user } = context;
      // console.log("resolver", user);
      if (!user) {
        throw new Error('Not authenticated');
      }

      const newPost = new Post({
        text,
        imageBase64,
        user: user.id,
        createdAt: new Date()
      });
      // console.log("resolver",newPost);
      return await newPost.save();
    },

    updateUserProfile: async (
      _,
      { nativePlace, address, mobileNumber, profilePicture, coverPicture },
      context
    ) => {
      const { user } = context;
      if (!user) throw new Error('Not authenticated');
  
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        {
          ...(nativePlace && { nativePlace }),
          ...(address && { address }),
          ...(mobileNumber && { mobile: mobileNumber }),
          ...(profilePicture && { profilePic: profilePicture }),
          ...(coverPicture && { coverPhoto: coverPicture }),
        },
        { new: true }
      );
  
      return updatedUser;
    },
    // likePost: async (_, { id }) => {
    //   return await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    // },
    // commentPost: async (_, { id }) => {
    //   return await Post.findByIdAndUpdate(id, { $inc: { comments: 1 } }, { new: true });
    // },
  },
};
