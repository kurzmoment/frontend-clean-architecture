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

// Manage project confidents (add/remove based on frontend data)
router.post("/:id/confidents", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const { confident_ids } = req.body; // Array of confident IDs that should be associated with the project

  if (!Array.isArray(confident_ids)) {
    return res.status(400).json({ message: "confident_ids must be an array" });
  }

  // Verify project belongs to user
  db.get(
    "SELECT id FROM projects WHERE id = ? AND user_id = ?",
    [projectId, userId],
    (err, project) => {
      if (err || !project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Verify all confidents belong to user
      if (confident_ids.length > 0) {
        const placeholders = confident_ids.map(() => "?").join(",");
        db.all(
          `SELECT id FROM confidents WHERE id IN (${placeholders}) AND user_id = ?`,
          [...confident_ids, userId],
          (err, confidents) => {
            if (err) {
              return res.status(500).json({ message: "Database error" });
            }
            if (confidents.length !== confident_ids.length) {
              return res.status(400).json({
                message:
                  "One or more confidents not found or don't belong to user",
              });
            }

            // Start transaction to manage confidents
            db.serialize(() => {
              db.run("BEGIN TRANSACTION");

              // Remove all existing confidents for this project
              db.run(
                "DELETE FROM project_confidents WHERE project_id = ?",
                [projectId],
                function (err) {
                  if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ message: "Database error" });
                  }

                  // Add new confidents if any
                  if (confident_ids.length > 0) {
                    const insertStmt = db.prepare(
                      "INSERT INTO project_confidents (project_id, confident_id) VALUES (?, ?)"
                    );

                    let completed = 0;
                    let hasError = false;

                    confident_ids.forEach((confidentId) => {
                      insertStmt.run([projectId, confidentId], function (err) {
                        if (err && !hasError) {
                          hasError = true;
                          db.run("ROLLBACK");
                          return res
                            .status(500)
                            .json({ message: "Database error" });
                        }

                        completed++;
                        if (completed === confident_ids.length && !hasError) {
                          insertStmt.finalize();
                          db.run("COMMIT");
                          res.json({
                            message: "Project confidents updated successfully",
                            confident_ids: confident_ids,
                          });
                        }
                      });
                    });
                  } else {
                    // No confidents to add, just commit the removal
                    db.run("COMMIT");
                    res.json({
                      message: "Project confidents updated successfully",
                      confident_ids: [],
                    });
                  }
                }
              );
            });
          }
        );
      } else {
        // No confidents provided, just remove all existing confidents
        db.run(
          "DELETE FROM project_confidents WHERE project_id = ?",
          [projectId],
          function (err) {
            if (err) {
              return res.status(500).json({ message: "Database error" });
            }
            res.json({
              message: "Project confidents updated successfully",
              confident_ids: [],
            });
          }
        );
      }
    }
  );
});

// Remove confident from project (keeping for backward compatibility)
router.delete(
  "/:id/confidents/:confident_id",
  authenticateToken,
  (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const confidentId = req.params.confident_id;

    // Verify project belongs to user
    db.get(
      "SELECT id FROM projects WHERE id = ? AND user_id = ?",
      [projectId, userId],
      (err, project) => {
        if (err || !project) {
          return res.status(404).json({ message: "Project not found" });
        }

        db.run(
          "DELETE FROM project_confidents WHERE project_id = ? AND confident_id = ?",
          [projectId, confidentId],
          function (err) {
            if (err) {
              return res.status(500).json({ message: "Database error" });
            }

            res.json({
              message: "Confident removed from project successfully",
            });
          }
        );
      }
    );
  }
);

// Manage project tags (add/remove based on frontend data)
router.post("/:id/tags", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const { tag_ids } = req.body; // Array of tag IDs that should be associated with the project

  if (!Array.isArray(tag_ids)) {
    return res.status(400).json({ message: "tag_ids must be an array" });
  }

  // Verify project belongs to user
  db.get(
    "SELECT id FROM projects WHERE id = ? AND user_id = ?",
    [projectId, userId],
    (err, project) => {
      if (err || !project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Verify all tags belong to user
      if (tag_ids.length > 0) {
        const placeholders = tag_ids.map(() => "?").join(",");
        db.all(
          `SELECT id FROM tags WHERE id IN (${placeholders}) AND user_id = ?`,
          [...tag_ids, userId],
          (err, tags) => {
            if (err) {
              return res.status(500).json({ message: "Database error" });
            }
            if (tags.length !== tag_ids.length) {
              return res.status(400).json({
                message: "One or more tags not found or don't belong to user",
              });
            }

            // Start transaction to manage tags
            db.serialize(() => {
              db.run("BEGIN TRANSACTION");

              // Remove all existing tags for this project
              db.run(
                "DELETE FROM project_tags WHERE project_id = ?",
                [projectId],
                function (err) {
                  if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ message: "Database error" });
                  }

                  // Add new tags if any
                  if (tag_ids.length > 0) {
                    const insertStmt = db.prepare(
                      "INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)"
                    );

                    let completed = 0;
                    let hasError = false;

                    tag_ids.forEach((tagId) => {
                      insertStmt.run([projectId, tagId], function (err) {
                        if (err && !hasError) {
                          hasError = true;
                          db.run("ROLLBACK");
                          return res
                            .status(500)
                            .json({ message: "Database error" });
                        }

                        completed++;
                        if (completed === tag_ids.length && !hasError) {
                          insertStmt.finalize();
                          db.run("COMMIT");
                          res.json({
                            message: "Project tags updated successfully",
                            tag_ids: tag_ids,
                          });
                        }
                      });
                    });
                  } else {
                    // No tags to add, just commit the removal
                    db.run("COMMIT");
                    res.json({
                      message: "Project tags updated successfully",
                      tag_ids: [],
                    });
                  }
                }
              );
            });
          }
        );
      } else {
        // No tags provided, just remove all existing tags
        db.run(
          "DELETE FROM project_tags WHERE project_id = ?",
          [projectId],
          function (err) {
            if (err) {
              return res.status(500).json({ message: "Database error" });
            }
            res.json({
              message: "Project tags updated successfully",
              tag_ids: [],
            });
          }
        );
      }
    }
  );
});

// Remove tag from project (keeping for backward compatibility)
router.delete("/:id/tags/:tag_id", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const tagId = req.params.tag_id;

  // Verify project belongs to user
  db.get(
    "SELECT id FROM projects WHERE id = ? AND user_id = ?",
    [projectId, userId],
    (err, project) => {
      if (err || !project) {
        return res.status(404).json({ message: "Project not found" });
      }

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
    }
  );
});

module.exports = router;
