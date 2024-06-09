// Get the objects we need to modify
let updateBreedForm = document.getElementById('update-breed');

// Modify the objects we need
updateBreedForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateID = document.getElementById("select-name");
    let newName = document.getElementById("update-name");
    let newActivity = document.getElementById("update-activity-level");
    let newShedding = document.getElementById("update-shedding-level");
    let newSize = document.getElementById("update-size");

    // Get the values from the form fields
    let updateIDValue = updateID.value;
    let newNameValue = newName.value;
    let newActivityValue = newActivity.value;
    let newSheddingValue = newShedding.value;
    let newSizeValue = newSize.value;

    // if ((updateIDValue == "test")) 
    //     {
    //         return;
    //     }

    // if (isNaN(newNameValue)) 
    //     {
    //         return;
    //     }
    
    // Put our data we want to send in a javascript object
    let data = {
        breed_id: updateIDValue,
        name: newNameValue,
        activity_level: newActivityValue,
        shedding_level: newSheddingValue,
        size: newSizeValue
    }
    console.log('data');
    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/breeds", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, updateIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, breedID){
    let parsedData = JSON.parse(data);
    console.log('parsedData');
    console.log(parsedData);
    
    let table = document.getElementById("breeds-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == breedID) {

            // Get the location of the row where we found the matching breed ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of name value
            let td = updateRowIndex.getElementsByTagName("td")[1];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].name; 

             // Get td of activity level value and reassign
             td = updateRowIndex.getElementsByTagName("td")[2];
             td.innerHTML = parsedData[0].activity_level; 

            // Get td of shedding level value and reassign
            td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].shedding_level;

            // Get td of size value and reassign
            td = updateRowIndex.getElementsByTagName("td")[4];
            td.innerHTML = parsedData[0].size;
       }
    }
}