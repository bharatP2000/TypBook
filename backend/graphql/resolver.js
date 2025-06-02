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


    updateUserProfile: async (_, args, context) => {
      console.log("Inside update resolver");

      const { user } = context;
      if (!user) throw new Error('Not authenticated');

      const {
        nativePlace,
        address,
        mobileNumber,
        profilePicture,
        coverPicture
      } = args;

      const updateData = {
        ...(nativePlace !== undefined && { nativePlace }),
        ...(address !== undefined && { address }),
        ...(mobileNumber !== undefined && { mobileNumber }),
        ...(profilePicture !== undefined && { profilePicture }),
        ...(coverPicture !== undefined && { coverPicture }),
      };

      if (Object.keys(updateData).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found or update failed');
      }

      return updatedUser;
    }



    

    // likePost: async (_, { id }) => {
    //   return await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    // },
    // commentPost: async (_, { id }) => {
    //   return await Post.findByIdAndUpdate(id, { $inc: { comments: 1 } }, { new: true });
    // },
  },
};
