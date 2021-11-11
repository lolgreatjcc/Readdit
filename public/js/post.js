//const baseUrl = ["http://localhost:3000","http://localhost:3001"]
const baseUrl = ["https://readdit-backend.herokuapp.com/","https://readdit-sp.herokuapp.com/"]
$(document).ready(function () {
    var pathname = window.location.pathname;
    var subreaddit_path = pathname.split('/')[2];
    var post_id = pathname.split('/')[3];
    var retrieved_post_id;
    $.ajax({
        method: 'GET',
        url: `${baseUrl[0]}/post/` + post_id,
        contentType: "application/json; charset=utf-8",
        success: function (post_data, status, xhr) {
            if (post_data.Subreaddit.subreaddit_name != subreaddit_path) {
                window.location.href = `/r/${post_data.Subreaddit.subreaddit_name}/${post_id}`;
            } else {
                console.log(post_data);
                $('#post_subreaddit').append(post_data.Subreaddit.subreaddit_name);
                $('#post_username').append(post_data.User.username);
                $('#post_title').append(post_data.title);
                $('#post_content').append(post_data.content);

                // Calculates Time
                var date = new Date(post_data.created_at);
                var date_now = new Date();
                var hours_between_dates = (date_now - date) / (60 * 60 * 1000);
                var days_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 1000))
                var weeks_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 7 * 1000))

                var post_date_output;
                if (hours_between_dates < 24) {
                    post_date_output = `${hours_between_dates} hours ago`
                } else if (days_between_dates <= 7) {
                    post_date_output = `${days_between_dates} days ago`
                } else {
                    post_date_output = `${weeks_between_dates} weeks ago`
                }
                $('#post_timeAgo').append(post_date_output);
                retrieved_post_id = post_data.post_id;

                // Retrieve Post Data
                $.ajax({
                    url: `${baseUrl[0]}/r/` + subreaddit_path,
                    method: 'GET',
                    contentType: "application/json; charset=utf-8",
                    success: function (data, status, xhr) {
                        data = JSON.parse(data);
                        $("#community_name").html(data.subreaddit_name);
                        $("#subreaddit_name").html(data.subreaddit_name);
                        $('#community_desc').html(data.subreaddit_description)
                        var date = new Date(data.created_at);
                        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                        $('#community_create_month').html(months[date.getMonth() - 1]);
                        $('#community_create_day').html(date.getDate());
                        $('#community_create_year').html(date.getFullYear());

                    },
                    error: function (xhr, status, error) {
                        // TBD
                    }
                })
            }
        }
    });


    // Retrieve Comment Data
    $.ajax({
        url: `${baseUrl[0]}/comment/` + post_id,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            data = data.Result;
            $('#comment_total').append(data.length);
            for (var i = 0; i < data.length; i++) {

                // Calculates Time
                var date = new Date(data[i].created_at);
                var date_now = new Date();
                var seconds_between_dates = Math.floor((date_now - date) / 1000);
                var minutes_between_dates = Math.floor((date_now - date) / (60 * 1000));
                var hours_between_dates = Math.floor((date_now - date) / (60 * 60 * 1000));
                var days_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 1000))
                var weeks_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 7 * 1000))

                var post_date_output;
                console.log(minutes_between_dates)
                if(seconds_between_dates < 60) {
                    post_date_output = `${seconds_between_dates} seconds ago`
                } else if (minutes_between_dates < 60) {
                    post_date_output = `${minutes_between_dates} minutes ago`
                }
                else if (hours_between_dates < 24) {
                    post_date_output = `${hours_between_dates} hours ago`
                } else if (days_between_dates <= 7) {
                    post_date_output = `${days_between_dates} days ago`
                } else {
                    post_date_output = `${weeks_between_dates} weeks ago`
                }


                $('#comment_div').append(`
                
                            <div class="comment row mb-4">
                                    <div class="col-1 d-flex flex-column">
                                        <p>/img/</p>
                                        <div class="comment-line flex-grow-1 w-50"></div>

                                    </div>
                                    <div class="col-10">
                                        <div class="d-flex flex-row">
                                            <p>${data[i].User.username}</p>
                                            <p class="fw-light text-secondary mx-1">•</p>
                                            <p class="text-secondary">${post_date_output}</p>
                                        </div>
                                        <p class="mb-2">${data[i].comment}</p>
                                        <div class="d-flex flex-row align-items-center">
                                            <a class="text-center d-block p-1 post-upvote">
                                                <i class="fas fa-arrow-up text-dark"></i>
                                            </a>
                                            <p class="mb-0 mx-3">###</p>
                                            <a class="text-center d-block p-1 post-downvote"><i
                                                    class="fas fa-arrow-down text-dark"></i></a>
                                        </div>

                                    </div>
                                </div>`
                )
            }
        }
    });

    // Parse Comments
    $('#comment_submit').on('click', function () {
        var comment_content = $('#comment_content').val();

        // Temoporary User_id
        var user_id = 2;

        var data = {
            post_id: retrieved_post_id,
            user_id: user_id,
            comment: comment_content
        }
        $.ajax({
            url: `${baseUrl[0]}/comment`,
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (data, status, xhr) {
                console.log(data);
                location.reload();
            },
            error: function (xhr, status, error) {
                console.log(xhr)
            }
        })
    })


})

function copy(){
    var copiedText = baseUrl[1] + window.location.pathname

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copiedText);

  /* Alert the copied text */
  alert("Copied the text: " + copiedText);
}