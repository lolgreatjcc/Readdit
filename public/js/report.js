const baseUrl = ["http://localhost:3000","http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

$(document).ready(function () {

    // Submits the post
    $('#report_post_submit').on('click', () => {
        $('#post_loading_div').removeClass('d-none');
        var report_description = $(`#report_description`).val();
        var queryParams = new URLSearchParams(window.location.search);
        console.log("---------Query Parameters---------");
        console.log("Query Param (source): " + window.location.search);
        console.log("Query Param (extracted): " + queryParams);

        var post_id = queryParams.get("post_id");

        var userData = localStorage.getItem('userInfo');
        // userData = userData.slice(1,-1);
        var userJsonData = JSON.parse(userData);
        var user_id = userJsonData.user_id;

        console.log("Report Description: " + report_description);
        console.log("Report on: " + post_id);
        console.log("Report by: " + user_id);

        if (report_description.trim() == "") {
            $('#post_loading_div').addClass('d-none');
            $(`#msg`).html(`<p class="text-danger m-3"> Description cannot be blank! </p>`);
        }
        else {
            const jsonWebData = {
                report_description: report_description,
                fk_post_id: post_id,
                fk_user_id: user_id
            }

            axios.post(baseUrl[0] + `/report/report`, jsonWebData)
                .then(response => {
                    $('#post_loading_div').addClass('d-none');
                    $('#msg').html('<p class="m-3"> Report submitted Successfully! </p>');
                })
                .catch(error => {
                    $('#post_loading_div').addClass('d-none');
                    $('#msg').html('<p class="text-danger m-3"> Error Submitting Report! </p>');
                })
        }
    })

    
})
