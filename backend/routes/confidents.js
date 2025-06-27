const express = require("express");
const { db } = require("../database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get all confidents for user
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    "SELECT * FROM confidents WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, confidents) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(confidents);
    }
  );
});

// Get single confident
router.get("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const confidentId = req.params.id;

  db.get(
    "SELECT * FROM confidents WHERE id = ? AND user_id = ?",
    [confidentId, userId],
    (err, confident) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (!confident) {
        return res.status(404).json({ message: "Confident not found" });
      }
      res.json(confident);
    }
  );
});

// Create confident
router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Confident name is required" });
  }

  db.run(
    "INSERT INTO confidents (name, description, user_id) VALUES (?, ?, ?)",
    [name, description, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Error creating confident" });
      }

      res.status(201).json({
        message: "Confident created successfully",
        confident: { id: this.lastID, name, description, user_id: userId },
      });
    }
  );
});

// Update confident
router.put("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const confidentId = req.params.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Confident name is required" });
  }

  db.run(
    "UPDATE confidents SET name = ?, description = ? WHERE id = ? AND user_id = ?",
    [name, description, confidentId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Confident not found" });
      }

      res.json({ message: "Confident updated successfully" });
    }
  );
});

// Delete confident
router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const confidentId = req.params.id;

  db.run(
    "DELETE FROM confidents WHERE id = ? AND user_id = ?",
    [confidentId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Confident not found" });
      }

      res.json({ message: "Confident deleted successfully" });
    }
  );
});

module.exports = router;
