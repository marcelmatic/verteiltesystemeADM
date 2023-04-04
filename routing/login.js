// Importiere notwendige Abhängigkeiten
const express = require("express"); // Importiere die Express-Bibliothek
const router = express.Router(); // Erstelle eine neue Router-Instanz
const User = require("../schemas/login"); // Importiere das User-Modell
const bcrypt = require("bcrypt"); // Importiere bcrypt zum Verschlüsseln von Passwörtern
const path = require("path");

// Route zum Abrufen aller Benutzer
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Suche alle Benutzer in der Datenbank
    res.send(users); // Sende alle gefundenen Benutzer als Antwort
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Route zum Erstellen eines neuen Benutzers
router.post("/", async (req, res) => {
  try {
    // Hole die Benutzerdaten aus dem Request-Body
    const { username, password } = req.body;

    // Hashe das Passwort
    const hashedPassword = await bcrypt.hash(password, 10);

    // Erstelle ein neues Benutzerdokument mit dem gehashten Passwort
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    // Sende das neue Benutzerdokument als Antwort
    res.json(newUser);
  } catch (error) {
    // Behandle Fehler, die während der Benutzererstellung auftreten
    if (error.code === 11000 && error.keyPattern.username) {
      res.status(400).json({ error: "Username already exists" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

// Route für die Benutzeranmeldung
router.post("/login", async (req, res) => {
  try {
    // Hole die Benutzerdaten aus dem Request-Body
    const { username, password } = req.body;

    // Suche den Benutzer nach Benutzername
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Vergleiche das eingegebene Passwort mit dem gehashten Passwort
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

// Exportiere das Router-Modul
module.exports = router;
