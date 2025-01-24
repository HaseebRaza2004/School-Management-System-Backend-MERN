import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import cors from "cors";
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { UserModel } from './models/Users.js';
import userRoutes from "./routers/Users.js";
import courseRoutes from "./routers/Courses.js";
import requestRoutes from "./routers/Requests.js";

// Load environment variables
dotenv.config();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODBURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Express App
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Serialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  UserModel.findById(id).then((user) => done(null, user)).catch((err) => done(err));
});

// Strategies Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser('google', profile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser('github', profile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser('facebook', profile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Helper Function: Find or Create UserModel
async function findOrCreateUser(provider, profile) {
  const existingUser = await UserModel.findOne({ provider, providerId: profile.id });
  if (existingUser) return existingUser;

  const newUser = new UserModel({
    provider,
    providerId: profile.id,
    name: profile.displayName || profile.username,
    email: profile.emails ? profile.emails[0].value : null,
    profilePhoto: profile.photos ? profile.photos[0].value : null,
  });
  await newUser.save();
  return newUser;
};

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Unauthorized' });
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });

    res.clearCookie('connect.sid', { path: '/' }); // Replace 'connect.sid' with your session cookie name
    res.status(200).json({ message: 'Successfully logged out' });
  });
});

app.use("/users", userRoutes);
app.use("/course", courseRoutes);
app.use("/request", requestRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`));