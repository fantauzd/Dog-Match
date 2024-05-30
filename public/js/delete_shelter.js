
function deleteShelter(shelterID) {
    let link = '/delete-shelter/';
    let data = {
        id: shelterID
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(shelterID);
            window.location.reload();
        }
    });
}

function deleteRow(shelterID) {
    let table = document.getElementById("shelters-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == shelterID) {
            table.deleteRow(i);
            deleteDropDownMenu(shelterID);
            break;
        }
    }
}

function deleteDropDownMenu(shelterID) {
    let selectMenu = document.getElementById("select-name");
    for (let i = 0; i < selectMenu.length; i++) {
        if (Number(selectMenu.options[i].value) === Number(shelterID)) {
            selectMenu[i].remove();
            break;
        }
    }
}
