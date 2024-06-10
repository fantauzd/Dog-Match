function activateShelter(ID) {
    let link = '/reactivate-shelter';
    let data = {id: ID};
    console.log(data);
  
    $.ajax({
      url: link,
      type: 'PUT',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
    });
}
