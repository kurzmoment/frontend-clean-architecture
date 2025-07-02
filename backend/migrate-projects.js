const { db } = require("./database");

// Migration to add tag_ids and confident_ids columns to projects table
const migrateProjects = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Add tag_ids column if it doesn't exist
      db.run(
        `
        ALTER TABLE projects ADD COLUMN tag_ids TEXT
      `,
        (err) => {
          if (err && !err.message.includes("duplicate column name")) {
            console.error("Error adding tag_ids column:", err);
          } else {
            console.log("tag_ids column added or already exists");
          }
        }
      );

      // Add confident_ids column if it doesn't exist
      db.run(
        `
        ALTER TABLE projects ADD COLUMN confident_ids TEXT
      `,
        (err) => {
          if (err && !err.message.includes("duplicate column name")) {
            console.error("Error adding confident_ids column:", err);
          } else {
            console.log("confident_ids column added or already exists");
          }

          resolve();
        }
      );
    });
  });
};

// Run migration
migrateProjects()
  .then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
