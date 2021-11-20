const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

function loadUserInfo(user_id, token) {
    $('#load').html("Loading Info...");

    // call the web service endpoint
    $.ajax({
        url: `${baseUrl[0]}/users/` + user_id,
        type: 'GET',
        headers: { "Authorization": "Bearer " + token },
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var user = data.Result;
            // compile the data that the card needs for it's creation
            if (user.fk_user_type_id == 2) {
                console.log("admin");
                $("#role").val("2");
            }
            else {
                console.log("user");
                $("#role").val("1");
            }
            $('#title').html(`Edit ${user.username}`);
            //display pfp
            var pfp = (user.profile_pic).replace("http://res.cloudinary.com/readditmedia/image/upload/","");
            $('#profileurl').html(`<p id = "profile_pic" val="${pfp}"> ${pfp} </p>`);
            try {
                if (user.profile_pic === "undefined" || user.profile_pic == null || user.profile_pic.trim().length == 0 || user.profile_pic == "NULL") {
                    $('#pfpImg').html('<img style="width:200px;" src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="No pfp to show" id="pfp" class="pb-2"></img><br>')
                }
                else {
                    console.log("Pfp: " + user.profile_pic);
                    var pfpTempString = user.profile_pic.split("upload");
                    user.profile_pic = pfpTempString[0] + "upload" + "/ar_1.0,c_fill/r_max" + pfpTempString[1]
                    $('#pfpImg').html('<img style="width:200px;" src="' + user.profile_pic + '" alt="No pfp to show" id="pfp" class="pb-2"></img><br>')
                }
            }
            catch (error) {
                $('#pfpImg').html('<img style="width:200px;" src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="No pfp to show" id="pfp" class="pb-2"></img><br>')
                console.log(error)
            }

            $('#load').html("");
        },


        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            notifier.alert("Error loading user info.")
        }
    });
};


$(document).ready(function () {
    var userData = localStorage.getItem('userInfo');
    var token = localStorage.getItem("token")
    // userData = userData.slice(1,-1);

    var userJsonData = JSON.parse(userData);
    var role = userJsonData.fk_user_type_id;

    var tmpToken = localStorage.getItem('token');

    var queryParams = new URLSearchParams(window.location.search);
    console.log("---------Query Parameters---------");
    console.log("Query Param (source): " + window.location.search);
    console.log("Query Param (extracted): " + queryParams);

    var user_id = queryParams.get("id");

    loadUserInfo(user_id, tmpToken);

    $("#update").click(function () {
        notifier.info('Submitting update...');
        var profile_pic = $('#profileurl').val();
        var fk_user_type_id = parseInt($('#role').val());

        const requestBody = {
            profile_pic: profile_pic,
            fk_user_type_id: fk_user_type_id
        };

        console.log(requestBody);

        // axios.put(`https://readdit-backend.herokuapp.comr/subreaddit/` + subreaddit_id,requestBody)

        axios.put(`${baseUrl[0]}/user/` + user_id, requestBody)
            .then(response => {
                notifier.success('User updated successfully!');
            })
            .catch(error => {
                notifier.alert('Error updating User');
            })
    });

    $("#Return").click(function () {
        window.location.assign(`${baseUrl[1]}/admin/ManageUsers.html`);
    });

    $("#image").click(function () {
        var check = confirm("Delete profile picture?");
        if (check) {
            $('#pfpImg').html('<img style="width:200px;" src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="No pfp to show" id="pfp" class="pb-2"></img><br>')
            $('#profileurl').html(`<p id = "profile_pic" val=""></p>`);
        }
    });
})