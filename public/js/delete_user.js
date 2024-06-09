// This is actually used for an update request that deactivates the user

function deleteUser(userID) {
    let link = '/users-deactivate';
    let data = {id: userID};
    console.log(data);
  
    $.ajax({
      url: link,
      type: 'PUT',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deactivateRow(userID);
      }
    });
}

function deactivateRow(userID) {
  console.log('update data');
  console.log(userID);


  let table = document.getElementById("users-table");

  for (let i = 0, row; row = table.rows[i]; i++) {
      if (table.rows[i].getAttribute("data-value") == userID) {
          let updateRowIndex = table.getElementsByTagName("tr")[i];

          let td = updateRowIndex.getElementsByTagName("td")[17];
          td.innerHTML = 0;

      }
  }
}