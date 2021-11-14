const baseUrl = ["http://localhost:3000","http://localhost:3001"]

function displayReports(subreaddit_name, subreaddit_id) {
    // call the web service endpoint
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
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
                                        <td> <button type="submit" onclick="window.location.href='${baseUrl[1] + "/r/" + subreaddit_name + "/" + reports.Post.post_id + "'"}" name="${reports.report_id}" id = "${reports.report_id}" class="ViewCall" style="background-color:#6a5acd; color:white; border-width: 0px;">View Post</button> </td>
                                        <td> <button type="submit" onclick="deleteReport(${reports.report_id})" name="${reports.report_id}" id = "${reports.report_id}" class="DeleteCall" style="background-color:#6a5acd; color:white; border-width: 0px;">Delete</button> </td>
                                    </tr>`;
            }
            $("#load").html("");
            $("#reports").append(appendString);

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
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

    } catch (error) {
        alert("Unauthenticated User!");
        window.location.assign("http://localhost:3001/login.html");
    }

    var queryParams = new URLSearchParams(window.location.search);
    console.log("---------Query Parameters---------");
    console.log("Query Param (source): " + window.location.search);
    console.log("Query Param (extracted): " + queryParams);

    var subreaddit_name = queryParams.get("subreaddit");

    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        url: baseUrl[0] + '/r/' + subreaddit_name,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var subreaddit_id = data.subreaddit_id;
            displayReports(subreaddit_name, subreaddit_id);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr)
            console.log(textStatus);
            console.log(errorThrown);
            console.log(xhr.status);
        }
    });

    $("#return").click(function () {
        window.location.assign("http://localhost:3001/r/" + subreaddit_name);
    });

    $('body').on('click', '.EditCall', function () {
        var user_id = event.srcElement.id;
        window.location.assign("http://localhost:3001/admin/editUser.html?id=" + user_id);
    });
});

function deleteReport(report_id) {
    var check = confirm("Delete Report No. " + report_id + "?");
    if (check) {
        $.ajax({
            //headers: { 'authorization': 'Bearer ' + tmpToken },
            url: baseUrl[0] + '/report/report/' + report_id,
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                location.reload();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
                console.log(xhr)
                console.log(textStatus);
                console.log(errorThrown);
                console.log(xhr.status);
            }
        });

    }
}
