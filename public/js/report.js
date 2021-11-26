//const baseUrl = ["http://localhost:3000","http://localhost:3001"]
const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

$(document).ready(function () {

    // Submits the post
    $('#report_post_submit').on('click', () => {
        $('#post_loading_div').removeClass('d-none');
        var report_description = $(`#report_description`).val();
        var queryParams = new URLSearchParams(window.location.search);
        var post_id = queryParams.get("post_id");

        var userData = localStorage.getItem('userInfo');
        // userData = userData.slice(1,-1);
        var userJsonData = JSON.parse(userData);
        var user_id = userJsonData.user_id;

        if (report_description.trim() == "") {
            $('#post_loading_div').addClass('d-none');
            notifier.warning(`Description cannot be blank!`);
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
                    notifier.success('Report submitted Successfully!');
                })
                .catch(error => {
                    $('#post_loading_div').addClass('d-none');
                    notifier.alert(error.response.data.message);
                })
        }
    })
})
