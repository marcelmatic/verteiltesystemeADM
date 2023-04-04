// Importiere das Mongoose-Modul
const mongoose = require("mongoose");

// Erstelle das Tischschema mit den gewünschten Feldern und Eigenschaften
const tableSchema = new mongoose.Schema(
  {
    tableNr: {
      type: Number, // Der Datentyp für die Tischnummer ist eine Zahl
      required: true, // Die Tischnummer ist ein erforderliches Feld
      unique: true, // Die Tischnummer muss eindeutig sein
    },
    capacity: {
      type: Number, // Der Datentyp für die Kapazität ist eine Zahl
      required: true, // Die Kapazität ist ein erforderliches Feld
    },
    status: {
      type: Boolean, // Der Datentyp für den Status ist ein Boolescher Wert
      required: true, // Der Status ist ein erforderliches Feld
    },
  },
  { versionKey: false } // Deaktiviere das Versionsfeld (__v) im Schema
);

// Erstelle das Table-Modell mit dem definierten Schema
const Table = mongoose.model("Table", tableSchema);

// Exportiere das Table-Modell für die weitere Verwendung
module.exports = Table;
