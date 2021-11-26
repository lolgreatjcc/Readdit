const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

function addUser(webFormData) {
    $.ajax({
        url: `${baseUrl[0]}/users`,
        method: 'POST',
        data: webFormData,
        processData: false,
        contentType: false,
        cache: false,
        enctype: 'multipart/form-data',
        success: function (data, textStatus, xhr) {
            if (data != null) {
                notifier.success("User created successfully.");
                setTimeout(function() {
                    window.location.assign(`${baseUrl[1]}/login.html`);
                }, 2000);
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
}

$(document).ready(function () {
    //inputs login button
    $(`#login_redirect`).html(`<p class="smaller">
    Already have an account? <a class="text-decoration-none" href="${baseUrl[1]}/login.html">Log in</a>
    </p>`);

    //if add button is clicked
    $("#Add").click(function () {
        // data extraction
        notifier.info("Adding new user...")
        var emailRegex = new RegExp('^.+@.+\\..{2,}$');
        var username = $('#username').val();
        var email = $('#email').val();
        var profile_pic = $(`#img_url`).val();
        var password = $(`#password`).val();
        var two_fa = $('.2fa').val();

        //checking and assigning two_fa value
        if (two_fa == "1") {
            two_fa = 1;
        }
        else {
            two_fa = 0;
        }
        
        //create webformdata
        const webFormData = new FormData();
        webFormData.append('email', email);
        webFormData.append('password', password);
        webFormData.append('username', username);
        webFormData.append('two_fa', two_fa);
        webFormData.append('fk_user_type_id', 1);
        webFormData.append("image", document.getElementById('image').files[0]);
        
        //check if required fields are blank
        if (username.trim() == "" || email.trim() == "" || password.trim() == "") {
            notifier.warning("Input fields cannot be blank!")
        }
        //check if email format is wrong
        else if (!(emailRegex.test(email))) {
            notifier.warning("Please enter a valid email!");
        }
        //call adduser function
        else {
            addUser(webFormData);
        }

    });

    //if return button is clicked
    $("#Return").click(function () {
        window.location.href = "/login.html";
    });
});  

