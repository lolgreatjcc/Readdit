//const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({ icons: { enabled: false } })

$(document).ready(() => {
    //check if user is logged in
    try {
        var userData = localStorage.getItem('userInfo');
        var token = localStorage.getItem("token")
        var userJsonData = JSON.parse(userData);
        var role = userJsonData.fk_user_type_id;
    } catch (error) {
        notifier.alert("You need to be logged in to access this page!");
        setTimeout(function() {
            window.location.assign(`${baseUrl[1]}/login.html`);
        }, 2000);
    }

    //if create community button is clicked
    $('#create_community_submit').on('click', () => {

        notifier.info("Processing Request...")
        // Disables input fields
        $('#create_community_submit').prop('disabled', true);
        $('#create_community_cancel').prop('disabled', true);
        $('#community_name').prop('disabled', true);
        $('#community_description').prop('disabled', true);

        //extract values
        var subreaddit_name = $('#community_name').val();
        var description = $('#community_description').val();

        //check if required inputs are blank
        if (subreaddit_name == "") {
            notifier.alert("Please fill in the subreaddit name.")
            $('#create_community_submit').prop('disabled', false);
            $('#create_community_cancel').prop('disabled', false);
            $('#community_name').prop('disabled', false);
            $('#community_description').prop('disabled', false);
        }
        else if (description == "") {
            notifier.alert("Please fill in a description.")
            $('#create_community_submit').prop('disabled', false);
            $('#create_community_cancel').prop('disabled', false);
            $('#community_name').prop('disabled', false);
            $('#community_description').prop('disabled', false);
        }
        else {

            var data = {
                subreaddit_name: subreaddit_name,
                description: description,
            }

            //ajax call to create subreaddit
            $.ajax({
                url: `${baseUrl[0]}/r/create`,
                method: 'POST',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data),
                headers: {
                    authorization: "Bearer " + token
                },
                success: function (data, status, xhr) {
                    notifier.success(data.Result);
                    setTimeout(function() {
                        window.location.assign(`${baseUrl[1]}/r/${subreaddit_name}`);
                    }, 2000);
                },
                error: function (xhr, status, err) {
                    $('#create_community_submit').prop('disabled', false);
                    $('#create_community_cancel').prop('disabled', false);
                    $('#community_name').prop('disabled', false);
                    $('#community_description').prop('disabled', false);
                    notifier.alert(xhr.responseJSON.message);
                }
            })
        }
    })
})
