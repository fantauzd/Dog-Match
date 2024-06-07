// Get the objects we need to modify
let updateUserForm = document.getElementById('update-user');

// Modify the objects we need
updateUserForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateID = document.getElementById("select-username");
    let newUsername = document.getElementById("update-username");
    let newPhone = document.getElementById("update-phone");
    let newEmail = document.getElementById("update-email");
    let newBirthdate = document.getElementById("update-birthdate");
    let newHome = document.getElementById("update-home_type");
    let newStreet = document.getElementById("update-street_address");
    let newCity = document.getElementById("update-city");
    let newPostal = document.getElementById("update-postal_code");
    let newState = document.getElementById("update-state");
    let newActivity = document.getElementById("update-activity_preference");
    let newShedding = document.getElementById("update-shedding_preference");
    let newTraining = document.getElementById("update-training_preference");
    let newSize = document.getElementById("update-size_preference");
    let newChildren = document.getElementById("update-has_children");
    let newDog = document.getElementById("update-has_dog");
    let newCat = document.getElementById("update-has_cat");
    let newActive = document.getElementById("update-is_active");

    // Get the values from the form fields
    let updateIDValue = updateID.value;
    let newUsernameValue = newUsername.value;
    let newPhoneValue = newPhone.value;
    let newEmailValue = newEmail.value;
    let newBirthdateValue = newBirthdate.value;
    let newHomeValue = newHome.value;
    let newStreetValue = newStreet.value;
    let newCityValue = newCity.value;
    let newPostalValue = newPostal.value;
    let newStateValue = newState.value;
    let newActivityValue = newActivity.value;
    let newSheddingValue = newShedding.value;
    let newTrainingValue = newTraining.value;
    let newSizeValue = newSize.value;
    let newChildrenValue = newChildren.value;
    let newDogValue = newDog.value;
    let newCatValue = newCat.value;
    let newActiveValue = newActive.value;


    // if ((updateIDValue == "test")) 
    //     {
    //         return;
    //     }

    // if (isNaN(newUsernameValue)) 
    //     {
    //         return;
    //     }
    
    // Put our data we want to send in a javascript object
    let data = {
        user_id: updateIDValue,
        username: newUsernameValue,
        phone: newPhoneValue,
        email: newEmailValue,
        birthdate: newBirthdateValue,
        home_type: newHomeValue,
        street_address: newStreetValue,
        city: newCityValue,
        postal_code: newPostalValue,
        state: newStateValue,
        activity_preference: newActivityValue,
        shedding_preference: newSheddingValue,
        training_preference: newTrainingValue,
        size_preferenceL: newSizeValue,
        has_children: newChildrenValue,
        has_dog: newDogValue,
        has_cat: newCatValue,
        is_active: newActiveValue,
    }
    console.log('data');
    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/users", true);
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


function updateRow(data, userID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("users-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == userID) {

            // Get the location of the row where we found the matching breed ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of name value
            let td = updateRowIndex.getElementsByTagName("td")[1];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].username;

            // Get td of phone value
            td = updateRowIndex.getElementsByTagName("td")[2];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].phone;

            // Get td of email value
            td = updateRowIndex.getElementsByTagName("td")[3];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].email;

            // Get td of birthdate value
            td = updateRowIndex.getElementsByTagName("td")[4];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].birthdate;

            // Get td of home type value
            td = updateRowIndex.getElementsByTagName("td")[5];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].home_type;

            // Get td of street value
            td = updateRowIndex.getElementsByTagName("td")[6];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].street_address;

            // Get td of city value
            td = updateRowIndex.getElementsByTagName("td")[7];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].city;

            // Get td of postal code value
            td = updateRowIndex.getElementsByTagName("td")[8];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].postal_code;

            // Get td of state value
            td = updateRowIndex.getElementsByTagName("td")[9];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].state;

            // Get td of activity_preference value
            td = updateRowIndex.getElementsByTagName("td")[10];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].activity_preference;

            // Get td of shedding value
            td = updateRowIndex.getElementsByTagName("td")[11];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].shedding_preference;

            // Get td of training value
            td = updateRowIndex.getElementsByTagName("td")[12];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].training_preference;

            // Get td of size value
            td = updateRowIndex.getElementsByTagName("td")[13];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].size_preference;

            // Get td of children value
            td = updateRowIndex.getElementsByTagName("td")[14];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].has_children;

            // Get td of dog value
            td = updateRowIndex.getElementsByTagName("td")[15];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].has_dog;

            // Get td of cat value
            td = updateRowIndex.getElementsByTagName("td")[16];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].has_cat;

            // Get td of is_active value
            td = updateRowIndex.getElementsByTagName("td")[17];
            // Reassign name to our value we updated to
            td.innerHTML = parsedData[0].is_active;

       }
    }
}