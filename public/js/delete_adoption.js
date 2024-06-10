// This module is adapted from the CS340 starter code with significant changes for enhanced functionality. 

function deleteAdoption(adoptionID, dogID) {
    let link = '/delete-adoption/';
    let data = {
      id: adoptionID,
      dog_id: dogID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(adoptionID);
        // location.reload();
      }
    });
  }

  function deleteRow(adoptionID) {
    let table = document.getElementById("adoptions-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == adoptionID) {
            table.deleteRow(i);
            break;
        }
    }
}