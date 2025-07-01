const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DB_PATH || "./database.sqlite";
const db = new sqlite3.Database(dbPath);

// Migration to add new columns to confidents table
const migrateConfidents = () => {
  return new Promise((resolve, reject) => {
    console.log("Starting confidents table migration...");

    db.serialize(() => {
      // Add new columns to confidents table
      const columns = [
        "email TEXT",
        "phone TEXT",
        "company TEXT",
        "position TEXT",
        "notes TEXT",
      ];

      columns.forEach((column) => {
        const columnName = column.split(" ")[0];
        db.run(`ALTER TABLE confidents ADD COLUMN ${column}`, (err) => {
          if (err && !err.message.includes("duplicate column name")) {
            console.error(`Error adding column ${columnName}:`, err.message);
          } else {
            console.log(
              `Column ${columnName} added successfully (or already exists)`
            );
          }
        });
      });

      // Add updated_at column if it doesn't exist
      db.run(
        "ALTER TABLE confidents ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP",
        (err) => {
          if (err && !err.message.includes("duplicate column name")) {
            console.error("Error adding updated_at column:", err.message);
          } else {
            console.log(
              "updated_at column added successfully (or already exists)"
            );
          }
        }
      );

      // Wait a bit for all operations to complete
      setTimeout(() => {
        console.log("Migration completed!");
        db.close();
        resolve();
      }, 1000);
    });
  });
};

// Run migration
migrateConfidents()
  .then(() => {
    console.log("Migration script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
