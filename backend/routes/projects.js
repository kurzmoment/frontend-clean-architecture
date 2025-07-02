const express = require("express");
const { db } = require("../database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get all projects for user
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    `
    SELECT p.*, 
           GROUP_CONCAT(DISTINCT c.id) as confident_ids,
           GROUP_CONCAT(DISTINCT c.name) as confident_names,
           GROUP_CONCAT(DISTINCT t.id) as tag_ids,
           GROUP_CONCAT(DISTINCT t.name) as tag_names,
           GROUP_CONCAT(DISTINCT t.color) as tag_colors
    FROM projects p
    LEFT JOIN project_confidents pc ON p.id = pc.project_id
    LEFT JOIN confidents c ON pc.confident_id = c.id
    LEFT JOIN project_tags pt ON p.id = pt.project_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.user_id = ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `,
    [userId],
    (err, projects) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // Parse the concatenated strings into arrays
      const formattedProjects = projects.map((project) => ({
        ...project,
        confidents: project.confident_ids
          ? project.confident_ids.split(",").map((id, index) => ({
              id: parseInt(id),
              name: project.confident_names.split(",")[index],
            }))
          : [],
        tags: project.tag_ids
          ? project.tag_ids.split(",").map((id, index) => ({
              id: parseInt(id),
              name: project.tag_names.split(",")[index],
              color: project.tag_colors.split(",")[index],
            }))
          : [],
      }));

      res.json(formattedProjects);
    }
  );
});

// Get single project
router.get("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;

  db.get(
    `
    SELECT p.*, 
           GROUP_CONCAT(DISTINCT c.id) as confident_ids,
           GROUP_CONCAT(DISTINCT c.name) as confident_names,
           GROUP_CONCAT(DISTINCT t.id) as tag_ids,
           GROUP_CONCAT(DISTINCT t.name) as tag_names,
           GROUP_CONCAT(DISTINCT t.color) as tag_colors
    FROM projects p
    LEFT JOIN project_confidents pc ON p.id = pc.project_id
    LEFT JOIN confidents c ON pc.confident_id = c.id
    LEFT JOIN project_tags pt ON p.id = pt.project_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.id = ? AND p.user_id = ?
    GROUP BY p.id
  `,
    [projectId, userId],
    (err, project) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Parse the concatenated strings into arrays
      const formattedProject = {
        ...project,
        confidents: project.confident_ids
          ? project.confident_ids.split(",").map((id, index) => ({
              id: parseInt(id),
              name: project.confident_names.split(",")[index],
            }))
          : [],
        tags: project.tag_ids
          ? project.tag_ids.split(",").map((id, index) => ({
              id: parseInt(id),
              name: project.tag_names.split(",")[index],
              color: project.tag_colors.split(",")[index],
            }))
          : [],
      };

      res.json(formattedProject);
    }
  );
});

// Create project
router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  db.run(
    "INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)",
    [name, description, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Error creating project" });
      }

      res.status(201).json({
        message: "Project created successfully",
        project: { id: this.lastID, name, description, user_id: userId },
      });
    }
  );
});

// Update project
router.put("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  db.run(
    "UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?",
    [name, description, projectId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json({ message: "Project updated successfully" });
    }
  );
});

// Delete project
router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;

  db.run(
    "DELETE FROM projects WHERE id = ? AND user_id = ?",
    [projectId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json({ message: "Project deleted successfully" });
    }
  );
});

// Add confident to project
router.post("/:id/confidents", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const { confident_id } = req.body;

  console.log("CONFIDENT ID:", confident_id);

  if (!confident_id) {
    return res.status(400).json({ message: "Confident ID is required" });
  }

  // Verify project belongs to user
  db.get(
    "SELECT id FROM projects WHERE id = ? AND user_id = ?",
    [projectId, userId],
    (err, project) => {
      if (err || !project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Verify confident belongs to user
      db.get(
        "SELECT id FROM confidents WHERE id = ? AND user_id = ?",
        [confident_id, userId],
        (err, confident) => {
          if (err || !confident) {
            return res.status(404).json({ message: "Confident not found" });
          }

          // Add confident to project
          db.run(
            "INSERT INTO project_confidents (project_id, confident_id) VALUES (?, ?)",
            [projectId, confident_id],
            function (err) {
              if (err) {
                if (err.code === "SQLITE_CONSTRAINT") {
                  return res
                    .status(400)
                    .json({ message: "Confident already added to project" });
                }
                return res.status(500).json({ message: "Database error" });
              }

              res.json({ message: "Confident added to project successfully" });
            }
          );
        }
      );
    }
  );
});

// Remove confident from project
router.delete(
  "/:id/confidents/:confident_id",
  authenticateToken,
  (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const confidentId = req.params.confident_id;

    db.run(
      "DELETE FROM project_confidents WHERE project_id = ? AND confident_id = ?",
      [projectId, confidentId],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        res.json({ message: "Confident removed from project successfully" });
      }
    );
  }
);

// Add tag to project
router.post("/:id/tags", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const { tag_id } = req.body;

  if (!tag_id) {
    return res.status(400).json({ message: "Tag ID is required" });
  }

  // Verify project belongs to user
  db.get(
    "SELECT id FROM projects WHERE id = ? AND user_id = ?",
    [projectId, userId],
    (err, project) => {
      if (err || !project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Verify tag belongs to user
      db.get(
        "SELECT id FROM tags WHERE id = ? AND user_id = ?",
        [tag_id, userId],
        (err, tag) => {
          if (err || !tag) {
            return res.status(404).json({ message: "Tag not found" });
          }

          // Add tag to project
          db.run(
            "INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)",
            [projectId, tag_id],
            function (err) {
              if (err) {
                if (err.code === "SQLITE_CONSTRAINT") {
                  return res
                    .status(400)
                    .json({ message: "Tag already added to project" });
                }
                return res.status(500).json({ message: "Database error" });
              }

              res.json({ message: "Tag added to project successfully" });
            }
          );
        }
      );
    }
  );
});

// Remove tag from project
router.delete("/:id/tags/:tag_id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const tagId = req.params.tag_id;

  db.run(
    "DELETE FROM project_tags WHERE project_id = ? AND tag_id = ?",
    [projectId, tagId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Tag removed from project successfully" });
    }
  );
});

module.exports = router;
