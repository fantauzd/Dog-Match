function deleteDogs_has_users(dogs_has_usersID) {
    let link = '/dogs_has_users';
    let data = {
        dogs_has_users_id: dogs_has_usersID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(dogs_has_usersID);
      }
    });
}
  
  function deleteRow(dogs_has_usersID){
      let table = document.getElementById("dogs_has_users-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == dogs_has_usersID) {
              table.deleteRow(i);
              deleteDropDownMenu(dogs_has_usersID);
              break;
         }
      }
  }
  
  function deleteDropDownMenu(dogs_has_usersID){
    let selectMenu = document.getElementById("select-name");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(dogs_has_usersID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }