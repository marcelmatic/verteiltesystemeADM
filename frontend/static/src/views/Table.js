import Abstractview from "./Abstractview.js";

let isLoggedIn = false;

export default class extends Abstractview {
  constructor(params) {
    super(params);
    this.setTitle("Tische");
  }

  async getHtml() {
    // Check if the user is logged in
    if (!getLoggedIn()) {
      const response = await fetch("/static/src/default.html");
      const htmlContent = await response.text();
      return htmlContent;
    }

    // User is logged in, fetch and return the table content
    const response = await fetch("/static/src/table.html");
    const htmlContent = await response.text();

    this.onViewLoaded();
    return htmlContent;
  }

  async onViewLoaded() {
    // Call the appropriate function(s) once the view is loaded
    getTables();
  }
}

export function setLoggedIn(value) {
  console.log("WAHR" + value);

  isLoggedIn = value;
}

function getLoggedIn() {
  return isLoggedIn;
}

// Definiere eine Funktion mit dem Namen "anmelden"
export function getTables() {
  // Führe eine AJAX-Anfrage an den Server aus, um den Benutzer anzumelden
  $.ajax({
    url: "http://localhost:3000/table", // die URL des Endpunkts für die Anmeldung
    headers: {
      "Content-Type": "application/json", // Der Typ des zu sendenden Inhalts ist JSON
    },
    method: "GET", // die HTTP-Methode für die Anfrage
    success: function (data) {
      loadGrid(data);
    },
    error: function () {
      // Wenn die Anmeldung fehlschlägt, wird eine "error"-Funktion aufgerufen
      alert("Invalid username or password."); // gib eine Fehlermeldung aus
      console.log("Failed to log in."); // gib eine Fehlermeldung in der Konsole aus
    },
  });
}

export function loadGrid(data) {
  // Define the size of the grid
  var grid_size = data.length;

  // Get a reference to the restaurant-container div
  var container = document.getElementById("restaurant-container");

  // Create a table element with Bootstrap classes
  var table = document.createElement("table");
  table.classList.add("table", "table-bordered", "col-md-12");
  var tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Generate the rows and columns of the table
  var current_row;
  for (var i = 0; i < grid_size + 1; i++) {
    if (i % 3 === 0) {
      // Create a new row every 5 columns
      current_row = document.createElement("tr");
      tbody.appendChild(current_row);
    }

    // Create a cell with Bootstrap classes
    var cell = document.createElement("td");
    cell.classList.add("p-3", "text-center", "m-3", "h-100");

    // Create a wrapper div to hold the cell content
    var wrapper = document.createElement("div");
    wrapper.classList.add(
      "d-flex",
      "flex-column",
      "h-100",
      "justify-content-center",
      "align-items-center"
    );

    if (i < grid_size) {
      // Create a number input field for the table number
      var tableNr = document.createElement("input");
      tableNr.type = "number";
      tableNr.value = data[i].tableNr;
      tableNr.classList.add("form-control", "mb-2");
      tableNr.disabled = true;

      // Append the heading element to the cell
      cell.appendChild(tableNr);

      // Create a paragraph element for the table capacity
      // Create a number input field for the table number
      var capacity = document.createElement("input");
      capacity.type = "number";
      capacity.value = data[i].capacity;
      capacity.classList.add("form-control", "mb-2");
      capacity.disabled = true;

      // Append the capacity element to the cell
      cell.appendChild(capacity);

      // Create a checkbox element for the table status
      var status = document.createElement("input");
      status.type = "checkbox";
      status.checked = data[i].status;
      status.classList.add("form-check-input", "mb-2");
      status.disabled = true;

      // Create a label element for the checkbox
      var statusLabel = document.createElement("label");
      statusLabel.classList.add("form-check-label");
      statusLabel.innerText = data[i].status ? "Besetzt" : "Frei";

      // Create a div to hold the checkbox and label
      var statusDiv = document.createElement("div");
      statusDiv.classList.add("form-check", "mb-2");

      // Append the checkbox and label to the div
      statusDiv.appendChild(status);
      statusDiv.appendChild(statusLabel);

      // Append the status div to the cell
      cell.appendChild(statusDiv);

      // Create a div to hold the buttons
      var buttonContainer = document.createElement("div");
      buttonContainer.classList.add(
        "d-flex",
        "align-items-center",
        "w-100",
        "mt-auto",
        "justify-content-center",
        "row",
        "mb-2"
      );

      // Create a div for the "löschen" button
      var deleteButtonDiv = document.createElement("div");
      deleteButtonDiv.classList.add("col", "text-center", "d-flex", "p-0");

      // Create the "löschen" button with Bootstrap classes
      var deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger");
      // Add the delete icon
      var deleteIcon = document.createElement("i");
      deleteIcon.classList.add("bi", "bi-trash");
      deleteButton.appendChild(deleteIcon);

      // Add an event listener to the button to open the modal on click
      deleteButton.addEventListener("click", function () {});

      // Append the "löschen" button to its div
      deleteButtonDiv.appendChild(deleteButton);

      // Append the "löschen" button div to the button container
      buttonContainer.appendChild(deleteButtonDiv);
      // Create a div for the "bearbeiten" button
      var editButtonDiv = document.createElement("div");
      editButtonDiv.classList.add("col", "text-center", "d-flex", "p-0");

      // Create the "bearbeiten" button with Bootstrap classes
      var editButton = document.createElement("button");
      editButton.classList.add("btn", "btn-secondary");
      // Add the edit icon
      var editIcon = document.createElement("i");
      editIcon.classList.add("bi", "bi-pencil-square");
      editButton.appendChild(editIcon);
      // Append the "bearbeiten" button to its div
      editButtonDiv.appendChild(editButton);

      // Append the "bearbeiten" button div to the button container
      buttonContainer.appendChild(editButtonDiv);

      cell.appendChild(buttonContainer);

      // Add an event listener to the button to open the modal on click
      editButton.addEventListener(
        "click",
        (function (tableNr, capacity, status, statusLabel) {
          return function () {
            // Enable the table number input field
            tableNr.disabled = false;

            // Enable the table capacity input field
            capacity.disabled = false;

            // Enable the status checkbox
            status.disabled = false;

            // Add an event listener to update the status label when the checkbox state changes
            status.addEventListener("change", function () {
              statusLabel.innerText = status.checked ? "Besetzt" : "Frei";
            });
          };
        })(tableNr, capacity, status, statusLabel)
      );
      cell.appendChild(wrapper);
    } else {
      // Create a button element with Bootstrap classes
      var button = document.createElement("button");
      button.classList.add("btn", "btn-success");
      // Add the plus icon
      var addIcon = document.createElement("i");
      addIcon.classList.add("bi", "bi-plus");
      button.appendChild(addIcon);

      // Add an event listener to the button to open the modal on click
      button.addEventListener("click", function () {
        // Get a reference to the modal element
        var modal = document.getElementById("tischAnlegen");

        // Set the table data in the modal if needed
        // ...

        // Open the modal
        var modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
      });

      // Append the button element to the last cell in the last row
      cell.appendChild(button);
    }

    // Append the cell to the current row
    current_row.appendChild(cell);
  }

  // Add the table to the container div
  container.appendChild(table);
}
