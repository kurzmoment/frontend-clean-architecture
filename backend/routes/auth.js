const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    db.get(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        if (user) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        db.run(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          function (err) {
            if (err) {
              return res.status(500).json({ message: "Error creating user" });
            }

            // Generate JWT token
            const token = jwt.sign(
              { id: this.lastID, username, email },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );

            // Set cookies
            res.cookie("authToken", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite:
                process.env.NODE_ENV === "production" ? "strict" : "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              path: "/",
            });

            res.cookie(
              "user",
              JSON.stringify({ id: this.lastID, username, email }),
              {
                httpOnly: false, // Allow client-side access
                secure: process.env.NODE_ENV === "production",
                sameSite:
                  process.env.NODE_ENV === "production" ? "strict" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/",
              }
            );

            res.status(201).json({
              message: "User created successfully",
              token,
              user: { id: this.lastID, username, email },
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookies
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.cookie(
      "user",
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
      {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
});

// Get current user
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.clearCookie("user");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
