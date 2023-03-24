// Import necessary dependencies
const express = require("express"); // Import the Express library
const router = express.Router(); // Create a new router instance
const Table = require("../schemas/table"); // Import the Table model
const bcrypt = require("bcrypt"); // Import bcrypt for hashing passwords
const path = require("path");

// Route for getting all tables
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find();
    res.send(tables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Route for getting all tables
router.get("/:status", async (req, res) => {
  try {
    const status = req.params.status;
    const table = await Table.find({ status: status });
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }
    return res.json(table);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get table" });
  }
});

// Route for creating a new table
router.post("/", async (req, res) => {
  try {
    // Get the table data from the request body
    const { tableNr, capacity, status } = req.body;

    // Create a new table document with the hashed password
    const table = await Table.create({
      tableNr,
      capacity,
      status,
    });

    // Return the new user document as the response
    res.json(table);
  } catch (error) {
    // Handle any errors that occur during table creation
    console.error(error); // Log the error to the console
    if (error.code === 11000 && error.keyPattern && error.keyPattern.tableNr) {
      res.status(400).json({ error: "Table number already exists" });
    } else {
      res.status(500).json({ error: "Failed to create table" });
    }
  }
});

// Route for updating an existing table
router.patch("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      {
        tableNr: req.body.tableNr,
        capacity: req.body.capacity,
        status: req.body.status,
      },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json(table);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for deleting an existing table
router.delete("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json(table);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Export the router module
module.exports = router;
