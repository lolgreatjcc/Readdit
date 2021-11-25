//const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

function addUser(webFormData) {
    $.ajax({
        // url: 'https://readdit-backend.herokuapp.comusers/' + user_id,
        url: `${baseUrl[0]}/users`,
        method: 'POST',
        data: webFormData,
        processData: false,
        contentType: false,
        cache: false,
        enctype: 'multipart/form-data',
        success: function (data, textStatus, xhr) {
            console.log("Running ajax")
            if (data != null) {
                console.log(data)
                notifier.success("User created successfully.");
                setTimeout(window.location.assign(`${baseUrl[1]}/login.html`),2500);
            } else {
                console.log("Error");
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

    // axios.post(`${baseUrl[0]}/users`, requestBody)
    //     .then(response => {
    //         notifier.success('User added successfully!');
    //     })
    //     .catch(error => {
    //         if (error.response.status == 422) {
    //             console.log(error.response.status);
    //         }
    //         notifier.alert(error.response.data.message);

    //     })
}

$(document).ready(function () {
    $(`#login_redirect`).html(`<p class="smaller">
    Already have an account? <a class="text-decoration-none" href="${baseUrl[1]}/login.html">Log in</a>
    </p>`);
    $("#Add").click(function () {
        // data extraction
        notifier.info("Adding new user...")
        var emailRegex = new RegExp('^.+@.+\\..{2,}$');
        var username = $('#username').val();
        var email = $('#email').val();
        var profile_pic = $(`#img_url`).val();
        var password = $(`#password`).val();
        var two_fa = $('.2fa').val();
        if (two_fa == "1") {
            two_fa = 1;
        }
        else {
            two_fa = 0;
        }
        
        const webFormData = new FormData();
        webFormData.append('email', email);
        webFormData.append('password', password);
        webFormData.append('username', username);
        webFormData.append('two_fa', two_fa);
        webFormData.append('fk_user_type_id', 1);
        webFormData.append("image", document.getElementById('image').files[0]);
        //var tmpToken = localStorage.getItem('token');
        if (username.trim() == "" || email.trim() == "" || password.trim() == "") {
            notifier.warning("Input fields cannot be blank!")
        }
        else if (!(emailRegex.test(email))) {
            notifier.warning("Please enter a valid email!");
        }
        else {
            addUser(webFormData);
        }

    });

    $("#Return").click(function () {
        window.location.href = "/login.html";
        //window.location.assign("https://readdit-sp.herokuapp.comlogin.html");
    });
});  

