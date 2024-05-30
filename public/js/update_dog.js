
// Get the objects we need to modify
let updateDogForm = document.getElementById('update-dog');

// Modify the objects we need
updateDogForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateID = document.getElementById("select-name");
    let newName = document.getElementById("update-name");
    let newBirthdate = document.getElementById("update-birthdate");
    let newTrainingLevel = document.getElementById("update-training_level");
    let newIsFamilyFriendly = document.getElementById("update-is_family_friendly");
    let newShelterArrivalDate = document.getElementById("update-shelter_arrival_date");
    let newIsActive = document.getElementById("update-is_active");
    let newShelterID = document.getElementById("update-shelter_id");
    let newBreedID = document.getElementById("update-breed_id");
    

    // Get the values from the form fields
    let updateIDValue = updateID.value;
    let newNameValue = newName.value;
    let newBirthdateValue = newBirthdate.value;
    let newTrainingLevelValue = newTrainingLevel.value;
    let newIsFamilyFriendlyValue = newIsFamilyFriendly.value;
    let newShelterArrivalDateValue = newShelterArrivalDate.value;
    let newIsActiveValue = newIsActive.value;
    let newShelterIDValue = newShelterID.value;
    let newBreedIDValue = newBreedID.value;

    // Put our data we want to send in a javascript object
    let data = {
        dog_id: updateIDValue,
        name: newNameValue,
        birthdate: newBirthdateValue,
        training_level: newTrainingLevelValue,
        is_family_friendly: newIsFamilyFriendlyValue,
        shelter_arrival_date: newShelterArrivalDateValue,
        is_active: newIsActiveValue,
        shelter_id: newShelterIDValue,
        breed_id: newBreedIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-dog", true);
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
    location.reload();

});


function updateRow(data, dogID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("dogs-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == dogID) {

            // Get the location of the row where we found the matching dog ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of name value and reassign
            let td = updateRowIndex.getElementsByTagName("td")[1];
            td.innerHTML = parsedData[0].name;

            // Get td of name value and reassign
            td = updateRowIndex.getElementsByTagName("td")[2];
            td.innerHTML = parsedData[0].birthdate;

            // Get td of name value and reassign
            td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].training_level;

            // Get td of name value and reassign
            td = updateRowIndex.getElementsByTagName("td")[4];
            td.innerHTML = parsedData[0].is_family_friendly;

            // Get td of name value and reassign
            td = updateRowIndex.getElementsByTagName("td")[5];
            td.innerHTML = parsedData[0].shelter_arrival_date;

            // Get td of name value and reassign
            td = updateRowIndex.getElementsByTagName("td")[6];
            td.innerHTML = parsedData[0].is_active;

            // Get td of name value and reassign
            td = updateRowIndex.getElementsByTagName("td")[7];
            td.innerHTML = parsedData[0].shelter_id;

            // Get td of name value and reassign
            td = updateRowIndex.getElementsByTagName("td")[8];
            td.innerHTML = parsedData[0].breed_id;
       }
    }
}
