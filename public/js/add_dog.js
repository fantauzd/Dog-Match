// Get the objects we need to modify
let addDogForm = document.getElementById('add-dog');

// Modify the objects we need
addDogForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputBirthdate = document.getElementById("input-birthdate");
    let inputTrainingLevel = document.getElementById("input-training_level");
    let inputIsFamilyFriendly = document.getElementById("input-is_family_friendly");
    let inputShelterArrivalDate = document.getElementById("input-shelter_arrival_date");
    let inputIsActive = document.getElementById("input-is_active");
    let inputShelterID = document.getElementById("input-shelter_id");
    let inputBreedID = document.getElementById("input-breed_id");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let birthdateValue = inputBirthdate.value;
    let trainingLevelValue = inputTrainingLevel.value;
    let isFamilyFriendlyValue = inputIsFamilyFriendly.value;
    let shelterArrivalDateValue = inputShelterArrivalDate.value;
    let isActiveValue = inputIsActive.value;
    let shelterIDValue = inputShelterID.value;
    let breedIDValue = inputBreedID.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        birthdate: birthdateValue,
        training_level: trainingLevelValue,
        is_family_friendly: isFamilyFriendlyValue,
        shelter_arrival_date: shelterArrivalDateValue,
        is_active: isActiveValue,
        shelter_id: shelterIDValue,
        breed_id: breedIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dog", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputBirthdate.value = '';
            inputTrainingLevel.value = '';
            inputIsFamilyFriendly.value = '';
            inputShelterArrivalDate.value = '';
            inputIsActive.value = '';
            inputShelterID.value = '';
            inputBreedID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("dogs-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let birthdateCell = document.createElement("TD");
    let trainingLevelCell = document.createElement("TD");
    let isFamilyFriendlyCell = document.createElement("TD");
    let shelterArrivalDateCell = document.createElement("TD");
    let isActiveCell = document.createElement("TD");
    let shelterIDCell = document.createElement("TD");
    let breedIDCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.dog_id;
    nameCell.innerText = newRow.name;
    birthdateCell.innerText = newRow.birthdate;
    trainingLevelCell.innerText = newRow.training_level;
    isFamilyFriendlyCell.innerText = newRow.is_family_friendly;
    shelterArrivalDateCell.innerText = newRow.shelter_arrival_date;
    isActiveCell.innerText = newRow.is_active;
    shelterIDCell.innerText = newRow.shelter_id;
    breedIDCell.innerText = newRow.breed_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteDog(newRow.id);
    };
    

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(birthdateCell);
    row.appendChild(trainingLevelCell);
    row.appendChild(isFamilyFriendlyCell);
    row.appendChild(shelterArrivalDateCell);
    row.appendChild(isActiveCell);
    row.appendChild(shelterIDCell);
    row.appendChild(breedIDCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("select-name");
    let option = document.createElement("option");
    option.text = newRow.name;
    option.value = newRow.dog_id;
    selectMenu.add(option);
    // End of new step 8 code.
}