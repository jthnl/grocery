// User Authentication APIs
import express from "express";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";
import { User } from "../model/models";
import { userRegistrationSchema } from "../model/joi";
import * as db from "../database/db";

const router = express.Router();

// passport login user
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in successfully." });
});

// passport logout user
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully." });
  });
});

// get user profile
router.get("/profile", (req, res) => {
  const authenticatedUserId = (req.user as User).userId;
  res.json({ userId: authenticatedUserId });
});

// register a new user
router.post("/register", async (req, res) => {
  try {
    const { error, value } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await db.getUserByEmail(value.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const newUser: User = {
      userId: uuidv4(),
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
    };

    await db.registerNewUser(newUser, value.password);

    res.json({ message: "User registered successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
