const baseUrl = ["http://localhost:3000","http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

function displayReports(subreaddit_name, subreaddit_id) {
    // call the web service endpoint
    $.ajax({
        url: baseUrl[0] + '/report/reports/' + subreaddit_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var appendString = "";
            for (var i = 0; i < data.Result.length; i++) {
                var reports = data.Result[i];
                appendString += `<tr>
                                        <th scope="row">${i + 1}</th>
                                        <td>${reports.report_description}</td>
                                        <td>${reports.Post.title}</td>
                                        <td>${reports.User.username}</td>
                                        <td>${reports.created_at}</td>
                                        <td> <button type="submit" onclick="window.location.href='${baseUrl[1] + "/r/" + subreaddit_name + "/" + reports.Post.post_id + "'"}" name="${reports.report_id}" id = "${reports.report_id}" class="ViewCall rounded" style="background-color:#6a5acd; color:white; border-width: 0px;">View Post</button> </td>
                                        <td> <button type="submit" onclick="deleteReport(${reports.report_id})" name="${reports.report_id}" id = "${reports.report_id}" class="DeleteCall rounded" style="background-color:#6a5acd; color:white; border-width: 0px;">Delete</button> </td>
                                    </tr>`;
            }
            $("#load").html("");
            $("#reports").append(appendString);

        },
        error: function (xhr, textStatus, errorThrown) {
            notifier.alert(xhr.responseJSON.message);
        }
    });

}

$(document).ready(function () {

    //check if logged in
    try {
        var userData = localStorage.getItem('userInfo');
        var token = localStorage.getItem("token")

        var userJsonData = JSON.parse(userData);
        var role = userJsonData.fk_user_type_id;

    } catch (error) {
        window.location.assign(`${baseUrl[1]}/login.html`);
    }

    //extract URL params
    var queryParams = new URLSearchParams(window.location.search);
    var subreaddit_name = queryParams.get("subreaddit");

    $.ajax({
        url: baseUrl[0] + '/r/' + subreaddit_name,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var subreaddit_id = data.subreaddit_id;
            displayReports(subreaddit_name, subreaddit_id);
        },
        error: function (xhr, textStatus, errorThrown) {
            notifier.alert(xhr.responseJSON.message);
            console.log(xhr)
            console.log(textStatus);
            console.log(errorThrown);
            console.log(xhr.status);
        }
    });

    $("#return").click(function () {
        window.location.assign(`${baseUrl[1]}/r/` + subreaddit_name);
    });

    $('body').on('click', '.EditCall', function () {
        var user_id = event.srcElement.id;
        window.location.assign(`${baseUrl[1]}/admin/editUser.html?id=` + user_id);
    });
});

function deleteReport(report_id) {
    var check = confirm("Delete Report No. " + report_id + "?");
    if (check) {
        notifier.info("Deleting Report...")
        $.ajax({
            url: baseUrl[0] + '/report/report/' + report_id,
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                location.reload();
            },
            error: function (xhr, textStatus, errorThrown) {
                notifier.alert(xhr.responseJSON.message);
            }
        });

    }
}
