const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

$(document).ready(function () {
    var userData = localStorage.getItem('userInfo');
    var token = localStorage.getItem("token")

    //if user is logged in
    if (userJsonData) {
        var userJsonData = JSON.parse(userData);
        var userid = userJsonData.user_id;
    }

    notifier.info("Loading posts...")
    //gets all posts by recent
    $.ajax({
        url: `${baseUrl[0]}/post/recent`,
        method: "GET",
        // contentType: "application/json; charset=utf-8",
        success: async function (data, status, xhr) {
            var user_id = await getUserId();

            var sorted_data = data;
            for (var i = 0; i < sorted_data.length; i++) {

                if (i == sorted_data.length - 1) {
                    break;
                }

                if (sorted_data[i].Post_Votes < sorted_data[i + 1].Post_Votes) {
                    var tmp = sorted_data[i];
                    sorted_data[i] = sorted_data[i + 1];
                    sorted_data[i + 1] = tmp;

                    i = -1;
                }



            }


            data = sorted_data;

            for (var i = 0; i < data.length; i++) {
                var copyStr = data[i].Subreaddit.subreaddit_name + "/" + data[i].post_id;
                // Calculates Time
                var date = new Date(data[i].created_at);
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

                var flair_html = "";
                // Displays Post Flair
                if (data[i].Flair) {
                    flair_html = `<div class="ms-2 btn rounded-pill py-0 px-2" style="background-color:${data[i].Flair.flair_colour}"><span class="fw-bold text-white">${data[i].Flair.flair_name}</sp></div>`
                }

                var append_str = "";
                append_str = `<div class="post rounded mb-2" id="post_${data[i].post_id}">
                <div class="row g-0">
                <div class="col-1 upvote-section py-2 justify-content-center">
                    <a class="text-center d-block py-1 post-upvote" id="post_${data[i].post_id}_upvote"><i
                            class="fas fa-arrow-up text-dark"></i></a>
                    <p id="post_${data[i].post_id}_popularity" class="text-center mb-0">${data[i].Post_Votes}</p>
                    <a class="text-center d-block py-1 post-downvote" id="post_${data[i].post_id}_downvote"><i
                            class="fas fa-arrow-down text-dark"></i></a>
                </div>
                <div class="col-11 bg-white p-2 position-relative">
                    
                    <div class="d-flex flex-row align-items-baseline">
                        <h6 class="d-inline fw-bold clickable-link">r/<a href="/r/${data[i].Subreaddit.subreaddit_name}" class="text-dark text-decoration-none">${data[i].Subreaddit.subreaddit_name}</a></h6>
                        <p class="fw-light text-secondary mx-1">•</p>
                        <p class="d-inline text-secondary me-1">Posted by</p>
                        <p class="d-inline text-secondary clickable-link" id="post_${data[i].User.username}_user"> u/<a>${data[i].User.username}</a></p>
                        <p class="fw-light text-secondary mx-1">•</p>
                        <p class="text-secondary" id="post_${data[i].post_id}_time">${post_date_output}</p>
                    </div>
                        <a style="text-decoration:none" href="/r/${data[i].Subreaddit.subreaddit_name}/${data[i].post_id}" class="d-flex flex-row">
                        <h5 style="color : black;" id="post_${data[i].post_id}_content" class="mb-0">${data[i].title}</h5>
                        <div class="d-flex flex-row">
                        ${flair_html}
                        </div>
                        </a>
                        <p class="mt-2">${data[i].content}<p>
                        <div id="post_media_${data[i].post_id}" class="d-flex flex-row justify-content-center mediaDiv"> ${addImage(data[i].post_id)} </div>
                        <div class="toolbar d-flex flex-row align-items-center mt-2">
                                <div class="d-flex flex-row text-secondary me-4 p-1 rounded hoverable">
                                    <span class="material-icons md-24 ms-0 me-1">chat_bubble_outline</span>
                                    <p class="mb-0 fw-bold me-1" id="comment_total"></p>
                                    <p class="mb-0 fw-bold fs-6">Comments</p>
                                </div>
                                <div class="d-flex flex-row text-secondary me-4 p-1 rounded hoverable share" id="${copyStr}">
                                    <span class="material-icons md-24 ms-0 mx-1">share</span>
                                    <p class="mb-0 fw-bold fs-6">Share</p>
                                </div>
                                <div class="save d-flex flex-row text-secondary me-4 p-1 rounded hoverable" id="post_bookmark_${data[i].post_id}">
                                    <span class="material-icons ms-0">bookmark_border</span>
                                    <p class="mb-0 fw-bold fs-6">Save</p>
                                </div>
                        </div>

                    </div>
                    
                    </div>
                    </div>`


                $('#post_div').append(append_str)
            }

            // Block of code shows user's upvotes and downvotes on posts
            // and also showing saved posts properly
            if (user_id) {
                var saved_posts = getSavedPosts(user_id);
                var data = getUsersVotes(user_id);
                for (var i = 0; i < data.length; i++) {
                    var upvote_button = $(`#post_${data[i].fk_post_id}_upvote`);
                    var downvote_button = $(`#post_${data[i].fk_post_id}_downvote`);
                    if (data[i].vote_type == true) {
                        upvote_button.addClass('upvoted');
                    } else {
                        downvote_button.addClass('downvoted');
                    }
                }

            }


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
                        headers: {'authorization': "Bearer " + token},
                        success: function (data, status, xhr) {
                            // do modal
                        },
                        error: function (xhr, status, error) {
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
                        headers: {'authorization': "Bearer " + token},
                        success: function (data, status, xhr) {
                        },
                        error: function (xhr, status, error) {
                        }
                    })
                }
            })

            // Handles clicking on share button
            $('.share').on('click', function (e) {
                e.stopPropagation();
                var share_id = $(this).attr('id');
                var copiedText = baseUrl[1] + "/r/" + share_id;
                navigator.clipboard.writeText(copiedText);
                notifier.info("Link copied to clipboard!");
            })

            // Handles upvoting/downvoting a post
            $('.post-upvote').on('click', function (e) {
                e.stopPropagation();

                if (user_id == false) {
                    window.location.href = "/login.html"
                }
                else {
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
                            headers:{'authorization': "Bearer " + token},
                            success: function (data, status, xhr) {
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
                            headers:{'authorization': "Bearer " + token},
                            success: function (data, status, xhr) {
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
                            user_id: user_id,
                        }


                        $.ajax({
                            method: "DELETE",
                            headers:{'authorization': "Bearer " + token},
                            url: `${baseUrl[0]}/vote/post_rating`,
                            data: JSON.stringify({ data }),
                            contentType: "application/json",
                            success: function (data, status, xhr) {
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
                            headers: {'authorization': "Bearer " + token},
                            data: JSON.stringify({
                                post_id: post_id,
                                user_id: user_id,
                                vote_type: 0,
                            }),
                            
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data, status, xhr) {
                            }
                        })
                    }
                }
            })

            // Handles clicking on a post
            $('.post').on('click', function (e) {
                if (!(e.target.className.includes("video") || e.target.className.includes("carousel-control-next") || e.target.className.includes("carousel-control-prev") || e.target.className.includes("carousel-control-next-icon") || e.target.className.includes("carousel-control-prev-icon"))) {
                    var post = $(this);
                    var post_id = post.attr('id').split('_')[1];
                    var subreaddit = pathname;
                    location.href = `${subreaddit}/${post_id}`;
                }
            })

            // Handles clicking on pin button
            $('.pin').on('click', function (e) {
                e.stopPropagation();
                var pin_id = $(this).attr('id');
                pin(pin_id);
            })

            // Handles clicking on delete button
            $('.delete').on('click', function (e) {
                e.stopPropagation();
                var delete_id = $(this).attr('id');
                deletePost(delete_id);
            })
        },
        error: function (xhr, status, error){
            notifier.alert(xhr.responseJSON.message);
        }
    })

});

//extracts user id
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

//extracts all images for all posts
function addImage(post_id) {
    //retrives media for post
    $.ajax({
        url: `${baseUrl[0]}/media/media/` + post_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var media = data.Result;
            if (media.length > 1) {
                var appendStringStart = `   
                <div class="col-1">
                    <a class="carousel-control-prev" href="#carouselExampleIndicators_${post_id}" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                </div>
                <div id="carouselExampleIndicators_${post_id}" class="carousel slide inheritMaxWidth col-10" data-ride="carousel" data-interval="false">
                        <ol class="carousel-indicators">`
                for (var j = 0; j < media.length; j++) {
                    if (j == 0) {
                        appendStringStart += `<li data-target="#carouselExampleIndicators_${post_id}" data-slide-to="${j}" style="color: #00ff00"></li>`;
                    }
                    else {
                        appendStringStart += `<li data-target="#carouselExampleIndicators_${post_id}" data-slide-to="${j}" class="active"></li>`;
                    }
                }
                appendStringStart += `</ol> <div class="carousel-inner inheritMaxWidth">`;

                var appendStringEnd = `
                        </div>
                      </div>
                      <div class="col-1">
                            <a class="carousel-control-next" href="#carouselExampleIndicators_${post_id}" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                            </a>
                        </div>
                        `;

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
                                <img class="image" src="${media[count].media_url}" alt="Image not available"> 
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
                                <img class="image" src="${media[count].media_url}" alt="GIF not available"> 
                            </div>`;
                    }
                }

                appendString = appendStringStart + appendStringEnd;
                $(`#post_media_` + post_id).html(appendString);

            }
            else if (media.length == 0) {
                appendString = ``;
                $(`#post_media_` + post_id).remove();
            }
            else {
                //run single file display
                if (media[0].fk_content_type == "1") {
                    $(`#post_media_` + post_id).html(`<img class="image" src="${media[0].media_url}" alt="Image not available"> `)
                }
                else if (media[0].fk_content_type == "2") {
                    $(`#post_media_` + post_id).html(`<video class="video" controls autoplay muted loop>
                                            <source src="${media[0].media_url}" type="video/mp4">
                                            Your browser does not support the video tag.
                                    </video>`)
                }
                else {
                    $(`#post_media_` + post_id).html(`<img class="image" src="${media[0].media_url}" alt="GIF not available"> `)
                }
            }

        },

        error: function (xhr, textStatus, errorThrown) {
            notifier.alert(xhr.responseJSON.message);
            console.log(xhr)
            console.log(textStatus);
            console.log(errorThrown);
            console.log(xhr.status);
        }
    });
}

//get all votes
function getUsersVotes(user_id) {
    var results;
    $.ajax({
        method: 'GET',
        url: `${baseUrl[0]}/vote/all?user_id=${user_id}`,
        async: false,
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            results = data
        }
    })
    return results;
}

//get saved posts
function getSavedPosts(user_id) {
    var output;
    $.ajax({
        url: baseUrl[0] + "/save/posts?user_id=" + user_id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (saved_posts_data, status, xhr) {
            for (var x = 0; x < saved_posts_data.length; x++) {
                var post_id = saved_posts_data[x].fk_post_id;
                var saved_bookmark = $(`#post_bookmark_${post_id}`)
                saved_bookmark.addClass('saved');
                saved_bookmark.empty();
                saved_bookmark.append(`
                    <span class="material-icons md-24 ms-0">bookmark</span>
                    <p class="mb-0 fw-bold fs-6">Unsave</p>
                `);
            }
        },
        error: function (xhr, status, error) {
            notifier.alert("Error getting saved posts. Try refreshing the page.")
        }
    })
    return output;

}

function redirect(){
    window.location.href = "/createPost.html"
}
