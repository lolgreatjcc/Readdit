const baseUrl = "http://localhost:3000";
//const baseUrl = "https://readdit-backend.herokuapp.com"

let notifier = new AWN({icons:{enabled:false}})

//auto fills input fields with user info
function loadUserInfo() {
    var { user_id } = JSON.parse(localStorage.getItem("userInfo"))
    var token = localStorage.getItem("token")
    // call the web service endpoint
    $.ajax({
        url: `${baseUrl}/users/` + user_id,
        type: 'GET',
        //data: data2,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        headers: {
            "authorization": `Bearer ${token}`
        },
        success: function (data, textStatus, xhr) {
            $('#users').html("");
            data = data.Result;

            //assign data
            var user = data;
            document.getElementById("username").value = user.username;
            document.getElementById("email").value = user.email;
            document.getElementById("pfpImg").value = user.profile_pic;
            if (data.two_fa === "undefined" || data.two_fa == null || data.two_fa == 0) {
                document.getElementById("two_fa").checked = false;
            }
            else {
                document.getElementById("two_fa").checked = true;
            }

            //place extracted profile picture
            try {
                if (user.profile_pic === "undefined" || user.profile_pic == null || user.profile_pic.trim().length == 0 || user.profile_pic == "NULL") {
                    $('#pfpImg').html('<img src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="profile image" id="pfp" class="pb-2"></img><br>')
                }
                else {
                    var pfpTempString = user.profile_pic.split("upload");
                    user.profile_pic = pfpTempString[0] + "upload" + "/ar_1.0,c_fill/r_max" + pfpTempString[1]
                    $('#pfpImg').html('<img src="' + user.profile_pic + '" alt="profile image" id="pfp" class="pb-2"></img><br>')
                }
            }
            catch (error) {
                $('#pfpImg').html('<img src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="profile image" id="pfp" class="pb-2"></img><br>')
            }
        },

        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            notifier.alert(xhr.responseJSON.message);
        }
    });
};

//functions to run edits on the user
function editUser() {
    notifier.info("Submitting Request...")
    var email = $('#email').val();
    var oldpwd = $('#oldpwd').val();
    var newpwd = $('#newpwd').val();
    var username = $('#username').val();
    var pfpImg = $('#pfpImg').val();
    var two_fa = $('#two_fa').is(":checked");

    //check and assign two_fa
    try {
        if (two_fa == true) {
            two_fa = 1;
        }
        else {
            two_fa = 0;
        }
    }
    catch (error) {
        notifier.alert("Error in two_fa conversion.")
    }

    //define webform data
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

    //ajax to edit users
    $.ajax({
        url: `${baseUrl}/users/` + user_id,
        method: 'PUT',
        data: webFormData,
        processData: false,
        contentType: false,
        cache: false,
        enctype: 'multipart/form-data',
        headers: { authorization: 'Bearer ' + token },
        success: function (data, textStatus, xhr) {
            if (data != null) {
                notifier.success("Changes saved.")
            } else {
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Xhr: " + xhr);
            console.log("textStatus: " + textStatus);
            console.log("errorThrown: " + errorThrown);
            console.log('Error in Operation');
            notifier.alert(xhr.responseJSON.message);
        }
    });
    return false;
}

$(document).ready(function () {
    loadUserInfo();
    //listener to check for checkbox's value
    document.getElementById('two_fa').addEventListener('change', (e) => {
        this.checkboxValue = e.target.checked ? 'on' : 'off';
        console.log(this.checkboxValue);
    })
})

