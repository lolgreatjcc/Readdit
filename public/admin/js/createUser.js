//const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

function addUser(username, email, password, two_fa, image) {
    const webFormData = new FormData();
    webFormData.append('email', email);
    webFormData.append('password', password);
    webFormData.append('username', username);
    webFormData.append('two_fa', two_fa);
    webFormData.append('fk_user_type_id', 1);

    // HTML file input, chosen by user
    webFormData.append("image", image);
    axios.post(`${baseUrl[0]}/users`, webFormData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            notifier.success("User added successfully!")
            setTimeout(function() {
                window.location.assign(`${baseUrl[1]}/admin/ManageUsers.html`);
            }, 2000);
        })
        .catch(error => {
            if (error.response.status == 422) {
                console.log(error.response.status);  
            }
            notifier.alert(error.response.data.message)
        })
}

$(document).ready(function () {
    try {
        var userData = localStorage.getItem('userInfo');
        var token = localStorage.getItem("token")
        // userData = userData.slice(1,-1);

        var userJsonData = JSON.parse(userData);

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

    $("#Add").click(function () {
        notifier.info("Proccessing Request...")
        // data extraction
        var emailRegex = new RegExp('^.+@.+\\..{2,}$');
        var username = $('#username').val();
        var email = $('#email').val();

        var password = $(`#password`).val();
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

        var image = document.getElementById('img_url').files[0];

        //var tmpToken = localStorage.getItem('token');
        if (username.trim() == "" || email.trim() == "" || password.trim() == "") {
            notifier.warning("Input fields cannot be blank!")
        }
        else if (!(emailRegex.test(email))) {
            notifier.warning("Please enter a valid email!");
        }
        else {
            addUser(username, email, password, two_fa, image);
        }

    });

    $("#Return").click(function () {
        window.location.assign(`${baseUrl[1]}/admin/ManageUsers.html`);
        //window.location.assign("https://readdit-sp.herokuapp.comadmin/ManageUsers.html");
    });
});
