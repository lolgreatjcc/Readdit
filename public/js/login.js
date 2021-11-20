const baseUrl = "http://localhost:3000";
//const baseUrl = "https://readdit-backend.herokuapp.com"

let notifier = new AWN({icons:{enabled:false}})

$(document).ready(function () {
    $("#Login").click(function () {
        notifier.info("Logging you in...")
        // data extraction
        var email = $('#email').val();
        var pwd = $('#pwd').val();

        // data compilation
        var data = "{\"email\":\"" + email + "\", \"password\":\"" + pwd + "\"}";

        //  call web service endpoint
        $.ajax({
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
                    // window.location.assign("https://readdit-sp.herokuapp.comhome.html");
                    window.location.href = `/home.html`;
                } else {
                    notifier.alert("Unknown error occured!")
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Xhr: " + JSON.stringify(xhr));
                console.log("textStatus: " + textStatus);
                console.log("errorThrown: " + errorThrown);
                console.log('Error in Operation');
                notifier.alert(xhr.responseJSON.message)
            }
        });
        return false;
    });
}); 
