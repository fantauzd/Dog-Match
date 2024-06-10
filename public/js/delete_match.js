// This module is adapted from the CS340 starter code with significant changes for enhanced functionality. 

// This is actually used for an update request that deactivates the user

function deleteMatch(matchID) {
    let link = '/matches';
    let data = {match_id: matchID};
    console.log(data);
  
    $.ajax({
      url: link,
      type: 'PUT',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deactivateRow(matchID);
      }
    });
}

function deactivateRow(matchID) {
  console.log('update data');
  console.log(matchID);


  let table = document.getElementById("matches-table");

  for (let i = 0, row; row = table.rows[i]; i++) {
      if (table.rows[i].getAttribute("data-value") == matchID) {
          let updateRowIndex = table.getElementsByTagName("tr")[i];

          let td = updateRowIndex.getElementsByTagName("td")[6];
          td.innerHTML = 0;

      }
  }
}