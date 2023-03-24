import { resetSelect } from "../router.js";
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
      console.log("Failed to get tables."); // gib eine Fehlermeldung in der Konsole aus
    },
  });
}

// Definiere eine Funktion mit dem Namen "anmelden"
export function getTablesStatus(status) {
  // Führe eine AJAX-Anfrage an den Server aus, um den Benutzer anzumelden
  $.ajax({
    url: "http://localhost:3000/table/" + status, // die URL des Endpunkts für die Anmeldung
    headers: {
      "Content-Type": "application/json", // Der Typ des zu sendenden Inhalts ist JSON
    },
    method: "GET", // die HTTP-Methode für die Anfrage
    success: function (data) {
      loadGrid(data);
    },
    error: function () {
      // Wenn die Anmeldung fehlschlägt, wird eine "error"-Funktion aufgerufen
      console.log("Failed to get tables."); // gib eine Fehlermeldung in der Konsole aus
    },
  });
}

export function loadGrid(data) {
  $("#myTable").remove();

  // Define the size of the grid
  var grid_size = data.length;

  // Get a reference to the restaurant-container div
  var container = document.getElementById("restaurant-container");

  // Create a table element with Bootstrap classes
  var table = document.createElement("table");
  table.classList.add("table", "table-bordered", "col-md-12");
  table.id = "myTable";
  var tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Generate the rows and columns of the table
  var current_row;
  for (var i = 0; i < grid_size; i++) {
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
      // Create the table icon and make it larger using the "fa-3x" class
      var tableIcon = document.createElement("i");
      tableIcon.classList.add("fas", "fa-cutlery", "fa-3x", "mb-2");

      // Append the icon to the wrapper div

      cell.append(tableIcon);

      // Create a number input field for the id
      var _id = document.createElement("p");
      _id.innerHTML = data[i]._id;
      _id.classList.add("mb-2");
      _id.style.fontSize = "4px";
      _id.id = "_id";
      _id.name = "_id";

      // Append the id element to the cell
      cell.appendChild(_id);

      // Create a div element
      var divTableNr = document.createElement("div");
      divTableNr.classList.add("form-group", "row");

      // Create a label element for the table number
      var label = document.createElement("label");
      label.textContent = "Tisch Nr:";
      label.htmlFor = "tableNr";
      label.classList.add("col-sm-6", "col-form-label");

      // Create a div to contain the input field
      var divInput = document.createElement("div");
      divInput.classList.add("col-sm-6");

      // Create a number input field for the table number
      var tableNr = document.createElement("input");
      tableNr.type = "number";
      tableNr.value = data[i].tableNr;
      tableNr.classList.add("form-control");
      tableNr.disabled = true;
      tableNr.name = "tableNr";
      tableNr.id = "tableNr";
      tableNr.style.backgroundColor = "transparent"; // set the background color to transparent
      tableNr.style.borderColor = "transparent"; // set the background color to transparent

      // Append the label and input elements to the divs
      divInput.appendChild(tableNr);
      divTableNr.appendChild(label);
      divTableNr.appendChild(divInput);

      // Append the div to the cell
      cell.appendChild(divTableNr);

      // Create a div element
      var divCapacity = document.createElement("div");
      divCapacity.classList.add("form-group", "row");

      // Create a label element for the capacity
      var capacityLabel = document.createElement("label");
      capacityLabel.textContent = "Plätze:";
      capacityLabel.htmlFor = "capacity";
      capacityLabel.classList.add("col-sm-6", "col-form-label");

      // Create a div to contain the capacity input field
      var divCapacityInput = document.createElement("div");
      divCapacityInput.classList.add("col-sm-6");

      // Create a number input field for the capacity
      var capacity = document.createElement("input");
      capacity.type = "number";
      capacity.value = data[i].capacity;
      capacity.classList.add("form-control");
      capacity.disabled = true;
      capacity.name = "capacity";
      capacity.id = "capacity";
      capacity.style.backgroundColor = "transparent"; // set the background color to transparent
      capacity.style.borderColor = "transparent"; // set the background color to transparent

      // Append the label and input elements to the divs
      divCapacityInput.appendChild(capacity);
      divCapacity.appendChild(capacityLabel);
      divCapacity.appendChild(divCapacityInput);

      // Append the div to the cell
      cell.appendChild(divCapacity);

      // Create a div element
      var divStatus = document.createElement("div");
      divStatus.classList.add("form-group", "row", "mb-3");

      // Create a div to contain the checkbox and label
      var divStatusInput = document.createElement("div");
      divStatusInput.classList.add("col-sm-12");

      // Create a checkbox input field for the status
      var statusInput = document.createElement("input");
      statusInput.type = "checkbox";
      statusInput.checked = data[i].status;
      statusInput.classList.add("form-check-input", "mr-2");
      statusInput.disabled = true;
      statusInput.name = "status";
      statusInput.id = "status";

      // Create a label element for the checkbox
      var statusInputLabel = document.createElement("label");
      statusInputLabel.classList.add("form-check-label", "ml-2");
      statusInputLabel.textContent = data[i].status ? "Besetzt" : "Frei";

      // Append the checkbox and label elements to the div
      divStatusInput.appendChild(statusInput);
      divStatusInput.appendChild(statusInputLabel);

      divStatus.appendChild(divStatusInput);

      // Append the div to the cell
      cell.appendChild(divStatus);

      updateStatusLabel(statusInput, statusInputLabel);

      // Create a div to hold the buttons
      var buttonContainer = document.createElement("div");
      buttonContainer.classList.add(
        "align-items-center",
        "mt-auto",
        "row",
        "mb-2"
      );

      // Create a div for the "löschen" button
      var deleteButtonDiv = document.createElement("div");
      deleteButtonDiv.classList.add("col", "text-center");

      // Create the "löschen" button with Bootstrap classes
      var deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger");
      // Add the delete icon
      var deleteIcon = document.createElement("i");
      deleteIcon.classList.add("bi", "bi-trash");
      deleteButton.appendChild(deleteIcon);

      // Add an event listener to the button to delete the table
      deleteButton.addEventListener(
        "click",
        (function (_id) {
          return function () {
            var parentCell = this.closest("td");
            // Get the id value from the paragraph element
            var idValue = parentCell.querySelector("p").textContent;

            console.log(idValue);

            tischLoeschen(idValue);
            parentCell = null;
          };
        })(_id)
      );

      // Append the "löschen" button to its div
      deleteButtonDiv.appendChild(deleteButton);

      // Append the "löschen" button div to the button container
      buttonContainer.appendChild(deleteButtonDiv);

      // Create a div for the "bearbeiten" button
      var editButtonDiv = document.createElement("div");
      editButtonDiv.classList.add("col", "text-center");

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

      // Function to toggle between "bearbeiten" and "speichern" buttons
      function toggleEditSaveButton(
        editButton,
        editIcon,
        parentCell,
        tableNr,
        capacity
      ) {
        if (editButton.classList.contains("btn-secondary")) {
          // Change the button to "speichern" with a save icon
          editButton.classList.remove("btn-secondary");
          editButton.classList.add("btn-primary");
          editIcon.classList.remove("bi-pencil-square");
          editIcon.classList.add("bi-save");
          tableNr.style.borderColor = "gray";
          capacity.style.borderColor = "gray";
        } else {
          // Change the button back to "bearbeiten" with an edit icon
          editButton.classList.remove("btn-primary");
          editButton.classList.add("btn-secondary");
          editIcon.classList.remove("bi-save");
          editIcon.classList.add("bi-pencil-square");
          tableNr.style.borderColor = "transparent"; // set the background color to transparent
          capacity.style.borderColor = "transparent"; // set the background color to transparent

          // Save your changes here, e.g., make an API call to update the data

          // Get the table number, capacity, and status values from their input elements
          var tableNr = parentCell.querySelector(
            "input[type=number][name=tableNr]"
          ).value;
          var capacity = parentCell.querySelector(
            "input[type=number][name=capacity]"
          ).value;
          var status = parentCell.querySelector(
            "input[type=checkbox][name=status]"
          ).checked;
          // Get the id value from the paragraph element
          var idValue = parentCell.querySelector("p").textContent;

          console.log(idValue);

          console.log(tableNr);
          console.log(capacity);
          console.log(status);

          tischBearbeiten(idValue, tableNr, capacity, status);
          parentCell = null;
        }
      }

      // Add an event listener to the button to open the modal on click
      editButton.addEventListener(
        "click",
        (function (
          tableNr,
          capacity,
          statusInput,
          statusInputLabel,
          editButton,
          editIcon
        ) {
          return function () {
            var parentCell = this.closest("td");
            // Toggle between "bearbeiten" and "speichern" buttons
            toggleEditSaveButton(
              editButton,
              editIcon,
              parentCell,
              tableNr,
              capacity
            );

            // Enable or disable the table number input field
            tableNr.disabled = !tableNr.disabled;

            // Enable or disable the table capacity input field
            capacity.disabled = !capacity.disabled;

            // Enable or disable the status checkbox
            statusInput.disabled = !statusInput.disabled;

            // Add or remove the event listener to update the status label when the checkbox state changes
            if (statusInput.disabled) {
              statusInput.removeEventListener("change", () =>
                updateStatusLabel(statusInput, statusInputLabel)
              );
            } else {
              statusInput.addEventListener("change", () =>
                updateStatusLabel(statusInput, statusInputLabel)
              );
            }
          };
        })(
          tableNr,
          capacity,
          statusInput,
          statusInputLabel,
          editButton,
          editIcon
        )
      );

      // Function to update the status label
      function updateStatusLabel(status, statusLabel) {
        statusLabel.innerText = status.checked ? "Besetzt" : "Frei";
        if (status.checked) {
          statusLabel.classList.add("text-danger");
          statusLabel.classList.remove("text-success");
        } else {
          statusLabel.classList.add("text-success");
          statusLabel.classList.remove("text-danger");
        }
      }

      // ...
      // Append the "bearbeiten" button div to the button container
      buttonContainer.appendChild(editButtonDiv);

      cell.appendChild(buttonContainer);

      cell.appendChild(wrapper);
    }

    // Append the cell to the current row
    current_row.appendChild(cell);
  }

  // Add the table to the container div
  container.appendChild(table);
}

export function tischBearbeiten(idValue, tableNr, capacity, status) {
  $.ajax({
    url: "http://localhost:3000/table/" + idValue,
    method: "PATCH",
    contentType: "application/json",
    data: JSON.stringify({
      tableNr: tableNr,
      capacity: capacity,
      status: status,
    }),
    success: function (data) {
      console.log("Appointment updated successfully:", data);
      alert("Tisch erfolgreich geändert!"); // display a popup message
    },
    error: function () {
      console.log("Failed to update appointment.");
    },
  });

  setTimeout(function () {
    console.log("getTables");
    getTables();
    resetSelect();
  }, 500);
}

export function tischLoeschen(idValue) {
  $.ajax({
    url: "http://localhost:3000/table/" + idValue,
    method: "DELETE",
    success: function (data) {
      console.log("Appointment deleted successfully:", data);
      alert("Tisch erfolgreich gelöscht!"); // display a popup message
    },
    error: function () {
      console.log("Failed to delete appointment.");
    },
  });

  setTimeout(function () {
    console.log("getTables");
    getTables();
    resetSelect();
  }, 500);
}
