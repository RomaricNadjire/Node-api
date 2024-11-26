const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./apiRouter").router;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", apiRouter);

// Route to handle GET requests at the root URL ("/")

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<h1>Welcome to my API!</h1>`); // Send a response to the client
});

// Error handling middleware for 404 routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server on port 3000
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
