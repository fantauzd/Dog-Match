function deleteBreed(breedID) {
  let link = '/breeds';
  let data = {
    id: breedID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(breedID);
    }
  });
}

function deleteRow(breedID){
    let table = document.getElementById("breeds-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == breedID) {
            table.deleteRow(i);
            break;
       }
    }
}