import express from "express";
import passport from "passport";
import dotenv from "dotenv";

// // Load environment variables
dotenv.config();

const router = express.Router();

// Authentication routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/profile")
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => res.redirect("/profile")
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => res.redirect("/profile")
);

// Protected profile route
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
  res.json(req.user);
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
