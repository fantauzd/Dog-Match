// This module is adapted from the CS340 starter code with significant changes for enhanced functionality. 

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
