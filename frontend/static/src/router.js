import Login, { setLogged } from "./views/Login.js";
import Table, {
  setLoggedIn,
  getTables,
  getTablesStatus,
} from "./views/Table.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

export const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

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

const router = async () => {
  const routes = [
    { path: "/", view: Login },
    { path: "/tische", view: Table },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  const view = new match.route.view(getParams(match));

  document.getElementById("app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
    if (e.target.matches("[anmelde-button]")) {
      console.log("MATCH");
      e.preventDefault();
      anmelden(e);
    }
    if (e.target.matches("[registrieren-button]")) {
      e.preventDefault();
      userHinzuf(e);
    }
    if (e.target.matches("[button-tischHinzu]")) {
      e.preventDefault();
      tischHinzufügen();
      resetSelect();
    }
    if (e.target.matches("[ausloggen-button]")) {
      e.preventDefault();
      setLoggedIn(false);
      setLogged(false);

      navigateTo(e.target.href);
    }
    if (e.target.matches("[select-table]")) {
      document
        .getElementById("showTable")
        .addEventListener("change", (event) => {
          const selectElement = event.target;
          const selectedIndex = selectElement.selectedIndex;
          const selectedOption = selectElement.options[selectedIndex];
          const selectedText = selectedOption.text;

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
  router();
});

export function resetSelect() {
  const selectbox = document.getElementById("showTable");

  selectbox.selectedIndex = 0;
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
