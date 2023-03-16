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
    cell.classList.add("p-3", "text-center", "m-3");

    if (i < grid_size) {
      // Create an image element and set its src attribute
      var img = document.createElement("img");
      img.src = "img/delfiLogo.png"; // Replace with the actual path to your image file
      img.classList.add("img-fluid");
      img.height = 25;
      img.width = 25;

      // Append the image element to the cell
      cell.appendChild(img);

      // Create a heading element for the table number
      var heading = document.createElement("h4");
      heading.innerText = data[i].tableNr;

      // Append the heading element to the cell
      cell.appendChild(heading);

      // Create a paragraph element for the table capacity
      var capacity = document.createElement("p");
      capacity.innerText = data[i].capacity;

      // Append the capacity element to the cell
      cell.appendChild(capacity);

      // Create a paragraph element for the table status
      var status = document.createElement("p");
      status.innerText = data[i].status;

      // Append the status element to the cell
      cell.appendChild(status);
    } else {
      // Create a button element with Bootstrap classes
      var button = document.createElement("button");
      button.classList.add("btn", "btn-success");

      // Create a span element with the Font Awesome icon class
      var icon = document.createElement("img");
      icon.classList.add("d-inline-block");
      icon.height = 25;
      icon.width = 25;
      icon.src = "img/addLogo.png";

      // Append the icon span element to the button element
      button.appendChild(icon);

      // Append the button element to the last cell in the last row
      cell.appendChild(button);
    }

    // Append the cell to the current row
    current_row.appendChild(cell);
  }

  // Add the table to the container div
  container.appendChild(table);
}
