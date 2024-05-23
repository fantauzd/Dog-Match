// Get the objects we need to modify
let addBreedForm = document.getElementById('add-breed');

// Modify the objects we need
addBreedForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    inputs = ["input-name", "input-activity_level", "input-shedding_level", "input-size"];
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
    xhttp.open("POST", "/breeds", true);
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
    let currentTable = document.getElementById("breeds-table");

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

    // iteratively add all the other cells to the row
    for (let key in newRow) {
        nextCell = document.createElement("TD");
        nextCell.innerText = newRow[key];
        row.appendChild(nextCell);
    }
    
    // Add the row to the table
    currentTable.appendChild(row);
}