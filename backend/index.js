require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolver');

const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '').trim()
      : authHeader.trim();
      console.log("Server Page:",token);
      if (token) {
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET);
          console.log("Server Page:",user);
          return { user };
        } catch (err) {
          console.log('Invalid token');
        }
      }
      return {};
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('MongoDB connected'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
  
};

startServer();
