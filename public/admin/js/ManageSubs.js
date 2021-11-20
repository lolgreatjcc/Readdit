const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

function displaySubs() {
    // call the web service endpoint
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        url: `${baseUrl[0]}/r/subreaddits`,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var appendString = "";
            for (var i = 0; i < data.Result.length; i++) {
                var subreaddits = data.Result[i];
                appendString += `<tr>
                                        <th scope="row">${i + 1}</th>
                                        <td>${subreaddits.subreaddit_name}</td>
                                        <td>${subreaddits.subreaddit_description}</td>
                                        <td>${subreaddits["User.creator"]}</td>
                                        <td>${subreaddits.created_at}</td>
                                        <td> <button type="submit" name="${subreaddits.subreaddit_name}" id = "${subreaddits.subreaddit_id}" class="EditCall rounded p-2" style="background-color:#6a5acd; color:white; border-width: 0px;">Edit</button> </td>
                                        <td> <button type="submit" id = "${subreaddits.subreaddit_id}" name="${subreaddits.subreaddit_name}" class="DeleteCall rounded p-2" style="background-color:#6a5acd; color:white; border-width: 0px;">Delete</button> </td>
                                    </tr>`;
            }
            $("#load").html("");
            $("#subreaddits").append(appendString);

        },
        error: function (xhr, textStatus, errorThrown) {
            notifier.alert(xhr.responseJSON.message);
            console.log(xhr)
            console.log(textStatus);
            console.log(errorThrown);
            console.log(xhr.status);
            //if (xhr.status == 401) {
            //    $('$msg').html('Unauthorised User');
            //}
        }
    });

}

$(document).ready(function () {
    try {
        var userData = localStorage.getItem('userInfo');
        var token = localStorage.getItem("token")
        // userData = userData.slice(1,-1);

        var userJsonData = JSON.parse(userData);
        var role = userJsonData.fk_user_type_id;

        var tmpToken = localStorage.getItem('token');

        if (role != 2) {
            window.location.assign(`${baseUrl[1]}/home.html`);
        }
    } catch (error) {
        window.location.assign(`${baseUrl[1]}/login.html`);
    }

    displaySubs();

    $("#return").click(function () {
        window.location.assign(`${baseUrl[1]}/admin/admin_home.html`);
    });

    $('body').on('click', '.DeleteCall', function () {
        var subreaddit_id = event.srcElement.id;
        var subreaddit_name = event.srcElement.name;
        console.log(subreaddit_id);
        var check = confirm("Delete " + subreaddit_name + "?");
        if (check) {
            notifier.info("Processing Request...");
            $.ajax({
                //headers: { 'authorization': 'Bearer ' + tmpToken },
                url: `${baseUrl[0]}/r/subreaddit/` + subreaddit_id,
                type: 'DELETE',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (data, textStatus, xhr) {
                    location.reload();
                },
                error: function (xhr, textStatus, errorThrown) {
                    notifier.alert(xhr.responseJSON.message)
                    console.log(xhr)
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log(xhr.status);
                }
            });
        }
    });

    $('body').on('click', '.EditCall', function () {
        var subreaddit_id = event.srcElement.id;
        window.location.assign(`${baseUrl[1]}/admin/editSubs.html?id=` + subreaddit_id);
    });
});
