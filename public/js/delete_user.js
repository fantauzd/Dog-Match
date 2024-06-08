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
      // success: function(result) {
      //   deleteRow(userID);
      // }
    });
}
  
// function deleteRow(userID){
//   let table = document.getElementById("users-table");
//   for (let i = 0, row; row = table.rows[i]; i++) {
//     if (table.rows[i].getAttribute("data-value") == userID) {
//       table.deleteRow(i);
//       deleteDropDownMenu(userID);
//       break;
//     }
//   }
// }
  
//   function deleteDropDownMenu(userID){
//     let selectMenu = document.getElementById("select-username");
//     for (let i = 0; i < selectMenu.length; i++){
//       if (Number(selectMenu.options[i].value) === Number(userID)){
//         selectMenu[i].remove();
//         break;
//       } 
  
//     }
// }