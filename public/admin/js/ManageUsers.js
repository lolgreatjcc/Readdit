//const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]


let notifier = new AWN({icons:{enabled:false}})
function displayUsers(user_id, token) {

    // call the web service endpoint
    $.ajax({
        headers: { 'authorization': 'Bearer ' + token },
        url: `${baseUrl[0]}/users`,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var appendString = "";
            for (var i = 0; i < data.Result.length; i++) {
                var user = data.Result[i];
                if (user.two_fa == 1) {
                    var twofa = "On"
                }
                else {
                    var twofa = "Off"
                }

                if (user.fk_user_type_id == 1) {
                    var type = "User"
                }
                else if (user.fk_user_type_id == 2) {
                    var type = "Admin"
                }

                if(user.profile_pic == null){
                    user.profile_pic = 'https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png';
                }

                var pfp = "";
                if (user.profile_pic.slice(0, 5) == "https"){
                    pfp = (user.profile_pic).replace("https://res.cloudinary.com/readditmedia/image/upload/", "");
                }
                else{
                    pfp = (user.profile_pic).replace("http://res.cloudinary.com/readditmedia/image/upload/", "");
                }
                
                
                if (user_id == user.user_id) {
                    appendString += `<tr>
                                        <th scope="row">${i + 1}</th>
                                        <td>${user.username}</td>
                                        <td>${user.email}</td>
                                        <td>${pfp}</td>
                                        <td>${twofa}</td>
                                        <td>${type}</td>
                                        <td> <button type="submit" name="${user.username}" id = "${user.user_id}" class="EditCall rounded p-2" style="background-color:#dcd8f3; color:white; border-width: 0px;" disabled>Edit</button> </td>
                                        <td> <button type="submit" name="${user.username}" id = "${user.user_id}" class="DeleteCall rounded p-2" style="background-color:#dcd8f3; color:white; border-width: 0px;" disabled>Delete</button> </td>
                                    </tr>`;
                }
                else {
                    appendString += `<tr>
                                        <th scope="row">${i + 1}</th>
                                        <td>${user.username}</td>
                                        <td>${user.email}</td>
                                        <td>${pfp}</td>
                                        <td>${twofa}</td>
                                        <td>${type}</td>
                                        <td> <button type="submit" name="${user.username}" id = "${user.user_id}" class="EditCall rounded p-2" style="background-color:#6a5acd; color:white; border-width: 0px;">Edit</button> </td>
                                        <td> <button type="submit" name="${user.username}" id = "${user.user_id}" class="DeleteCall rounded p-2" style="background-color:#6a5acd; color:white; border-width: 0px;">Delete</button> </td>
                                    </tr>`;
                }
            }
            $("#load").html("");
            $("#users").append(appendString);

        },
        error: function (xhr, textStatus, errorThrown) {
            notifier.alert(xhr.responseJSON.message);
            console.log(xhr)
            console.log(textStatus);
            console.log(errorThrown);
            console.log(xhr.status);
            if (xhr.status == 403) {
                $("#load").html("");
                $("#users").append("Unauthorized Request!!");
            }
        }
    });

}

$(document).ready(function () {

    try {
        var userData = localStorage.getItem('userInfo');
        var token = localStorage.getItem("token")
        // userData = userData.slice(1,-1);

        var userJsonData = JSON.parse(userData);
        var user_id = userJsonData.user_id;
        
        $.ajax({
            headers: { 'authorization': 'Bearer ' + token },
            url: `${baseUrl[0]}/verify`,
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data, textStatus, xhr) {
            },
            error: function (xhr, textStatus, errorThrown) {
                window.location.assign(`${baseUrl[1]}/home.html`);
            }
        });
    } catch (error) {
        window.location.assign(`${baseUrl[1]}/login.html`);
    }

    displayUsers(user_id, token);

    $("#return").click(function () {
        window.location.assign(`${baseUrl[1]}/admin/admin_home.html`);
    });

    $("#create").click(function () {
        window.location.assign(`${baseUrl[1]}/admin/createUser.html`);
    });

    $('body').on('click', '.DeleteCall', function () {
        var user_id = event.srcElement.id;
        var username = event.srcElement.name;
        var check = confirm("Delete " + username + "?");
        if (check) {
            notifier.info("Processing Request...");
            $.ajax({
                headers: { 'authorization': 'Bearer ' + token },
                url: `${baseUrl[0]}/users/` + user_id,
                type: 'DELETE',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (data, textStatus, xhr) {
                    location.reload();
                },
                error: function (xhr, textStatus, errorThrown) {
                    notifier.alert(xhr.responseJSON.message);
                    console.log(xhr);
                    console.log(textStatus);
                    console.log(errorThrown);
                    console.log(xhr.status);
                    if (xhr.status == 403) {
                        $("#load").html("");
                        $("#users").append("Unauthorized Request!!");
                    }
                }
            });

        }
    });

    $('body').on('click', '.EditCall', function () {
        var user_id = event.srcElement.id;
        window.location.assign(`${baseUrl[1]}/admin/editUser.html?id=` + user_id);
    });
});
