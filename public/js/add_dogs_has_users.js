// Get the objects we need to modify
let addDogs_has_usersForm = document.getElementById('add-dogs_has_users');

// Modify the objects we need
addBreedForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    inputs = ["input-source", "input-users_user_id", "input-dogs_dog_id"];
    data = {};
    for (let x in inputs) {
        // Get form fields we need to get data from
        let val = document.getElementById(inputs[x]);
        // Get the values from the form fields
        val = val.value;
        // Put our data we want to send in a javascript object
        x = inputs[x].split("-").pop();   // takes the string after the '-' character
        data[x] = val; 
    };
    // Ensure the dictionary is built properly
    console.log('data');
    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/dogs_has_users", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // Add the new data to the table
            addRowToTable(xhttp.response);
            console.log('xhttp.response');
            console.log(xhttp.response);

            for (let i in inputs) {
                // Clear the input fields for another transaction
                document.getElementById(inputs[i]).value = '';
            };
            // Handle special case for size
            document.getElementById("input-source").value = "NULL"; 
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// breeds
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("dogs_has_users-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    console.log('parsed data');
    console.log(parsedData);
    let newRow = parsedData[parsedData.length - 1]
    console.log('newRow');
    console.log(newRow);

    // Create a row
    let row = document.createElement("TR");

    // iteratively add all the other data cells to the row
    for (let key in newRow) {
        nextCell = document.createElement("TD");
        nextCell.innerText = newRow[key];
        row.appendChild(nextCell);
    }

    // Add the delete button to the row
    let deleteCell = document.createElement("TD");
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBreed(newRow.breed_id);
    };

    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.breed_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("select-name");
    let option = document.createElement("option");
    option.text = newRow.name;
    option.value = newRow.breed_id;
    selectMenu.add(option);
}