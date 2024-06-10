// Get the objects we need to modify
let addShelterForm = document.getElementById('add-shelter');

// Modify the objects we need
addShelterForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputEmail = document.getElementById("input-email");
    let inputStreetAddress = document.getElementById("input-street-address");
    let inputCity = document.getElementById("input-city");
    let inputPostalCode = document.getElementById("input-postal-code");
    let inputState = document.getElementById("input-state");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let emailValue = inputEmail.value;
    let streetAddressValue = inputStreetAddress.value;
    let cityValue = inputCity.value;
    let postalCodeValue = inputPostalCode.value;
    let stateValue = inputState.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        email: emailValue,
        street_address: streetAddressValue,
        city: cityValue,
        postal_code: postalCodeValue,
        state: stateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-shelter", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputEmail.value = '';
            inputStreetAddress.value = '';
            inputCity.value = '';
            inputPostalCode.value = '';
            inputState.value = '';
        } 
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function addRowToTable(data) {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("shelters-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let streetAddressCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let postalCodeCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.shelter_id;
    nameCell.innerText = newRow.name;
    emailCell.innerText = newRow.email;
    streetAddressCell.innerText = newRow.street_address;
    cityCell.innerText = newRow.city;
    postalCodeCell.innerText = newRow.postal_code;
    stateCell.innerText = newRow.state;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteShelter(newRow.shelter_id);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(streetAddressCell);
    row.appendChild(cityCell);
    row.appendChild(postalCodeCell);
    row.appendChild(stateCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.shelter_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("select-name");
    let option = document.createElement("option");
    option.text = newRow.name;
    option.value = newRow.shelter_id;
    selectMenu.add(option);
}
