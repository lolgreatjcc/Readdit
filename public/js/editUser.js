const baseUrl = "http://localhost:3000";
// const baseUrl = "https://readdit-backend.herokuapp.com"

function loadUserInfo() {
    var { user_id } = JSON.parse(localStorage.getItem("userInfo"))
    var token = localStorage.getItem("token")
    // call the web service endpoint
    $.ajax({
        url: `${baseUrl}/users/` + user_id,
        // url: 'https://readdit-backend.herokuapp.comusers/'+ user_id,
        type: 'GET',
        //data: data2,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        headers: {
            "authorization": `Bearer ${token}`
        },
        success: function (data, textStatus, xhr) {
            $('#users').html("");
            // if (data != null && data.success) {
            //     //$('#msg').html('Record updated successfully!');
            // } else {
            //     console.log("Error");
            data = data.Result;
            console.log("data: " + data.profile_pic)
            var user = data;
            // compile the data that the card needs for it's creation

            document.getElementById("username").value = user.username;
            document.getElementById("email").value = user.email;
            document.getElementById("pfpImg").value = user.profile_pic;
            if (data.two_fa === "undefined" || data.two_fa == null || data.two_fa == 0) {
                document.getElementById("two_fa").checked = false;
            }
            else {
                document.getElementById("two_fa").checked = true;
            }

            try {
                if (user.profile_pic === "undefined" || user.profile_pic == null || user.profile_pic.trim().length == 0 || user.profile_pic == "NULL") {
                    $('#pfpImg').html('<img src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="profile image" id="pfp" class="pb-2"></img><br>')
                }
                else {
                    console.log("Pfp: " + user.profile_pic);
                    var pfpTempString = user.profile_pic.split("upload");
                    user.profile_pic = pfpTempString[0] + "upload" + "/ar_1.0,c_fill/r_max" + pfpTempString[1]
                    $('#pfpImg').html('<img src="' + user.profile_pic + '" alt="profile image" id="pfp" class="pb-2"></img><br>')
                }
            }
            catch (error) {
                $('#pfpImg').html('<img src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="profile image" id="pfp" class="pb-2"></img><br>')
                console.log(error)
            }

            $('#loadingText').html("");
            //     console.log(textStatus)
            //     console.log(xhr)

            // }
        },


        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            $('#loadingText').html("<h6 class='text-danger'>ERROR LOADING!</h6>");
            if (xhr.status == 403) {
                $('#msg').html('F̵̤̈ò̵̬r̶͙̃b̴͖͛i̶̲͒d̸̞̓d̵̮́e̷̬̐n̵̻̄');
            }
        }
    });
};

function editUser() {
    $(`#messages`).html("<p class='text-center text-primary pt-2'>Submitting...</p>");
    var email = $('#email').val();
    var oldpwd = $('#oldpwd').val();
    var newpwd = $('#newpwd').val();
    var username = $('#username').val();
    var pfpImg = $('#pfpImg').val();
    var two_fa = $('#two_fa').is(":checked");

    try {
        if (two_fa == true) {
            two_fa = 1;
        }
        else {
            two_fa = 0;
        }
    }
    catch (error) {
        console.log("Error in two_fa conversion. Error: " + error)
    }

    var { user_id } = JSON.parse(localStorage.getItem("userInfo"));
    var token = localStorage.getItem("token");
    let webFormData = new FormData();
    webFormData.append('email', email);
    webFormData.append('oldpwd', oldpwd);
    webFormData.append('newpwd', newpwd);
    webFormData.append('username', username);
    webFormData.append('profile_pic', pfpImg);
    webFormData.append('two_fa', two_fa);
    // HTML file input, chosen by user
    webFormData.append("image", document.getElementById('image').files[0]);
    console.log(...webFormData);
    //  call web service endpoint
    $.ajax({
        // url: 'https://readdit-backend.herokuapp.comusers/' + user_id,
        url: `${baseUrl}/users/` + user_id,
        method: 'PUT',
        data: webFormData,
        processData: false,
        contentType: false,
        cache: false,
        enctype: 'multipart/form-data',
        headers: { authorization: 'Bearer ' + token },
        success: function (data, textStatus, xhr) {
            console.log("Running ajax")
            if (data != null) {
                console.log(data)
                $(`#messages`).html("<p class='text-center text-success pt-2'>Changes Saved.</p>");
            } else {
                console.log("Error");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Xhr: " + xhr);
            console.log("textStatus: " + textStatus);
            console.log("errorThrown: " + errorThrown);
            console.log('Error in Operation');

            $(`#messages`).html("<p class='text-center text-danger pt-2'>Failed To Save Changes</p>");
        }
    });
    return false;
}

$(document).ready(function () {
    loadUserInfo();
    document.getElementById('two_fa').addEventListener('change', (e) => {
        this.checkboxValue = e.target.checked ? 'on' : 'off';
        console.log(this.checkboxValue)
    })
})

