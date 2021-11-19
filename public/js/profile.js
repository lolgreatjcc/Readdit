const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
// const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

function loadUserInfo(user_id, token) {
    // call the web service endpoint
    $.ajax({
        url: `${baseUrl[0]}/users/` + user_id,
        // url: 'https://readdit-backend.herokuapp.comusers/'+ user_id,
        type: 'GET',
        //data: data2,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        headers: {
            "authorization": `Bearer ${token}`
        },
        success: function (data, textStatus, xhr) {
            $('#users').html("");
            // if (data != null && data.success) {
            //     //$('#msg').html('Record updated successfully!');
            // } else {
            //     console.log("Error");
            data = data.Result;
            console.log("data: " + data.profile_pic)
            var user = data;
            // compile the data that the card needs for it's creation

            $(`#username`).append(`${user.username}`);


            // Calculates Cake Day
            var date = new Date(data.created_at);
            var day = date.getDay();

            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            var month = months[date.getMonth()];

            var year = date.getFullYear();
            var cake_day = (day + " " + month + " " + year);
            $("#cake_day").append(`${cake_day}`);


            try {
                if (user.profile_pic === "undefined" || user.profile_pic == null || user.profile_pic.trim().length == 0 || user.profile_pic == "NULL") {
                    $('#pfpImg').html('<img src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="profile image" id="pfp" class="pb-2"></img><br>')
                    $('#user_img').attr("src", "https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png");
                }
                else {
                    console.log("Pfp: " + user.profile_pic);
                    var pfpTempString = user.profile_pic.split("upload");
                    user.profile_pic = pfpTempString[0] + "upload" + "/ar_1.0,c_fill/r_max" + pfpTempString[1]
                    $('#pfpImg').html('<img src="' + user.profile_pic + '" alt="profile image" id="pfp" class="pb-2"></img><br>')
                    $('#user_img').attr("src", user.profile_pic);
                }
            }
            catch (error) {
                $('#pfpImg').html('<img src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="profile image" id="pfp" class="pb-2"></img><br>')
                $('#user_img').attr("src", "https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png");
            }
        },


        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            $('#loadingText').html("<h6 class='text-danger'>ERROR LOADING!</h6>");
            if (xhr.status == 403) {

                // this guys thinks he's cool
                $('#msg').html('F̵̤̈ò̵̬r̶͙̃b̴͖͛i̶̲͒d̸̞̓d̵̮́e̷̬̐n̵̻̄');
            }
        }
    });
};

// function loadPosts(user_id, token) {
//     var { user_id } = JSON.parse(localStorage.getItem("userInfo"))
//     var token = localStorage.getItem("token")
//     // call the web service endpoint
//     $.ajax({
//         //headers: { 'authorization': 'Bearer ' + tmpToken },
//         url: baseUrl[0] + '/post/user/' + user_id,
//         type: 'GET',
//         contentType: "application/json; charset=utf-8",
//         dataType: 'json',
//         success: function (data, textStatus, xhr) {
//             var appendString = "";
//             for (var i = 0; i < data.length; i++) {
//                 var post = data[i];
//                 appendString += `<tr>
//                                                 <th scope="row">${i + 1}</th>
//                                                 <td>${post.title}</td>
//                                                 <td>${post.Subreaddit.subreaddit_name}</td>
//                                                 <td>${post.created_at}</td>
//                                                 <td> <button type="submit" onclick="window.location.href='${baseUrl[1] + "/r/" + post.Subreaddit.subreaddit_name + "/" + post.post_id + "'"}" class="ViewCall" style="background-color:#6a5acd; color:white; border-width: 0px;">View Post</button> </td>
//                                             </tr>`;
//             }
//             $("#load").html("");
//             $("#table_data").append(appendString);

//         },
//         error: function (xhr, textStatus, errorThrown) {
//             console.log('Error in Operation');
//             console.log(xhr)
//             console.log(textStatus);
//             console.log(errorThrown);
//             console.log(xhr.status);
//             //if (xhr.status == 401) {
//             //    $('$msg').html('Unauthorised User');
//             //}
//         }
//     });
// };

function displayPosts() {
    var { user_id } = JSON.parse(localStorage.getItem("userInfo"));
    var token = localStorage.getItem("token");

    // call the web service endpoint
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        url: baseUrl[0] + '/post/user/' + user_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            $("#post_div").html("");

            for (var i = 0; i < data.length; i++) {
                var post = data[i];

                // Calculates Time
                var date = new Date(post.created_at);
                var date_now = new Date();

                var seconds_between_dates = Math.floor((date_now - date) / 1000);
                var minutes_between_dates = Math.floor((date_now - date) / (60 * 1000));
                var hours_between_dates = Math.floor((date_now - date) / (60 * 60 * 1000));
                var days_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 1000))
                var weeks_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 7 * 1000))

                var post_date_output;
                if (seconds_between_dates < 60) {
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


                $('#post_div').append(`
                <div class="post rounded mb-2" id="post_${post.post_id}_${post.Subreaddit.subreaddit_name}">
                    <div class="row g-0">
                        <div class="col-1 upvote-section py-2 justify-content-center">
                            <a class="text-center d-block py-1 bg-light" id="post1-upvote"><i
                                    class="fas fa-arrow-up text-dark"></i></a>
                            <p id="post#-val" class="text-center mb-0">${post.Post_Votes}</p>
                            <a class="text-center d-block py-1 bg-light" id="post1-downvote"><i
                                    class="fas fa-arrow-down text-dark"></i></a>
                        </div>
                        <div class="col-11 bg-white p-2">
                            <div class="d-flex flex-row align-items-baseline">
                                <h6 class="d-inline fw-bold clickable-link">r/${post.Subreaddit.subreaddit_name}</h6>
                                <p class="fw-light text-secondary mx-1">•</p>
                                <p class="d-inline text-secondary me-1">Posted by</p>
                                <p class="d-inline text-secondary clickable-link" id="post#_user"> u/${post.User.username}</p>
                                <p class="fw-light text-secondary mx-1">•</p>
                                <p class="text-secondary" id="post#_time">${post_date_output}</p>
                            </div>
                            <h5>${post.title}</h5>
                        </div>
                    </div>
                </div>
                `)
            }

            // postRedirection();
            $('.post').on('click', function (e) {
                var post = $(this);
                var post_id = post.attr('id').split('_')[1];
                var subreaddit = post.attr('id').split('_')[2];
                location.href = `r/${subreaddit}/${post_id}`;
            })

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
}

function displayComments() {
    var { user_id } = JSON.parse(localStorage.getItem("userInfo"));
    var token = localStorage.getItem("token");

    console.log("Displaying Comments");
    // call the web service endpoint
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        url: baseUrl[0] + '/comment/user/' + user_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {

            $("#post_div").html("");
            for (var i = 0; i < data.length; i++) {
                var comment = data[i];



                $('#post_div').append(`
                <div class="comment rounded mb-1">
                <div class="d-flex flex-row p-2">
                    <p class="text-secondary mb-0">u/<span class=" clickable-link">${comment.User.username}</span> commented on <span class="text-dark clickable-link">${comment.Post.title}</span<</p>
                    <p class="mb-0 fw-light text-secondary mx-1">•</p>
                    <p class="mb-0 d-inline text-secondary me-1">Posted by</p>
                    <p class="mb-0 d-inline text-secondary clickable-link" id="post#_user"> u/${comment.Post.User.username}</p>
                </div>
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-11">
                        <h5>"${comment.comment}"</h5>
                    </div>
                </div>
            </div>
                `)
            }


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
}

$(document).ready(function () {
    var { user_id } = JSON.parse(localStorage.getItem("userInfo"))
    var token = localStorage.getItem("token")
    loadUserInfo(user_id, token);
    displayPosts();
    responsiveDesign();
})

function displaySavedPosts() {

    // Temp user_id
    console.log("Displaying Comments");
    var user_id = 2;

    $.ajax({
        url: baseUrl[0] + "/save/posts?user_id=" + user_id,
        type: "GET",
        contentType: "application/json charset=utf-8",
        success: function (data, status, xhr) {
            $("#post_div").html("");
            console.log(data);
            for (var i = 0; i < data.length; i++) {


                var post_data = data[i].Post;

                console.log(post_data);
                var date = new Date(post_data.created_at);
                var date_now = new Date();
                var seconds_between_dates = Math.floor((date_now - date) / 1000);
                var minutes_between_dates = Math.floor((date_now - date) / (60 * 1000));
                var hours_between_dates = Math.floor((date_now - date) / (60 * 60 * 1000));
                var days_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 1000))
                var weeks_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 7 * 1000))

                var post_date_output;
                console.log(minutes_between_dates)
                if (seconds_between_dates < 60) {
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


                $('#post_div').append(`
                                <div class="post rounded mb-2" id="post_${post_data.post_id}">
                                    <div class="row g-0">
                                        <div class="col-1 upvote-section py-2 justify-content-center">
                                            <a class="text-center d-block py-1 post-upvote" id="post1-upvote"><i
                                        class="fas fa-arrow-up text-dark"></i></a>
                                <p id="post#-val" class="text-center mb-0">6920</p>
                                <a class="text-center d-block py-1 post-downvote" id="post1-downvote"><i
                                        class="fas fa-arrow-down text-dark"></i></a>
                            </div>
                            <div class="col-11 bg-white p-2">
                                <div class="d-flex flex-row align-items-baseline">
                                    <h6 class="d-inline fw-bold clickable-link">r/${post_data.Subreaddit.subreaddit_name}</h6>
                                    <p class="fw-light text-secondary mx-1">•</p>
                                    <p class="d-inline text-secondary me-1">Posted by</p>
                                    <p class="d-inline text-secondary clickable-link" id="post#_user"> u/${post_data.User.username}</p>
                                    <p class="fw-light text-secondary mx-1">•</p>
                                    <p class="text-secondary" id="post#_time">${post_date_output}</p>
                                </div>
                                <h5 class="mb-3">${post_data.content}</h5>
                                <div class="toolbar d-flex flex-row align-items-center mt-2">
                                    <div class="d-flex flex-row text-secondary me-4 p-1 rounded hoverable">
                                        <span class="material-icons md-24 ms-0 me-1">chat_bubble_outline</span>
                                        <p class="mb-0 fw-bold me-1" id="comment_total"></p>
                                        <p class="mb-0 fw-bold fs-6">Comments</p>
                                    </div>
                                    <div class="d-flex flex-row text-secondary me-4 p-1 rounded hoverable">
                                        <span class="material-icons md-24 ms-0 mx-1">share</span>
                                        <p class="mb-0 fw-bold fs-6">Share</p>
                                    </div>
                                    <div class="save d-flex flex-row text-secondary me-4 p-1 rounded hoverable" id="post_bookmark_${post_data.post_id}">
                                        <span class="material-icons ms-0">bookmark</span>
                                        <p class="mb-0 fw-bold fs-6">Unsave</p>
                                    </div>
                                    <div class="d-flex flex-row text-secondary me-4 p-1 rounded hoverable">
                                        <span class="material-icons md-24 mx-1 ms-0">outlined_flag</span>
                                        <p class="mb-0 fw-bold fs-6">Report</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                            `);
            }

            // This block of code enables the toolbars.
            $('.save').on('click', function (e) {
                e.stopPropagation();
                var id = $(this).attr('id');
                var post_id = id.split('_')[2];

                // Temporary user_id
                var user_id = 2;

                var data = {
                    user_id: user_id,
                    post_id: post_id
                }
                $.ajax({
                    url: baseUrl[0] + "/save/post",
                    type: "DELETE",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (data, status, xhr) {
                        displaySavedPosts()
                    },
                    error: function (xhr, status, error) {

                    }
                })
            })
        }
    },
    )


}

function responsiveDesign() {
    var saved_view = $('#saved_view');
    var comment_view = $('#comment_view');
    var post_view = $('#post_view');

    saved_view.on('click', function () {
        comment_view.removeClass('active');

        post_view.removeClass('active');
        saved_view.addClass('active');
        console.log("saved_view clicked");
    });
    comment_view.on('click', function () {
        saved_view.removeClass('active');
        post_view.removeClass('active');
        comment_view.addClass('active');
    });
    post_view.on('click', function () {
        saved_view.removeClass('active');
        comment_view.removeClass('active');
        post_view.addClass('active');
    });
}
