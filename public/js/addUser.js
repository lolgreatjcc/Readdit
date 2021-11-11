//const baseUrl = "http://localhost:3000";
const baseUrl = "https://readdit-backend.herokuapp.com/"

function addUser(username, email, profile_pic, password, two_fa) {
    var type = "Customer";
    console.log("Username: " + username);
    console.log("Email: " + email);
    console.log("URL: " + profile_pic);
    console.log("Password: " + password);
    console.log("Two FA: " + two_fa)
    const requestBody = {
        username: username,
        email: email,
        type: type,
        profile_pic: profile_pic,
        password: password,
        two_fa: two_fa,
        fk_user_type_id: 1
    };

    console.log(requestBody);
  
    // axios.post(`https://readdit-backend.herokuapp.com/users`,requestBody)

    axios.post(`${baseUrl}/users`, requestBody)
        .then(response => {
            $('#msg').html('User added successfully!');
        })
        .catch(error => {
            if (error.response.status == 422) {
                console.log(error.response.status);
                $('#msg').html('Account with this email already exists');
            }

        })
    }

$(document).ready(function () {

    $("#Add").click(function () {
        // data extraction
        var username = $('#username').val();
        var email = $('#email').val();

        var profile_pic = $(`#img_url`).val();
        profile_pic = profile_pic.replace("C:\\fakepath\\", "");

        var password = $(`#password`).val();
        var two_fa = $('.2fa').val();
        console.log("TWOFA: "  + two_fa);
        if (two_fa == "1") {
            two_fa = 1;
        }
        else {
            two_fa = 0;
        }

        //var tmpToken = localStorage.getItem('token');
        if (username.trim() == "" || email.trim() == "" || password.trim() == "") {
            $(`#msg`).html("Input fields cannot be blank!")
        }
        else {
            addUser(username, email, profile_pic, password,two_fa);
        }

    });

    $("#Return").click(function () {
        window.location.href = "/login.html";
        //window.location.assign("https://readdit-sp.herokuapp.com/login.html");
    });
});  