// greife auf das HTML-Formular mit der ID "registration-form" zu
const form = document.getElementById("registration-form");

// füge einen Event-Listener hinzu, der auf das Absenden des Formulars wartet
form.addEventListener("submit", function (event) {
  // wenn die Passwörter übereinstimmen, füge den Benutzer hinzu
  addUser();
});

// Definiere eine Funktion mit dem Namen "anmelden"
function anmelden() {
  // greife auf die eingegebene Benutzername- und Passwortfelder zu
  var username = document.getElementById("username").value;
  var password = document.getElementById("login-password").value;

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
      // Wenn die Anmeldung erfolgreich war, wird eine "success"-Funktion aufgerufen
      // get the form element
      var form = document.getElementById("login-form");

      // reset the form
      form.reset();

      // Führe eine Aktion aus, um anzuzeigen, dass der Benutzer angemeldet ist
      toggleLoginForm();
      toggleRestaurantForm();

      loadGrid();
    },
    error: function () {
      // Wenn die Anmeldung fehlschlägt, wird eine "error"-Funktion aufgerufen
      alert("Invalid username or password."); // gib eine Fehlermeldung aus
      console.log("Failed to log in."); // gib eine Fehlermeldung in der Konsole aus
    },
  });
}

function toggleLoginForm() {
  var loginForm = document.getElementById("login-container");
  if (loginForm.classList.contains("d-none")) {
    loginForm.classList.remove("d-none");
  } else {
    loginForm.classList.add("d-none");
  }
}

function toggleRestaurantForm() {
  var loginForm = document.getElementById("restaurant-div");
  if (loginForm.classList.contains("d-none")) {
    loginForm.classList.remove("d-none");
  } else {
    loginForm.classList.add("d-none");
  }
}

function abmelden() {
  console.log("abmelden");
}

function validateUsername(username) {
  const regex = /^[a-zA-Z0-9_]{4,20}$/; // only allow alphanumeric characters and underscore, length between 4 and 20
  return regex.test(username);
}

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // at least one lowercase, one uppercase, one digit, length at least 8
  return regex.test(password);
}

async function addUser() {
  const username = document.getElementById("new-username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate the input fields
  if (!validateUsername(username)) {
    alert("The username is invalid.");
    return;
  }

  if (!validatePassword(password)) {
    alert("The password is invalid.");
    return;
  }

  if (password !== confirmPassword) {
    alert("The passwords do not match.");
    return;
  }

  // Convert the password string to a byte array
  const pwd = new TextEncoder().encode(password);

  // Generate a random salt
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  // Create a key derivation function (KDF) with the desired algorithm and parameters
  const kdf = await window.crypto.subtle.importKey(
    "raw",
    pwd,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Use the KDF to derive a 256-bit key from the password and salt
  const key = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: { name: "SHA-256" },
    },
    kdf,
    256
  );

  // Convert the key to a hexadecimal string
  const hashedPassword = Array.from(new Uint8Array(key))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Führe eine AJAX-Anfrage an den Server aus, um einen neuen Benutzer hinzuzufügen
  $.ajax({
    url: "http://localhost:3000/login", // die URL des Endpunkts für das Hinzufügen eines Benutzers
    method: "POST", // die HTTP-Methode für die Anfrage
    contentType: "application/json", // Der Typ des zu sendenden Inhalts ist JSON
    data: JSON.stringify({
      username: username, // Der Benutzername wird als JSON-Daten an den Server gesendet
      password: hashedPassword, // Das Passwort wird als JSON-Daten an den Server gesendet
    }),
    success: function (data) {
      // Wenn das Hinzufügen des Benutzers erfolgreich war, wird eine "success"-Funktion aufgerufen
      // get the form element
      var form = document.getElementById("registration-form");

      // reset the form
      form.reset();

      console.log("User created successfully:", data); // gib eine Erfolgsmeldung in der Konsole aus
      //alertSuccess(); // rufe eine Funktion auf, um den Benutzer zu informieren, dass das Hinzufügen erfolgreich war
      //clearValues(); // rufe eine Funktion auf, um die Felder zu leeren
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

// Diese Funktion erstellt eine Fehlermeldung und zeigt sie auf der Seite an.
function alertExists() {
  // Holt das HTML-Element, wo die Benachrichtigung angezeigt werden soll
  const alertPlaceholder = document.getElementById("usernameExists");

  // Eine Funktion, die ein neues Benachrichtigungs-HTML-Element erstellt und zum alertPlaceholder hinzufügt
  const alert = (message, type) => {
    // Erstellt ein div-Element, um die Benachrichtigung zu umgeben
    const wrapper = document.createElement("div");

    // Setzt den HTML-Inhalt des div-Elements, um die Benachrichtigung anzuzeigen
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    // Fügt das neue div-Element zum alertPlaceholder hinzu
    alertPlaceholder.append(wrapper);
  };

  // Ruft die alert-Funktion auf, um eine rote Benachrichtigung mit der Nachricht "Benutzername existiert bereits!" anzuzeigen
  alert("Benutzername existiert bereits!", "danger");
}

// Diese Funktion erstellt eine Erfolgsmeldung und zeigt sie auf der Seite an.
function alertSuccess() {
  // HTML-Element holen, an dem die Erfolgsmeldung angezeigt werden soll.
  const alertPlaceholder = document.getElementById("usernameCreated");

  // Diese Funktion erstellt die Erfolgsmeldung.
  const alert = (message, type) => {
    // Ein Wrapper-Element erstellen, um die Erfolgsmeldung zu umgeben.
    const wrapper = document.createElement("div");
    // Den HTML-Code für die Erfolgsmeldung in den Wrapper einfügen.
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    // Den Wrapper an das HTML-Element anhängen, um die Erfolgsmeldung auf der Seite anzuzeigen.
    alertPlaceholder.append(wrapper);
  };

  // Erfolgsmeldung erstellen und anzeigen.
  alert("Benutzer wurde erfolgreich angelegt!", "success");
}
