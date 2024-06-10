// This is actually used for an update request that deactivates the shelter

function deleteShelter(ID) {
    let link = '/deactivate-shelter';
    let data = {id: ID};
    console.log(data);
  
    $.ajax({
      url: link,
      type: 'PUT',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
    });
}
