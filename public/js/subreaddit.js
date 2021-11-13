const baseUrl = ["http://localhost:3000","http://localhost:3001"]
//const baseUrl = "https://readdit-backend.herokuapp.com/"

function addImage(post_id) {
    //retrives media for post
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        url: 'http://localhost:3000/media/media/' + post_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var media = data.Result;
            console.log(media.length);
            if (media.length > 1) {
                var appendStringStart = `<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                        <ol class="carousel-indicators">`
                for (var i = 0; i < media.length; i++) {
                    if (i == 0) {
                        appendStringStart += `<li data-target="#carouselExampleIndicators" data-slide-to="${i}" class="active"></li>`;
                    }
                    else {
                        appendStringStart += `<li data-target="#carouselExampleIndicators" data-slide-to="${i}"></li>`;
                    }
                }
                appendStringStart += `</ol> <div class="carousel-inner">`;

                var appendStringEnd = `
                        </div>
                        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                          <span class="sr-only">Next</span>
                        </a>
                      </div>`

                //run multiple file display
                for (var i = 0; i < media.length; i++) {
                    console.log(media[i]);
                    if (i == 0) {
                        var item = 'carousel-item active';
                    }
                    else {
                        var item = 'carousel-item';
                    }
                    if (media[i].fk_content_type == "1") {
                        appendStringStart += `<div class="${item}">
                                <img style="height:500px; width: 400px; object-fit: cover;" src="${media[i].media_url}" alt="Image not available"> 
                            </div>`;
                    }
                    else if (media[i].fk_content_type == "2") {
                        appendStringStart += `<div class="${item}"> <video height="400" controls autoplay muted >
                                            <source src="${media[i].media_url}" type="video/mp4">
                                            Your browser does not support the video tag.
                                    </video> </div>`;
                    }
                    else {
                        appendStringStart += `<div class="${item}">
                                <img style="height: 600px; width: 500px; object-fit: cover;" src="${media[i].media_url}" alt="GIF not available"> 
                            </div>`;
                    }
                }

                appendString = appendStringStart + appendStringEnd;
                $(`#post_media` + post_id).html(appendString);

            }
            else if (media.length == 0) {
                $(`#post_media` + post_id).html(``);
            }
            else {
                console.log(media);
                //run single file display
                if (media[0].fk_content_type == "1") {
                    $(`#post_media`+ post_id).html(`<img style="max-height: 500px; max-width: 400px; object-fit: cover;" src="${media[0].media_url}" alt="Image not available"> `)
                }
                else if (media[0].fk_content_type == "2") {
                    $(`#post_media`+ post_id).html(`<video height="400" controls autoplay muted >
                                            <source src="${media[0].media_url}" type="video/mp4">
                                            Your browser does not support the video tag.
                                    </video>`)
                }
                else {
                    $(`#post_media`+ post_id).html(`<img style="max-height: 600px; max-width: 500px; object-fit: cover;" src="${media[0].media_url}" alt="GIF not available"> `)
                }
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr)
            console.log(textStatus);
            console.log(errorThrown);
            console.log(xhr.status);
        }
    });
}

$(document).ready(function () {
    var pathname = window.location.pathname;
    $.ajax({
        url: `http://localhost:3000` + pathname,
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
        url: `http://localhost:3000/post/get` + pathname,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var copyStr = data[i].Subreaddit.subreaddit_name + "/" + data[i].post_id;
                console.log("Copied Str: " + copyStr);
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


                $('#post_div').append(`
                
                <div class="post rounded mb-2" id="post_${data[i].post_id}">
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


                    <a style="text-decoration:none" href="/r/${data[i].Subreaddit.subreaddit_name}/${data[i].post_id}">
                    <h5 style="color : black;" id="post_${data[i].post_id}_content">${data[i].title}</h5>
                    </a>
                    <p>${data[i].content}<p>
                    <div id="post_media${data[i].post_id}" class="d-flex flex-row justify-content-center bg-dark"> ${addImage(data[i].post_id)} </div>
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
                
            `)
            }

            

            // Handle Saving of Posts
            $('.save').on('click', function (e) {
                e.stopPropagation();
                var save_button = $(this);
                var post_id = $(this).attr('id').split('_')[2];

                // temp user_id
                var user_id = 2;

                if (save_button.hasClass('saved')) {
                    save_button.removeClass('saved');
                    save_button.empty();
                    save_button.append(`
                        <span class="material-icons md-24 ms-0">bookmark_border</span>
                        <p class="mb-0 fw-bold fs-6">Save</p>
                    `);



                    $.ajax({
                        url: "http://localhost:3000/save/post",
                        type: "DELETE",
                        data: JSON.stringify({
                            user_id: user_id,
                            post_id: post_id
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

                        url: `http://localhost:3000/save/post`,
                        method: 'POST',
                        data: JSON.stringify({
                            post_id: post_id,
                            user_id: user_id
                        }),
                        contentType: "application/json; charset=utf-8",
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

            $('.share').on('click', function (e) {
                e.stopPropagation();
                var share_button = $(this);
                var share_id = $(this).attr('id');
                var copiedText = baseUrl[1] + "/r/" + share_id;
                navigator.clipboard.writeText(copiedText);
                alert("Copied to clipboard!");
            })

            // Handles clicking on a post
            // $('.post').on('click', function (e) {
            //     var post =  $(this);
            //     var post_id = post.attr('id').split('_')[1];
            //     var subreaddit = pathname;
            //     location.href = `${subreaddit}/${post_id}`;
            // })

        },
        error: function (xhr, status, error) {
            console.log(xhr);
        }
    })
})

function checkOwner(subreadditName) {
    var token = localStorage.getItem("token");
    $.ajax({
        url: `http://localhost:3000/r/checkOwner/` + subreadditName,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        headers: { authorization: "Bearer " + token },
        success: function (data, status, xhr) {
            $("#moderator").html(`
            <div id="about_community_header" class="p-2 py-3 rounded-top">
                <h6 class="fw-bold text-white mb-0 ms-2">Moderators</h6>
            </div>
            <div class="p-2" >
                <a class="btn btn-dark body-borders rounded-pill invert-scheme fw-bold w-100" href="/moderator?subreaddit=${subreadditName}">Edit Moderators</a>
            </div>
            <div class="p-2" >
                <a class="btn btn-dark body-borders rounded-pill invert-scheme fw-bold w-100" href="/moderator/flair?subreaddit=${subreadditName}">Edit Flairs</a>
            </div>
            `)
        },
        error: function (xhr, status, error) {
            console.log("")
        }
    });
}

function copy(copyStr){
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyStr);

  /* Alert the copied text */
  alert("Copied to clipboard!");
}