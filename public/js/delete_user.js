function deleteUser(userID) {
    let link = '/users';
    let data = {
      id: userID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(userID);
      }
    });
  }
  
  function deleteRow(userID){
      let table = document.getElementById("users-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == userID) {
              table.deleteRow(i);
              deleteDropDownMenu(userID);
              break;
         }
      }
  }
  
  function deleteDropDownMenu(userID){
    let selectMenu = document.getElementById("select-username");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(userID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }