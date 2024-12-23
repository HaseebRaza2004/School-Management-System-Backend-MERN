import passport from "passport";
import dotenv from "dotenv";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import FacebookStrategy from "passport-facebook";
import { UserModel } from "../models/Users.js";

// Load environment variables
dotenv.config();

// Passport serialization/deserialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => done(err, user));
});

// Helper function to find or create user
async function findOrCreateUser(provider, profile) {
    try {
        const existingUser = await UserModel.findOne({ provider, providerId: profile.id });
        if (existingUser) return existingUser;

        const newUser = new UserModel({
            provider,
            providerId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || null,
            profilePhoto: profile.photos?.[0]?.value || null,
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error in findOrCreateUser:", error);
        throw error;
    }
};

// OAuth Strategies
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await findOrCreateUser("google", profile);
            done(null, user);
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await findOrCreateUser("github", profile);
            done(null, user);
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "/auth/facebook/callback",
            profileFields: ["id", "displayName", "photos", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await findOrCreateUser("facebook", profile);
            done(null, user);
        }
    )
);

export default passport;