// Importiere notwendige Abhängigkeiten
const express = require("express"); // Importiere die Express-Bibliothek
const router = express.Router(); // Erstelle eine neue Router-Instanz
const Table = require("../schemas/table"); // Importiere das Table-Modell
const bcrypt = require("bcrypt"); // Importiere bcrypt zum Hashen von Passwörtern
const path = require("path");

// Route zum Abrufen aller Tische
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find(); // Suche alle Tische in der Datenbank
    res.send(tables); // Sende alle gefundenen Tische als Antwort
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Route zum Abrufen von Tischen nach Status
router.get("/:status", async (req, res) => {
  try {
    const status = req.params.status; // Extrahiere den Status aus den Routenparametern
    const table = await Table.find({ status: status }); // Suche Tische mit dem angegebenen Status
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }
    return res.json(table);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get table" });
  }
});

// Route zum Erstellen eines neuen Tisches
router.post("/", async (req, res) => {
  try {
    // Hole die Tischdaten aus dem Request-Body
    const { tableNr, capacity, status } = req.body;

    // Erstelle ein neues Tischdokument
    const table = await Table.create({
      tableNr,
      capacity,
      status,
    });

    // Sende das neue Tischdokument als Antwort
    res.json(table);
  } catch (error) {
    // Behandle Fehler, die während der Tischerstellung auftreten
    console.error(error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.tableNr) {
      res.status(400).json({ error: "Table number already exists" });
    } else {
      res.status(500).json({ error: "Failed to create table" });
    }
  }
});

// Route zum Aktualisieren eines vorhandenen Tisches
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

// Route zum Löschen eines vorhandenen Tisches
router.delete("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id); // Lösche den Tisch mit der angegebenen ID

    if (!table) {
      // Falls kein Tisch gefunden wurde
      return res.status(404).json({ message: "Table not found" });
    }

    res.json(table); // Sende den gelöschten Tisch als Antwort
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Exportiere das Router-Modul
module.exports = router;
