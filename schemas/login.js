// Importiere das Mongoose-Modul
const mongoose = require("mongoose");

// Erstelle das Benutzerschema mit den gewünschten Feldern und Eigenschaften
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, // Der Datentyp für den Benutzernamen ist ein String
      required: true, // Der Benutzername ist ein erforderliches Feld
      unique: true, // Der Benutzername muss eindeutig sein
    },
    password: {
      type: String, // Der Datentyp für das Passwort ist ein String
      required: true, // Das Passwort ist ein erforderliches Feld
    },
  },
  { versionKey: false } // Deaktiviere das Versionsfeld (__v) im Schema
);

// Erstelle das User-Modell mit dem definierten Schema
const User = mongoose.model("User", userSchema);

// Exportiere das User-Modell für die weitere Verwendung
module.exports = User;
