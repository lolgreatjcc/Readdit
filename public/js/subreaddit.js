//const baseUrl = "http://localhost:3000"
const baseUrl = "https://readdit-backend.herokuapp.com/"

$(document).ready(function () {
    var pathname = window.location.pathname;
    $.ajax({
        url: `${baseUrl}` + pathname,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {

            data = JSON.parse(data);
            $("#community_name").html(data.subreaddit_name);
            $("#subreaddit_name").html(data.subreaddit_name);
            checkOwner(data.subreaddit_name);
            $('#community_desc').html(data.subreaddit_description)
            var date = new Date(data.created_at);
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            $('#community_create_month').html(months[date.getMonth() - 1]);
            $('#community_create_day').html(date.getDate());
            $('#community_create_year').html(date.getFullYear());
        },
        error: function (xhr, status, error) {

        }
    })

    $.ajax({
        url: `${baseUrl}/post/get` + pathname,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {

                // Calculates Time
                var date = new Date(data[i].created_at);
                var date_now = new Date();
                var hours_between_dates = (date_now - date) / (60 * 60 * 1000);
                var days_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 1000 ))
                var weeks_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 7 * 1000))

                var post_date_output;
                if(hours_between_dates < 24) {
                    post_date_output = `${hours_between_dates} hours ago`
                }else if (days_between_dates <= 7) {
                    post_date_output = `${days_between_dates} days ago`
                }else {
                    post_date_output = `${weeks_between_dates} weeks ago`
                }
                

                $('#post_div').append(`
                
                <div class="post rounded mb-2">
                <div class="row g-0">
                <div class="col-1 upvote-section py-2 justify-content-center">
                    <a class="text-center d-block py-1 post-upvote" id="post_${data[i].post_id}_upvote"><i
                            class="fas fa-arrow-up text-dark"></i></a>
                    <p id="post#-val" class="text-center mb-0">####</p>
                    <a class="text-center d-block py-1 post-downvote" id="post_${data[i].post_id}_downvote"><i
                            class="fas fa-arrow-down text-dark"></i></a>
                </div>
                <div class="col-11 bg-white p-2">
                    
                    <div class="d-flex flex-row align-items-baseline">
                        <h6 class="d-inline fw-bold clickable-link">r/<a>${data[i].Subreaddit.subreaddit_name}</a></h6>
                        <p class="fw-light text-secondary mx-1">•</p>
                        <p class="d-inline text-secondary me-1">Posted by</p>
                        <p class="d-inline text-secondary clickable-link" id="post_${data[i].User.username}_user"> u/<a>${data[i].User.username}</a></p>
                        <p class="fw-light text-secondary mx-1">•</p>
                        <p class="text-secondary" id="post_${data[i].post_id}_time">${post_date_output}</p>
                    </div>

                    <a href="/r/${data[i].Subreaddit.subreaddit_name}/${data[i].post_id}">
                    <h5 id="post_${data[i].post_id}_content">${data[i].content}</h5>
                    </a>

                </div>
                </div>
                </div>
                
            `)
            }

        },
        error: function (xhr, status, error) {
            console.log(xhr);
        }
    })
})

function checkOwner(subreadditName){
    var token = localStorage.getItem("token");
    $.ajax({
        url: `${baseUrl}/r/checkOwner/` + subreadditName,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        headers: {authorization:"Bearer " + token},
        success: function (data, status, xhr) { 
            $("#moderator").html(`
            <div id="about_community_header" class="p-2 py-3 rounded-top">
                <h6 class="fw-bold text-white mb-0 ms-2">Moderators</h6>
            </div>
            <div class="p-2" >
                <a class="btn btn-dark body-borders rounded-pill invert-scheme fw-bold w-100" href="/moderator?subreaddit=${subreadditName}">Edit Moderators</a>
            </div>
            `)
        },
        error: function (xhr, status, error) {
            console.log("")
        }
    });
}