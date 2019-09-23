const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const models = require('../database/models');
const UserAPI = require('../datasources/user');
const SurveyAPI = require('../datasources/survey');
const FeedbackAPI = require('../datasources/feedback');
const { verifyUserToken } = require('../helpers/token');
require('dotenv').config();

const app = express();

app.use(passport.initialize());
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.URL || 'http://localhost:5000/google'
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, {
        accessToken,
        refreshToken,
        profile
      });
    }
  )
);

const appUrl =
  process.env.URL === 'https://stage-atf-fe.herokuapp.com/google'
    ? process.env.STAGE_URL
    : process.env.REDIRECT_URL;

app.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }),
  (req, res) => {
    res.redirect(appUrl);
    app.locals.profile = req.user.profile;
    // console.log('========', app.locals.profile.photos[0].value);
  }
);
/**
 * create instance of UserAPI and SurveyAPI
 *
 */
const dataSources = () => ({
  User: new UserAPI(),
  Survey: new SurveyAPI(),
  Feedback: new FeedbackAPI()
});
const context = async ({ req }) => {
  const token = (req.headers && req.headers.authorization) || '';
  const user = await verifyUserToken(token);
  const userData = user && user.get();
  return {
    models,
    app,
    user: userData
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources,
  introspection: true,
  playground: true,
  engine: {
    apiKey: process.env.ENGINE_API_KEY
  }
});

server.applyMiddleware({ app });

module.exports = {
  app,
  server,
  graphqlPath: server.graphqlPath,
  dataSources,
  context,
  UserAPI,
  SurveyAPI,
  typeDefs,
  resolvers,
  models
};
