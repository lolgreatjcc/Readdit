const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

$(document).ready(function () {
    try {
        var userData = localStorage.getItem('userInfo');
        // userData = userData.slice(1,-1);

        var userJsonData = JSON.parse(userData);
        var role = userJsonData.fk_user_type_id;

        if (role != 2) {
            $(`#redirect_title`).html(`Unauthorized Access!`);
            $(`#redirect_text`).html(`Our system has detected an unauthorized access attempt from your account. 
                                    If you are a readdit admin, please check that you're logged into an admin account before trying again.`);
        }
        else {
            window.location.assign(`${baseUrl[1]}/admin/admin_home.html`);
        }
    } catch (error) {
        $(`#redirect_title`).html(`Unauthenticated User!`);
        $(`#redirect_text`).html(`Our system has detected that your access is unauthenticated. 
                                If you are a readdit admin, please log in before trying again.`);
    }

    $("#home").click(function () {
        window.location.assign(`${baseUrl[1]}/home.html`);
    });

    $("#login").click(function () {
        localStorage.clear();
        window.location.assign(`${baseUrl[1]}/login.html`);
    });
})
