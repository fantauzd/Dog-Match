// This is actually used for an update request that deactivates the user

function deleteDog(dogID) {
  let link = '/dogs-deactivate';
  let data = {id: dogID};
  console.log(data);

  $.ajax({
    url: link,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deactivateRow(dogID);
    }
  });
}

function deactivateRow(dogID) {
console.log('update data');
console.log(dogID);


let table = document.getElementById("dogs-table");

for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == dogID) {
        let updateRowIndex = table.getElementsByTagName("tr")[i];

        let td = updateRowIndex.getElementsByTagName("td")[6];
        td.innerHTML = 0;

    }
}
}