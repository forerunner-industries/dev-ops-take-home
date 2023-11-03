const express = require("express");
const { Pool } = require("pg"); // Import the PostgreSQL library

const app = express();
// get environment variables PORT, USER, and PASSWORD
const { PORT: port, USER: user, PASSWORD: password } = process.env;

// Create a PostgreSQL connection pool
const pool = new Pool({
  user,
  password,
  host: "db",
  port: 5432,
});

// Track the application start time
const startTime = Date.now();
const startupTimeRequired =
  Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000;

app.get("/healthcheck", (req, res) => {
  // Calculate the time elapsed since the application started (in milliseconds)
  const elapsedTime = Date.now() - startTime;

  if (elapsedTime < startupTimeRequired) {
    // If less than the required startup time has passed, return a 503
    res.status(503).send("Service Unavailable - Application Starting");
  } else {
    // Attempt to access the database
    pool.query("SELECT 1", (error, result) => {
      if (error) {
        // If an error occurs, return a 503
        res.status(503).send("Database Connection Error");
      } else {
        // If the query is successful, return a 200
        res.status(200).send("Healthcheck OK");
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});