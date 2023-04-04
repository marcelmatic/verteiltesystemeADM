import Abstractview from "./Abstractview.js";

// Die Variable isLoggedIn speichert den Anmeldestatus des Benutzers (true: angemeldet, false: nicht angemeldet)
let isLoggedIn = false;

export default class extends Abstractview {
  constructor(params) {
    super(params);
    this.setTitle("Login");
  }

  async getHtml() {
    // Überprüfe, ob der Benutzer angemeldet ist
    if (!getLoggedIn()) {
      const response = await fetch("/static/src/login.html");
      const htmlContent = await response.text();
      return htmlContent;
    }
    const response = await fetch("/static/src/welcome.html");
    const htmlContent = await response.text();

    return htmlContent;
  }
}

// Setze den Anmeldestatus des Benutzers
export function setLogged(value) {
  console.log("WAHR" + value);

  isLoggedIn = value;
}

// Gib den Anmeldestatus des Benutzers zurück
function getLoggedIn() {
  return isLoggedIn;
}
