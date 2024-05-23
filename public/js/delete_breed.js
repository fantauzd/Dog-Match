function deleteBreed(breed_id) {
    let link = '/breeds';
    let data = {
      id: breed_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(breed_id);
      }
    });
  }
  
  function deleteRow(breed_id){
      let table = document.getElementById("breeds-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == breed_id) {
              table.deleteRow(i);
              break;
         }
      }
  }