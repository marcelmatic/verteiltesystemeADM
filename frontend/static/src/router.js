// Importiere die Login- und Tabelle-Module
import Login, { setLogged } from "./views/Login.js";
import Table, {
  setLoggedIn,
  getTables,
  getTablesStatus,
} from "./views/Table.js";

// Definiere eine Funktion, die einen regulären Ausdruck für einen Pfad erstellt
const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

// Definiere eine Funktion, um die Seite zu navigieren
export const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

// Definiere eine Funktion, um die Parameter eines Übereinstimmungsergebnisses zu erhalten
const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

// Definiere die Router-Funktion
const router = async () => {
  // Definiere eine Liste von Routen und deren zugehörige Ansichten
  const routes = [
    { path: "/", view: Login },
    { path: "/tische", view: Table },
  ];

  // Teste jede Route auf mögliche Übereinstimmungen
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  // Finde die erste Übereinstimmung
  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  // Wenn keine Übereinstimmung gefunden wird, verwende die erste Route
  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  // Erstelle die Ansicht und aktualisiere den HTML-Inhalt der Seite
  const view = new match.route.view(getParams(match));
  document.getElementById("app").innerHTML = await view.getHtml();
};

// Füge einen Event-Listener hinzu, um den Router bei Änderungen des Browserverlaufs aufzurufen
window.addEventListener("popstate", router);

// Wenn das Dokument vollständig geladen ist, führe den Router aus und füge Event-Listener für die Navigation hinzu
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    // Wenn auf einen Link geklickt wird, verhindere das Standardverhalten und navigiere zu der angegebenen URL
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }

    // Wenn auf den Anmeldebutton geklickt wird, führe die Anmeldungsfunktion aus
    if (e.target.matches("[anmelde-button]")) {
      console.log("MATCH");
      e.preventDefault();
      anmelden(e);
    }

    // Wenn auf den Registrierungsbutton geklickt wird, füge einen neuen Benutzer hinzu
    if (e.target.matches("[registrieren-button]")) {
      e.preventDefault();
      userHinzuf(e);
    }
    // Wenn der Button "Tisch hinzufügen" geklickt wurde
    if (e.target.matches("[button-tischHinzu]")) {
      e.preventDefault(); // Verhindert das Standardverhalten des Buttons, um die Seite nicht neu zu laden
      tischHinzufügen(); // Fügt einen neuen Tisch hinzu
      resetSelect(); // Setzt die Auswahlbox zurück
    }

    // Wenn der Button "Ausloggen" geklickt wurde
    if (e.target.matches("[ausloggen-button]")) {
      e.preventDefault(); // Verhindert das Standardverhalten des Buttons, um die Seite nicht neu zu laden
      setLoggedIn(false); // Setzt den Anmeldestatus des Benutzers auf "nicht angemeldet"
      setLogged(false); // Setzt den Anmeldestatus des Benutzers auf "nicht angemeldet"
      navigateTo(e.target.href); // Navigiert zum Ausloggen
    }
    // Wenn die Auswahlbox "Tisch anzeigen" geändert wurde
    if (e.target.matches("[select-table]")) {
      // Fügt einen Event-Listener hinzu, um auf Änderungen in der Auswahlbox zu reagieren
      document
        .getElementById("showTable")
        .addEventListener("change", (event) => {
          const selectElement = event.target; // Das Element, auf das die Event-Listener-Funktion aufgerufen wurde (in diesem Fall die Auswahlbox)
          const selectedIndex = selectElement.selectedIndex; // Der Index des ausgewählten Elements in der Auswahlbox
          const selectedOption = selectElement.options[selectedIndex]; // Das ausgewählte Element in der Auswahlbox
          const selectedText = selectedOption.text; // Der Text des ausgewählten Elements

          // Je nach Auswahl ruft die Funktion "getTables", "getTablesStatus(false)" oder "getTablesStatus(true)" auf
          if (selectedText === "frei") {
            getTablesStatus("false");
          } else if (selectedText === "besetzt") {
            getTablesStatus("true");
          } else {
            getTables();
          }
        });
    }
  });
  router(); // Führt die Router-Funktion aus, um die passende View aufzurufen
});

// Definiert eine Funktion zum Zurücksetzen der Auswahlbox
export function resetSelect() {
  const selectbox = document.getElementById("showTable"); // Das Element, das die Auswahlbox enthält

  selectbox.selectedIndex = 0; // Setzt den Index des ausgewählten Elements in der Auswahlbox auf 0 zurück
}

// Definiere eine Funktion mit dem Namen "anmelden"
function anmelden(e) {
  console.log("anmelden wird ausgeführt");
  // greife auf die eingegebene Benutzername- und Passwortfelder zu
  var username = document.getElementById("username").value;
  var password = document.getElementById("login-password").value;

  console.log(username + password);

  // Führe eine AJAX-Anfrage an den Server aus, um den Benutzer anzumelden
  $.ajax({
    url: "http://localhost:3000/login/login", // die URL des Endpunkts für die Anmeldung
    headers: {
      "Content-Type": "application/json", // Der Typ des zu sendenden Inhalts ist JSON
    },
    method: "POST", // die HTTP-Methode für die Anfrage
    data: JSON.stringify({
      username: username, // Der Benutzername wird als JSON-Daten an den Server gesendet
      password: password, // Das Passwort wird als JSON-Daten an den Server gesendet
    }),
    success: function (data) {
      const user = data;
      console.log("SUIII");
      // navigate to /table route
      setLoggedIn(true);
      setLogged(true);

      navigateTo(e.target.href);
    },
    error: function () {
      // Wenn die Anmeldung fehlschlägt, wird eine "error"-Funktion aufgerufen
      alert("Invalid username or password."); // gib eine Fehlermeldung aus
      console.log("Failed to log in."); // gib eine Fehlermeldung in der Konsole aus
    },
  });
}

async function userHinzuf(e) {
  const username = document.getElementById("new-username").value;
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("The passwords do not match.");
    return;
  }

  // Führe eine AJAX-Anfrage an den Server aus, um einen neuen Benutzer hinzuzufügen
  $.ajax({
    url: "http://localhost:3000/login", // die URL des Endpunkts für das Hinzufügen eines Benutzers
    method: "POST", // die HTTP-Methode für die Anfrage
    contentType: "application/json", // Der Typ des zu sendenden Inhalts ist JSON
    data: JSON.stringify({
      username: username, // Der Benutzername wird als JSON-Daten an den Server gesendet
      password: password, // Das Passwort wird als JSON-Daten an den Server gesendet
    }),
    success: function (data) {
      // Wenn das Hinzufügen des Benutzers erfolgreich war, wird eine "success"-Funktion aufgerufen
      // get the form element
      alert("Benutzer erfolgreich angelegt!"); // display a popup message

      console.log("User created successfully:", data); // gib eine Erfolgsmeldung in der Konsole aus
      navigateTo(e.target.href);
      $("#registerModal").modal("hide"); // hide the modal
    },
    error: function (jqXHR) {
      // Wenn das Hinzufügen des Benutzers fehlschlägt, wird eine "error"-Funktion aufgerufen
      console.log(jqXHR); // gib die Details des Fehlers in der Konsole aus
      if (
        jqXHR.status === 400 && // wenn der Fehlerstatus 400 ist
        jqXHR.responseJSON && // und wenn es eine Antwort als JSON gibt
        jqXHR.responseJSON.error === "Username already exists" // und wenn der Benutzername bereits vorhanden ist
      ) {
        console.log("Username already exists"); // gib eine Fehlermeldung in der Konsole aus
        //alertExists(); // rufe eine Funktion auf, um den Benutzer zu informieren, dass der Benutzername bereits vorhanden ist
      } else {
        console.log("Failed to create user."); // gib eine Fehlermeldung in der Konsole aus
      }
    },
  });
}

async function tischHinzufügen() {
  const tableNr = document.getElementById("new-table-nr").value;
  const capacity = document.getElementById("new-table-capacity").value;

  // Führe eine AJAX-Anfrage an den Server aus, um einen neuen Benutzer hinzuzufügen
  $.ajax({
    url: "http://localhost:3000/table", // die URL des Endpunkts für das Hinzufügen eines Benutzers
    method: "POST", // die HTTP-Methode für die Anfrage
    contentType: "application/json", // Der Typ des zu sendenden Inhalts ist JSON
    data: JSON.stringify({
      tableNr: tableNr, // Der Benutzername wird als JSON-Daten an den Server gesendet
      capacity: capacity, // Das Passwort wird als JSON-Daten an den Server gesendet
      status: false,
    }),
    success: function (data) {
      // Wenn das Hinzufügen des Benutzers erfolgreich war, wird eine "success"-Funktion aufgerufen
      // get the form element

      alert("Tisch erfolgreich angelegt!"); // display a popup message

      console.log("Table created successfully:", data); // gib eine Erfolgsmeldung in der Konsole aus
      $("#addTableModal").modal("hide"); // hide the modal
      getTables();

      document.getElementById("new-table-nr").value = "";
      document.getElementById("new-table-capacity").value = "";
    },
    error: function (jqXHR) {
      // Wenn das Hinzufügen des Benutzers fehlschlägt, wird eine "error"-Funktion aufgerufen
      console.log(jqXHR); // gib die Details des Fehlers in der Konsole aus
      if (
        jqXHR.status === 400 && // wenn der Fehlerstatus 400 ist
        jqXHR.responseJSON && // und wenn es eine Antwort als JSON gibt
        jqXHR.responseJSON.error === "Table number already exists" // und wenn der Benutzername bereits vorhanden ist
      ) {
        console.log("TableNr already exists"); // gib eine Fehlermeldung in der Konsole aus
        alert("TischNr existiert bereits!");
      } else {
        console.log("Failed to create table."); // gib eine Fehlermeldung in der Konsole aus
      }
    },
  });
}
