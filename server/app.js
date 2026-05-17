// Main Express server for ShelterTrack API
const express = require("express");
//const cors = require("cors"); //for front-end, either enable CORS or use a proxy in development environment

const app = express();
const port = 8888;

// Import controllers for pet and shelter operations
const petController = require("./controller/pet");
const shelterController = require("./controller/shelter");

// Middleware setup
//app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Root endpoint for API status
app.get("/", (req, res) => {
  res.send("ShelterTrack API is running!");
});

// Mount API routes
app.use("/pet", petController);
app.use("/shelter", shelterController);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: "internalServerError",
    message: "An unexpected error occurred",
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    code: "notFound",
    message: "Endpoint not found",
  });
});

// Start server
app.listen(port, () => {
  console.log(`ShelterTrack API is running on http://localhost:${port}`);
});