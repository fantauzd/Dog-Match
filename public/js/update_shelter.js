// Get the objects we need to modify
let updateShelterForm = document.getElementById('update-shelter');

// Modify the objects we need
updateShelterForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateID = document.getElementById("select-name");
    let newName = document.getElementById("update-name");
    let newEmail = document.getElementById("update-email");
    let newStreetAddress = document.getElementById("update-street-address");
    let newCity = document.getElementById("update-city");
    let newPostalCode = document.getElementById("update-postal-code");
    let newState = document.getElementById("update-state");

    // Get the values from the form fields
    let updateIDValue = updateID.value;
    let newNameValue = newName.value;
    let newEmailValue = newEmail.value;
    let newStreetAddressValue = newStreetAddress.value;
    let newCityValue = newCity.value;
    let newPostalCodeValue = newPostalCode.value;
    let newStateValue = newState.value;

    // Put our data we want to send in a javascript object
    let data = {
        shelter_id: updateIDValue,
        name: newNameValue,
        email: newEmailValue,
        street_address: newStreetAddressValue,
        city: newCityValue,
        postal_code: newPostalCodeValue,
        state: newStateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-shelter", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, updateIDValue);
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload();
});

function updateRow(data, shelterID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("shelters-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == shelterID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td = updateRowIndex.getElementsByTagName("td")[1];
            td.innerHTML = parsedData[0].name;

            td = updateRowIndex.getElementsByTagName("td")[2];
            td.innerHTML = parsedData[0].email;

            td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].street_address;

            td = updateRowIndex.getElementsByTagName("td")[4];
            td.innerHTML = parsedData[0].city;

            td = updateRowIndex.getElementsByTagName("td")[5];
            td.innerHTML = parsedData[0].postal_code;

            td = updateRowIndex.getElementsByTagName("td")[6];
            td.innerHTML = parsedData[0].state;
        }
    }
}
