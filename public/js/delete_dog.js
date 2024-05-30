function deleteDog(dogID) {
    let link = '/delete-dog/';
    let data = {
      id: dogID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(dogID);
        location.reload();
      }
    });
  }
  
  function deleteRow(dogID){
      let table = document.getElementById("dogs-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == dogID) {
            table.deleteRow(i);
            deleteDropDownMenu(dogID);
            break;
         }
      }
  }

  function deleteDropDownMenu(dogID){
    let selectMenu = document.getElementById("select-name");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(dogID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }