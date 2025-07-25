import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.status(201).json({ message: "User created" });
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "User logged in",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   console.log("🔐 Login attempt with:", username);

//   const user = await User.findOne({ username });

//   if (!user) {
//     console.log("❌ User not found");
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   console.log("✅ User found:", user.username);
//   console.log("👉 Plain password:", password);
//   console.log("🔒 Hashed password in DB:", user.password);

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     console.log("❌ Password did not match");
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   console.log("✅ Password matched");

//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });

//   res.json({ token });
// });

export default router;
