// Load required modules
require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Use Express to create the server
const cors = require("cors"); // Use the CORS package to enable Cross-Origin Resource Sharing
const winston = require("winston");
const path = require("path");
const bodyParser = require("body-parser");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "my-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Create an instance of the Express application
const app = express();

// Import the Mongoose library for MongoDB database connectivity
const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Set the strictQuery option to false to allow for looser queries

// Connect to the MongoDB database using the DATABASE_URL environment variable
mongoose.connect(process.env.MONGODB_CONN, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => logger.error(error)); // Log any connection errors
db.once("open", () => console.log("Connected to Database")); // Log a message when the connection is established

// Use the Express.json() middleware to parse incoming request data as JSON
app.use(express.json());
logger.info(
  "Use the Express.json() middleware to parse incoming request data as JSON"
);

app.use(cors());
logger.info("Use cors");

app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  // Log the error
  logger.error(err);

  // Send an error response to the client
  res.status(500).json({ message: "Internal server error" });
});


// Set up the user and appointment routes using their respective routers
const loginRouter = require("./routing/login");
app.use("/login", loginRouter);
logger.info("Setting up login route");

const tableRouter = require("./routing/table");
app.use("/table", tableRouter);
logger.info("Setting up table route");


app.use(
  "/static",
  express.static(path.resolve(__dirname, "frontend", "static"))
);

app.get("/*", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

// Set up the server to listen on port 3000
app.listen(process.env.PORT, () => console.log("Connected to Server"));
