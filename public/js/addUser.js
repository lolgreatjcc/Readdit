//const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

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
  
    // axios.post(`https://readdit-backend.herokuapp.comusers`,requestBody)

    axios.post(`${baseUrl[0]}/users`, requestBody)
        .then(response => {
            notifier.success('User added successfully!');
        })
        .catch(error => {
            if (error.response.status == 422) {
                console.log(error.response.status);
            }
            notifier.alert(error.response.data.message);

        })
    }

$(document).ready(function () {
    $(`#login_redirect`).html(`<p class="smaller">
    Already have an account? <a class="text-decoration-none" href="${baseUrl[1]}/login.html">Log in</a>
</p>`);
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
            notifier.warning("Input fields cannot be blank!")
        }
        else {
            addUser(username, email, profile_pic, password,two_fa);
        }

    });

    $("#Return").click(function () {
        window.location.href = "/login.html";
        //window.location.assign("https://readdit-sp.herokuapp.comlogin.html");
    });
});  

