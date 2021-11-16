//const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
const baseUrl = ["https://readdit-backend.herokuapp.com/","https://readdit-sp.herokuapp.com/"]

        $(document).ready(function () {
            try {
                var userData = localStorage.getItem('userInfo');
                var token = localStorage.getItem("token")
                // userData = userData.slice(1,-1);

                var userJsonData = JSON.parse(userData);
                var role = userJsonData.fk_user_type_id;

                var tmpToken = localStorage.getItem('token');

                if (role != 2) {
                    alert("Unauthorized User!");
                    window.location.assign(`${baseUrl[1]}/home.html`);
                }
            } catch (error) {
                alert("Unauthenticated User!");
                window.location.assign(`${baseUrl[1]}/login.html`);
            }

            $("#M-users").click(function () {
                window.location.assign(`${baseUrl[1]}/admin/ManageUsers.html`);
            });

            $("#M-sub").click(function () {
                window.location.assign(`${baseUrl[1]}/admin/ManageSubs.html`);
            });
        });

