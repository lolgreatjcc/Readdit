const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]
$(document).ready(function () {
    var pathname = window.location.pathname;
    var subreaddit_path = pathname.split('/')[2];
    var post_id = pathname.split('/')[3];
    var retrieved_post_id;
    $.ajax({
        method: 'GET',
        url: `${baseUrl[0]}/post/` + post_id,
        contentType: "application/json; charset=utf-8",
        success: async function (post_data, status, xhr) {

            if (post_data.Subreaddit.subreaddit_name != decodeURI(subreaddit_path)) {
                window.location.href = `/r/${post_data.Subreaddit.subreaddit_name}/${post_id}`;

            } else {
                console.log(post_data);
                $('#post_subreaddit').append(post_data.Subreaddit.subreaddit_name);
                $('#post_username').append(post_data.User.username);
                $('#post_title').append(post_data.title);
                $('#post_content').append(post_data.content);
                $('#post_rating').attr("id", `post_${post_data.post_id}_popularity`).html(post_data.Post_Votes)

                $('#post_upvote').attr("id", `post_${post_data.post_id}_upvote`);
                $('#post_downvote').attr("id", `post_${post_data.post_id}_downvote`);
                $('#post_bookmark').attr("id", `post_bookmark_${post_data.post_id}`);

                //checks if pinned
                if (post_data.pinned == 1) {
                    $(`#post_info`).append(`
                    <p class="fw-light text-secondary mx-1">•</p>
                    <p class="text-secondary">Pinned By Moderators</p>
                    `)
                }
                if (post_data.Flair != null) {
                    console.log("working");
                    $("#flair_section").append(`<div class="btn rounded-pill py-0 px-2" style="background-color:${post_data.Flair.flair_colour}"><span class="fw-bold text-white">${post_data.Flair.flair_name}</sp></div>`)
                }

                var user_id = await getUserId();
                //checks if moderator or owner
                var moderator = await checkModerator(post_data.Subreaddit.subreaddit_name);
                var owner = await checkOwner(post_data.Subreaddit.subreaddit_name);
                var report_delete = "";
                if (owner || moderator) {
                    $(`.post`).append(`
                    <div class="pin" id="${post_data.post_id}_${post_data.Subreaddit.subreaddit_id}">
                        <span class="material-icons md-24 ms-0 mx-1">push_pin</span>
                    </div>  
                    `)
                    report_delete = `
                    <button style="border-width : 0px; background-color:white;" type="button" class="delete" id="delete_${post_data.post_id}_${post_data.Subreaddit.subreaddit_id}">
                        <div class="d-flex flex-row text-secondary me-4">
                            <span class="material-icons md-24 mx-1">outlined_flag</span>
                            <p class="mb-0 fw-bold fs-6">Delete</p>
                        </div>
                    </button>`
                }
                else {
                    report_delete = `
                    <button style="border-width : 0px; background-color:white;" type="button" onclick="report(${post_data.post_id})" id="report">
                        <div class="d-flex flex-row text-secondary me-4">
                            <span class="material-icons md-24 mx-1">outlined_flag</span>
                            <p class="mb-0 fw-bold fs-6">Report</p>
                        </div>
                    </button>`
                }

                $(".toolbar").append(report_delete)



                // Handles clicking on pin button
                $('.pin').on('click', function (e) {
                    e.stopPropagation();
                    var pin_id = $(this).attr('id');
                    pin(pin_id);
                })

                $('.delete').on('click', function (e) {
                    e.stopPropagation();
                    var delete_id = $(this).attr('id');
                    deletePost(delete_id);
                })

                // Calculates Time
                var date = new Date(post_data.created_at);
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
                $('#post_timeAgo').append(post_date_output);
                retrieved_post_id = post_data.post_id;

                // Retrieve Subreaddit Data
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
                if (user_id) {
                    var vote_data = getUsersVotes(subreaddit_path, user_id, post_data.post_id);
                    handleVoting(user_id);
                    var saved_posts = getSavedPosts(user_id, post_data.post_id, () => {
                        $('#post_loading_div').addClass('d-none');
                    });
                    // Handles saving of posts
                    $('.save').on('click', function (e) {
                        e.stopPropagation();
                        var save_button = $(this);
                        var post_id = $(this).attr('id').split('_')[2];
                        if (user_id == false) {
                            window.location.href = "/login.html"
                        }

                        if (save_button.hasClass('saved')) {
                            save_button.removeClass('saved');
                            save_button.empty();
                            save_button.append(`
                                        <span class="material-icons md-24 ms-0">bookmark_border</span>
                                        <p class="mb-0 fw-bold fs-6">Save</p>
                                    `);



                            $.ajax({
                                url: `${baseUrl[0]}/save/post`,
                                type: "DELETE",
                                data: JSON.stringify({
                                    post_id: post_id,
                                    user_id: user_id
                                }),
                                contentType: "application/json",
                                success: function (data, status, xhr) {
                                    console.log(data);
                                    // do modal
                                },
                                error: function (xhr, status, error) {
                                    console.log(xhr)
                                }
                            })

                        } else {
                            save_button.addClass('saved');
                            save_button.empty();
                            save_button.append(`
                                        <span class="material-icons md-24 ms-0">bookmark</span>
                                        <p class="mb-0 fw-bold fs-6">Unsave</p>
                                    `);
                            $.ajax({

                                url: `${baseUrl[0]}/save/post`,
                                method: 'POST',
                                data: JSON.stringify({
                                    post_id: post_id,
                                    user_id: user_id
                                }),
                                contentType: "application/json",
                                success: function (data, status, xhr) {
                                    console.log(data)
                                    // do modal
                                },
                                error: function (xhr, status, error) {
                                    console.log(xhr);
                                }
                            })
                        }

                    })
                }
                else {
                    $('#post_loading_div').addClass('d-none');
                }

            }
        }
    });

    // Displays flair is post has an associated flair.


    //retrives media for post
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        url: `${baseUrl[0]}/media/media/` + post_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var media = data.Result;
            console.log(media.length);

            if (media.length > 1) {
                console.log("Running carousel");
                var appendStringStart = `
                    <div class="col-1">
                        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </div>
                    <div id="carouselExampleIndicators" class="carousel slide inheritMaxWidth col-10" data-ride="carousel" data-interval="false">
                            <ol class="carousel-indicators">`
                for (var j = 0; j < media.length; j++) {
                    if (j == 0) {
                        appendStringStart += `<li data-target="#carouselExampleIndicators" data-slide-to="${j}" style="color: #00ff00"></li>`;
                    }
                    else {
                        appendStringStart += `<li data-target="#carouselExampleIndicators" data-slide-to="${j}" class="active"></li>`;
                    }
                }
                appendStringStart += `</ol> <div class="carousel-inner inheritMaxWidth">`;

                var appendStringEnd = `
                    </div>
                    </div>
                    <div class="col-1">
                          <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                          <span class="sr-only">Next</span>
                          </a>
                      </div>`;

                //run multiple file display
                for (var count = 0; count < media.length; count++) {
                    if (count == 0) {
                        var item = 'carousel-item active';
                    }
                    else {
                        var item = 'carousel-item';
                    }
                    if (media[count].fk_content_type == "1") {
                        appendStringStart += `<div class="${item} mediaDiv">
                                    <img class="image";" src="${media[count].media_url}" alt="Image not available"> 
                                </div>`;
                    }
                    else if (media[count].fk_content_type == "2") {
                        appendStringStart += `<div class="${item} mediaDiv"> <video class="video" controls autoplay muted loop>
                                                <source src="${media[count].media_url}" type="video/mp4">
                                                Your browser does not support the video tag.
                                        </video> </div>`;
                    }
                    else {
                        appendStringStart += `<div class="${item}">
                                    <img style="height: 400px; max-width: 600px; object-fit: cover;" src="${media[count].media_url}" alt="GIF not available"> 
                                </div>`;
                    }
                }

                appendString = appendStringStart + appendStringEnd;
                $(`#post_media`).html(appendString);

            }
            else if (media.length == 0) {
                console.log("Running no media");
                appendString = ``;
                $(`#post_media`).remove();
            }
            else {
                console.log("Running single item");
                //run single file display
                if (media[0].fk_content_type == "1") {
                    $(`#post_media`).html(`<img class="image" src="${media[0].media_url}" alt="Image not available"> `)
                }
                else if (media[0].fk_content_type == "2") {
                    $(`#post_media`).html(`<video class="video" controls autoplay muted loop>
                                                <source src="${media[0].media_url}" type="video/mp4">
                                                Your browser does not support the video tag.
                                        </video>`)
                }
                else {
                    $(`#post_media`).html(`<img style="max-height: 500px; max-width: 700px; object-fit: cover;" src="${media[0].media_url}" alt="GIF not available"> `)
                }
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


    // Retrieve Comment Data
    $.ajax({
        url: `${baseUrl[0]}/comment/` + post_id,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            data = data.Result;
            $('#comment_total').append(data.length);
            var username = JSON.parse(localStorage.getItem('userInfo')).username;
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

                //formatting profile picture
                var pfpTempString = data[i].User.profile_pic.split("upload");
                data[i].User.profile_pic = pfpTempString[0] + "upload" + "/ar_1.0,c_fill/r_max" + pfpTempString[1]


                $('#comment_div').append(`
                
                            <div class="comment row mb-4 p-3 rounded">
                                    <div class="col-1 d-flex flex-column">
                                    <img src="${data[i].User.profile_pic}" alt="profile image" id="pfp" class="pb-2"></img>
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

            $(`#comment_as`).append(`<p class="mb-0">Comment as u/<span class="text-secondary">${username}</span></p>`)
        }
    });

    // Parse Comments
    $('#comment_submit').on('click', function () {
        var comment_content = $('#comment_content').val();

        // User_id
        var token = localStorage.getItem('token');

        var data = {
            post_id: retrieved_post_id,
            comment: comment_content
        }
        $.ajax({
            url: `${baseUrl[0]}/comment`,
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            headers: { authorization: "Bearer " + token },
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

function copy() {
    var copiedText = baseUrl[1] + window.location.pathname

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copiedText);

    /* Alert the copied text */
    alert("Copied the text: " + copiedText);
}

function report() {
    var pathname = window.location.pathname;
    var post_id = pathname.split('/')[3];
    console.log("REPORT POST: " + post_id);

    window.location.assign(baseUrl[1] + '/report.html?post_id=' + post_id);
}

function checkOwner(subreadditName) {
    return new Promise(function (resolve, reject) {
        var token = localStorage.getItem("token");
        $.ajax({
            url: `${baseUrl[0]}/r/checkOwner/` + subreadditName,
            method: 'GET',
            contentType: "application/json; charset=utf-8",
            headers: { authorization: "Bearer " + token },
            success: function (data, status, xhr) {
                resolve(true);
            },
            error: function (xhr, status, error) {
                resolve(false);
            }
        });
    })
}

function checkModerator(subreadditName) {
    return new Promise(function (resolve, reject) {
        var token = localStorage.getItem("token");
        $.ajax({
            url: `${baseUrl[0]}/moderator/checkModerator/` + subreadditName,
            method: 'GET',
            contentType: "application/json; charset=utf-8",
            headers: { authorization: "Bearer " + token },
            success: function (data, status, xhr) {
                resolve(true);
            },
            error: function (xhr, status, error) {
                resolve(false);
            }
        });
    })
}

function pin(post_subreaddit_id) {
    var post_subreaddit_id_arr = post_subreaddit_id.split('_');
    var post_id = post_subreaddit_id_arr[0]
    var fk_subreaddit_id = post_subreaddit_id_arr[1]
    var data = JSON.stringify({ post_id: post_id, fk_subreaddit_id: fk_subreaddit_id });
    var token = localStorage.getItem("token");
    $.ajax({
        url: `${baseUrl[0]}/post/pin`,
        method: 'PUT',
        contentType: "application/json; charset=utf-8",
        headers: { 'authorization': "Bearer " + token },
        data: data,
        success: function (data, status, xhr) {
            window.location.reload();
        },
        error: function (xhr, status, error) {
            alert("Error updating pins")
        }
    })
}

function deletePost(post_subreaddit_id) {
    var post_subreaddit_id_arr = post_subreaddit_id.split('_');
    var post_id = post_subreaddit_id_arr[1]
    var fk_subreaddit_id = post_subreaddit_id_arr[2]
    var data = JSON.stringify({ post_id: post_id, fk_subreaddit_id: fk_subreaddit_id });
    var token = localStorage.getItem("token");
    $.ajax({
        url: `${baseUrl[0]}/post`,
        method: 'DELETE',
        contentType: "application/json; charset=utf-8",
        headers: { 'authorization': "Bearer " + token },
        data: data,
        success: function (data, status, xhr) {
            var pathname = window.location.pathname;
            var subreaddit_name = pathname.split('/')[2];
            window.location.href = `/r/${subreaddit_name}`;
        },
        error: function (xhr, status, error) {
            alert("Error deleting post")
        }
    });
}


function handleVoting(user_id) {
    // Handles upvoting/downvoting a post
    $('.post-upvote').on('click', function (e) {
        console.log("clicked upvote")
        e.stopPropagation();
        if (user_id == false) {
            window.location.href = "/login.html"
        }
        else {
            console.log("user_id: ", user_id);
            var post_id = $(this).attr('id').split('_')[1];
            var upvote_button = $(this);
            var downvote_button = $(`#post_${post_id}_downvote`);

            var popularity = $(`#post_${post_id}_popularity`);
            var rating = popularity.text();

            var data;
            if (upvote_button.hasClass('upvoted')) {
                // Remove Upvote
                data = {
                    post_id: post_id,
                    user_id: user_id,
                }

                popularity.text(parseInt(rating) - 1);
                upvote_button.removeClass('upvoted');
                $.ajax({
                    method: "DELETE",
                    url: `${baseUrl[0]}/vote/post_rating`,
                    data: JSON.stringify({ data }),
                    contentType: "application/json",
                    success: function (data, status, xhr) {
                        console.log(data);
                    }
                })
            }
            else {
                rating = parseInt(rating) + 1;
                if (downvote_button.hasClass('downvoted')) {
                    rating = parseInt(rating) + 1;
                    downvote_button.removeClass('downvoted');
                }
                popularity.text(rating);

                upvote_button.addClass('upvoted');
                // Update change in vote OR Create Vote
                $.ajax({
                    method: "POST",
                    url: `${baseUrl[0]}/vote/post_rating`,
                    data: JSON.stringify({
                        post_id: post_id,
                        user_id: user_id,
                        vote_type: 1,
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (data, status, xhr) {
                        console.log(data);
                    }
                })
            }
        }


    })

    // Handles upvoting/downvoting a post
    $('.post-downvote').on('click', function (e) {
        e.stopPropagation();

        if (user_id == false) {
            window.location.href = "/login.html"
        }
        else {
            var post_id = $(this).attr('id').split('_')[1];
            var downvote_button = $(this);
            var upvote_button = $(`#post_${post_id}_upvote`);

            var popularity = $(`#post_${post_id}_popularity`);
            var rating = popularity.text();

            var data;
            if (downvote_button.hasClass('downvoted')) {
                popularity.text(parseInt(rating) + 1);
                downvote_button.removeClass('downvoted');
                // Remove Upvote

                data = {
                    post_id: post_id,
                    user_id: user_id
                }


                $.ajax({
                    method: "DELETE",
                    url: `${baseUrl[0]}/vote/post_rating`,
                    data: JSON.stringify({ data }),
                    contentType: "application/json",
                    success: function (data, status, xhr) {
                        console.log(data);
                    }
                })
            }
            else {
                rating = parseInt(rating) - 1;
                if (upvote_button.hasClass('upvoted')) {
                    rating = parseInt(rating) - 1;
                    upvote_button.removeClass('upvoted');
                }
                popularity.text(rating);

                downvote_button.addClass('downvoted');
                // Update change in vote OR Create Vote
                $.ajax({
                    method: "POST",
                    url: `${baseUrl[0]}/vote/post_rating`,
                    data: JSON.stringify({
                        post_id: post_id,
                        user_id: user_id,
                        vote_type: 0,
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data, status, xhr) {
                        console.log(data);
                    }
                })
            }
        }
    })
}

function getUserId() {
    return new Promise(function (resolve, reject) {
        var token = localStorage.getItem("token");
        $.ajax({
            url: `${baseUrl[0]}/getUserId`,
            method: 'GET',
            contentType: "application/json; charset=utf-8",
            headers: { 'authorization': "Bearer " + token },
            success: function (data, status, xhr) {
                resolve(data.user_id)
            },
            error: function (xhr, status, error) {
                resolve(false);
            }
        });
    })
}

function getUsersVotes(subreaddit_id, user_id, post_id) {
    var results;
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        method: 'GET',
        url: `${baseUrl[0]}/vote/subreaddit?subreaddit_id=${subreaddit_id}&user_id=${user_id}`,
        async: false,
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            for (var x = 0; x < data.length; x++) {
                if (data[x].fk_post_id == post_id) {


                    vote_type = data[x].vote_type;
                    if (vote_type == true) {
                        var upvote_button = $(`#post_${post_id}_upvote`);
                        upvote_button.addClass('upvoted');
                    }
                    else {
                        var downvote_button = $(`#post_${post_id}_downvote`);
                        downvote_button.addClass('downvoted');
                    }
                }
            }
        }
    })
    return results;
}


function handleSaving() {
    // Handle Saving of Posts
    $('.save').on('click', function (e) {
        e.stopPropagation();
        var save_button = $(this);
        var post_id = $(this).attr('id').split('_')[2];
        if (user_id == false) {
            window.location.href = "/login.html"
        }

        if (save_button.hasClass('saved')) {
            save_button.removeClass('saved');
            save_button.empty();
            save_button.append(`
                        <span class="material-icons md-24 ms-0">bookmark_border</span>
                        <p class="mb-0 fw-bold fs-6">Save</p>
                    `);



            $.ajax({
                url: `${baseUrl[0]}/save/post`,
                type: "DELETE",
                data: JSON.stringify({
                    post_id: post_id,
                    user_id: user_id
                }),
                contentType: "application/json",
                success: function (data, status, xhr) {
                    console.log(data);
                    // do modal
                },
                error: function (xhr, status, error) {
                    console.log(xhr)
                }
            })

        } else {
            save_button.addClass('saved');
            save_button.empty();
            save_button.append(`
                        <span class="material-icons md-24 ms-0">bookmark</span>
                        <p class="mb-0 fw-bold fs-6">Unsave</p>
                    `);
            $.ajax({

                url: `${baseUrl[0]}/save/post`,
                method: 'POST',
                data: JSON.stringify({
                    post_id: post_id,
                    user_id: user_id
                }),
                contentType: "application/json",
                success: function (data, status, xhr) {
                    console.log(data)
                    // do modal
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                }
            })
        }
    })
}

function getSavedPosts(user_id, current_post_id, callback) {
    var output;
    $.ajax({
        url: baseUrl[0] + "/save/posts?user_id=" + user_id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (saved_posts_data, status, xhr) {
            for (var x = 0; x < saved_posts_data.length; x++) {
                var post_id = saved_posts_data[x].fk_post_id;
                if (current_post_id == post_id) {
                    var saved_bookmark = $(`#post_bookmark_${post_id}`)
                    saved_bookmark.addClass('saved');
                    saved_bookmark.empty();
                    saved_bookmark.append(`
                    <span class="material-icons md-24 ms-0">bookmark</span>
                    <p class="mb-0 fw-bold fs-6">Unsave</p>
                `);
                    break;
                }
            }
            callback();
        },
        error: function (xhr, status, error) {
            alert("Error getting saved posts. Try refreshing the page.")
        }
    })
    return output;

}