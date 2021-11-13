const baseUrl = "http://localhost:3000";
//const baseUrl = "https://readdit-backend.herokuapp.com/"

$(document).ready(function () {
    $("#Login").click(function () {
        // data extraction
        var email = $('#email').val();
        var pwd = $('#pwd').val();

        // data compilation
        var data = "{\"email\":\"" + email + "\", \"password\":\"" + pwd + "\"}";

        //  call web service endpoint
        $.ajax({
            //url: 'https://readdit-backend.herokuapp.com/api/login',
            url: `${baseUrl}/api/login`,
            type: 'POST',
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, xhr) {
                console.log("Running ajax")
                if (data != null) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userInfo', data.UserData);
                    // window.location.assign("https://readdit-sp.herokuapp.com/home.html");
                    window.location.href = `/home.html`;
                } else {
                    console.log("Error");
                    }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Xhr: " + xhr);
                console.log("textStatus: " + textStatus);
                console.log("errorThrown: " + errorThrown);
                console.log('Error in Operation');
                
                $(`#messages`).html("Login unsuccessful");
            }
        });
        return false;
    });
}); 
