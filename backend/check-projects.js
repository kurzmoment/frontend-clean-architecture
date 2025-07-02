const { db } = require("./database");

// Check projects table
db.all(
  "SELECT * FROM projects ORDER BY created_at DESC LIMIT 5",
  (err, projects) => {
    if (err) {
      console.error("Error querying projects:", err);
      process.exit(1);
    }

    console.log("Recent projects:");
    projects.forEach((project, index) => {
      console.log(`\nProject ${index + 1}:`);
      console.log(`  ID: ${project.id}`);
      console.log(`  Name: ${project.name}`);
      console.log(`  Description: ${project.description}`);
      console.log(`  User ID: ${project.user_id}`);
      console.log(`  Tag IDs: "${project.tag_ids}"`);
      console.log(`  Confident IDs: "${project.confident_ids}"`);
      console.log(`  Created: ${project.created_at}`);
    });

    process.exit(0);
  }
);
