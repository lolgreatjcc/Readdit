//const baseUrl = "http://localhost:3000";
const baseUrl = "https://readdit-backend.herokuapp.com"

$(document).ready(function () {
    var userData = localStorage.getItem('userInfo');
    var token = localStorage.getItem("token")
    // userData = userData.slice(1,-1);
    
    var userJsonData = JSON.parse(userData);
    var userid = userJsonData.user_id;
    
    var tmpToken = localStorage.getItem('token');
    
    $.ajax({
        headers: { 'authorization': 'Bearer ' + tmpToken },
        // url: 'https://readdit-backend.herokuapp.comusers/' + userid,
        url: `${baseUrl}/users/` + userid,
        type: 'GET',
        //contentType: "application/json; charset=utf-8",
        dataType: 'json',
        headers: {"authorization" : `Bearer ${token}`        },
        success: function (data, textStatus, xhr) {

        $(`#msg`).append(`<h1> Welcome to readdit, ${data.Result.username}! </h1>`);

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr)
            console.log(textStatus);
            console.log(errorThrown);
            console.log(xhr.status);
            //if (xhr.status == 401) {
            //    $('$msg').html('Unauthorised User');
            //}
        }
    });
});