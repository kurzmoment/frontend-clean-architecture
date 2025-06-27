const express = require("express");
const { db } = require("../database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get all tags for user
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    "SELECT * FROM tags WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, tags) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(tags);
    }
  );
});

// Get single tag
router.get("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const tagId = req.params.id;

  db.get(
    "SELECT * FROM tags WHERE id = ? AND user_id = ?",
    [tagId, userId],
    (err, tag) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      res.json(tag);
    }
  );
});

// Create tag
router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, color } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Tag name is required" });
  }

  const tagColor = color || "#007bff";

  db.run(
    "INSERT INTO tags (name, color, user_id) VALUES (?, ?, ?)",
    [name, tagColor, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Error creating tag" });
      }

      res.status(201).json({
        message: "Tag created successfully",
        tag: { id: this.lastID, name, color: tagColor, user_id: userId },
      });
    }
  );
});

// Update tag
router.put("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const tagId = req.params.id;
  const { name, color } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Tag name is required" });
  }

  const tagColor = color || "#007bff";

  db.run(
    "UPDATE tags SET name = ?, color = ? WHERE id = ? AND user_id = ?",
    [name, tagColor, tagId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Tag not found" });
      }

      res.json({ message: "Tag updated successfully" });
    }
  );
});

// Delete tag
router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const tagId = req.params.id;

  db.run(
    "DELETE FROM tags WHERE id = ? AND user_id = ?",
    [tagId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Tag not found" });
      }

      res.json({ message: "Tag deleted successfully" });
    }
  );
});

module.exports = router;
