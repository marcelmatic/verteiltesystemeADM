// Lade benötigte Module
require("dotenv").config(); // Lade Umgebungsvariablen aus der .env Datei
const express = require("express"); // Verwende Express, um den Server zu erstellen
const cors = require("cors"); // Verwende das CORS-Paket, um die Cross-Origin-Ressourcenfreigabe zu ermöglichen
const winston = require("winston");
const path = require("path");
const bodyParser = require("body-parser");

// Erstelle einen Logger mit winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "my-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Erstelle eine Instanz der Express-Anwendung
const app = express();

// Importiere die Mongoose-Bibliothek für die Verbindung zur MongoDB-Datenbank
const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Setze die Option strictQuery auf false, um weniger strenge Abfragen zu ermöglichen

// Verbinde zur MongoDB-Datenbank mit der Umgebungsvariable DATABASE_URL
mongoose.connect(process.env.MONGODB_CONN, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => logger.error(error)); // Protokolliere Verbindungsfehler
db.once("open", () => console.log("Connected to Database")); // Protokolliere eine Nachricht, wenn die Verbindung hergestellt ist

// Verwende das Express.json() Middleware, um eingehende Anfragedaten als JSON zu parsen
app.use(express.json());
logger.info(
  "Verwende das Express.json() Middleware, um eingehende Anfragedaten als JSON zu parsen"
);

// Verwende CORS-Middleware
app.use(cors());
logger.info("Verwende CORS");

// Verwende bodyParser.urlencoded, um URL-codierte Anfragedaten zu parsen
app.use(bodyParser.urlencoded({ extended: true }));

// Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
  // Protokolliere den Fehler
  logger.error(err);

  // Sende eine Fehlerantwort an den Client
  res.status(500).json({ message: "Internal server error" });
});

// Richte die Benutzer- und Terminrouten mit ihren jeweiligen Routern ein
const loginRouter = require("./routing/login");
app.use("/login", loginRouter);
logger.info("Richte Login-Route ein");

const tableRouter = require("./routing/table");
app.use("/table", tableRouter);
logger.info("Richte Tabellen-Route ein");

// Stelle statische Dateien aus dem Frontend-Verzeichnis bereit
app.use(
  "/static",
  express.static(path.resolve(__dirname, "frontend", "static"))
);

// Verarbeite alle anderen Anfragen und sende die index.html-Datei
app.get("/*", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

// Richte den Server ein, um auf Port 3000 zu lauschen
app.listen(process.env.PORT, () => console.log("Connected to Server"));
