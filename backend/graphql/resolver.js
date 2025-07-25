const Post = require('../models/post');
const User = require('../models/user');
const Event = require('../models/event');
const Notification = require('../models/notification');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  Query: {
    getPosts: async () => {
      return await Post.find().sort({ createdAt: -1 }).populate('user');
    },
    getEvents: async () => {
      console.log("Getting Events")
      const events = await Event.find().sort({ date: 1 }).populate("createdBy");;
      return events;
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
    getAllNotifications: async (_, { skip = 0, limit = 10, search='' }) => {
      const filter = search
      ? { message: { $regex: search, $options: 'i' } }
      : {};
      return await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user') // Add 'profilePic' in User model
        .populate('post');
    },
  },

  Mutation: {
    createPost: async (_, { text, imageBase64 }, context) => {
      const { user } = context;
      console.log("resolver", user);
      if (!user) {
        throw new Error('Not authenticated');
      }

      const fullUser = await User.findById(user.id);
      if (!fullUser) throw new Error('User not found');

      const newPost = new Post({
        text,
        imageBase64,
        user: user.id,
        createdAt: new Date()
      });
      // console.log("resolver",newPost);
      const savedPost =  await newPost.save();

      const message = imageBase64 && text
        ? `${fullUser.username} shared a post with photo`
        : imageBase64
        ? `${fullUser.username} shared a photo`
        : `${fullUser.username} shared a post`;

      const newNotification = new Notification({
        message,
        user: user.id,
        createdAt: new Date(),
      });
      console.log(newNotification);
      await newNotification.save();

      return savedPost;
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
    },

    markNotificationSeen: async (_, { id }) => {
      return await Notification.findByIdAndUpdate(id, { seen: true }, { new: true });
    },

    addEvent: async (_, { description, date }, context) => {
      const { user } = context;
      if (!user) throw new Error('Not authenticated');
      console.log(user.id)
      const newEvent = new Event({
        description,
        date,
        createdBy: user.id, // add user ownership
        cancelled: false,
      });

      await newEvent.save();

      return newEvent;
    },

    updateEvent: async (_, { id, description, date }) => {
      const updated = await Event.findByIdAndUpdate(
        id,
        {
          description,
          date: new Date(date),
        },
        { new: true }
      );
      return updated;
    },

    cancelEvent: async (_, { id }) => {
      const cancelled = await Event.findByIdAndUpdate(
        id,
        { cancelled: true },
        { new: true }
      );
      return cancelled;
    },  


    // likePost: async (_, { id }) => {
    //   return await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    // },
    // commentPost: async (_, { id }) => {
    //   return await Post.findByIdAndUpdate(id, { $inc: { comments: 1 } }, { new: true });
    // },
  },
};
