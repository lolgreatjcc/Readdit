//const baseUrl = "http://localhost:3000"
const baseUrl = "https://readdit-backend.herokuapp.com"

let notifier = new AWN({icons:{enabled:false}})

function switchTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    var tablinks = $('.tablink');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

$(document).ready(function () {
    notifier.info("Searching for subreaddits and posts...")
    var queryParams = new URLSearchParams(window.location.search);

    var input = queryParams.get("query");

    $(`#resultheader`).html(`<h5 class="mb-2"> Displaying Search Results for ${input} </h5>`)
    searchSubreaddits();
    searchPosts();
})

//arrange all similar results by similarity descending
function arrangeSimilars(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (i == arr.length - 1) {
            break;
        }
        if (arr[i].similar < arr[i + 1].similar) {
            var tmp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = tmp;

            i = -1;
        }
    }
    return arr;
}

//search for subreaddits
function searchSubreaddits() {
    var queryParams = new URLSearchParams(window.location.search);
    var input = queryParams.get("query");
    //basic subreaddit search
    $.ajax({
        url: `${baseUrl}/r/search/query` + window.location.search,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            var subreaddits = data.Result;
            if (subreaddits.length == 0) {
                $(`#subreaddit_content`).append("No results found");
            }
            else {
                for (var i = 0; i < subreaddits.length; i++) {
                    var round = ""
                    if (i == 0) {
                        round = "rounded-top"
                    }
                    if (i == subreaddits.length - 1) {
                        round = "rounded-bottom"
                    }
                    $("#subreaddit_content").append(`
                                <div class="post rounded">
                                    <div class="row g-0 ">
                                        <div class="col-12 bg-white py-2 px-3 ${round} subreaddit" id="subreaddit_${subreaddits[i].subreaddit_name}">
                                            <div class="d-flex flex-row align-items-baseline">
                                                <a href="/r/${subreaddits[i].subreaddit_name}" class="text-dark text-decoration-none"><h6 class="d-inline fw-bold clickable-link">r/${subreaddits[i].subreaddit_name}</h6></a>
                                            </div>
    
                                            <h5 class="smaller text-secondary">${subreaddits[i].subreaddit_description}</h5>
                                        </div>
                                    </div>
                                </div>
                                `)
                }
            }
            clickableSubreaddits();
            //similar subreaddit search
            $.ajax({
                url: `${baseUrl}/r/SimilarSearch/` + input,
                method: 'GET',
                contentType: "application/json; charset=utf-8",
                success: function (data, status, xhr) {
                    var similars = arrangeSimilars(data);
                    if (similars.length == 0) {
                        $(`#subreaddit_similar`).append("No similar results available");
                    }
                    else {
                        //removes duplicate values
                        for (var i = 0; i < similars.length; i++) {
                            var duplicate = false;
                            for (var count = 0; count < subreaddits.length; count++) {
                                if (similars[i].subreaddit_id == subreaddits[count].subreaddit_id) {
                                    duplicate = true;
                                }
                            }
                            if (duplicate == false) {
                                var round = ""
                                if (i == 0) {
                                    round = "rounded-top"
                                }
                                if (i == subreaddits.length - 1) {
                                    round = "rounded-bottom"
                                }
                                $("#subreaddit_similar").append(`
                                            <div class="post rounded">
                                                <div class="row g-0 ">
                                                    <div class="col-12 bg-white py-2 px-3 ${round} subreaddit" id="subreaddit_${similars[i].subreaddit_name}">
                                                        <div class="d-flex flex-row align-items-baseline">
                                                            <a href="/r/${similars[i].subreaddit_name}" class="text-dark text-decoration-none"><h6 class="d-inline fw-bold clickable-link">r/${similars[i].subreaddit_name}</h6></a>
                                                        </div>
                
                                                        <h5 class="smaller text-secondary">${similars[i].subreaddit_description}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            `)
                            }
                        }
                    }
                    clickableSubreaddits();
                },
                error: function (xhr, status, error) {
                    console.log("Error: " + error)
                }
            })
        },
        error: function (xhr, status, error) {
            notifier.alert(xhr.responseJSON.message)
        }
    })
}

//makes subreaddit search results clickable
function clickableSubreaddits() {
    $(".subreaddit").click(function () {
        var subreaddit_id = $(this).attr("id").split("_")[1];
        window.location.href = `/r/${subreaddit_id}`;
    })
}

//makes post search results clickable
function clickablePosts() {
    $(".post").click(function () {
        var post_id = $(this).attr("id").split("_")[1];
        window.location.href = `/r/0/${post_id}`;
    })
}

//search for posts
function searchPosts() {
    var queryParams = new URLSearchParams(window.location.search);
    var input = queryParams.get("query");
    //basic post search 
    $.ajax({
        url: `${baseUrl}/post/search` + window.location.search,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            var posts = data.Result;
            if (posts.length == 0) {
                $(`#posts_content`).append("No results found");
            }
            else {
                for (var i = 0; i < posts.length; i++) {

                    // Calculates Time
                    var date = new Date(posts[i].created_at);
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

                    $(`#posts_content`).append(`
                <div class="post rounded mb-2" id="post_${posts[i].post_id}">
                    <div class="row g-0 rounded">
                        <div class="col-1 upvote-section py-2 justify-content-center">
                            <a class="text-center d-block py-1" id="post1-upvote"><i
                                    class="fas fa-arrow-up text-dark"></i></a>
                            <p id="post#-val" class="text-center mb-0">${posts[i].Post_Votes}</p>
                            <a class="text-center d-block py-1" id="post1-downvote"><i
                                    class="fas fa-arrow-down text-dark"></i></a>
                        </div>
                        <div class="col-11 bg-white rounded p-2">
                            <div class="d-flex flex-row align-items-baseline">
                                <h6 class="d-inline fw-bold clickable-link">r/${posts[i].Subreaddit.subreaddit_name}</h6>
                                <p class="fw-light text-secondary mx-1">•</p>
                                <p class="d-inline text-secondary me-1">Posted by</p>
                                <p class="d-inline text-secondary clickable-link" id="post#_user"> u/${posts[i].User.username}</p>
                                <p class="fw-light text-secondary mx-1">•</p>
                                <p class="text-secondary" id="post#_time">${post_date_output}</p>
                            </div>
                            <h5>${posts[i].title}</h5>
                            
                        </div>
                    </div>
                </div>
                    `)

                    clickablePosts();
                }
            }

            //similar post search
            $.ajax({
                url: `${baseUrl}/post/SimilarSearch/` + input,
                method: 'GET',
                contentType: "application/json; charset=utf-8",
                success: function (data, status, xhr) {
                    var similars = arrangeSimilars(data);
                    if (similars.length == 0) {
                        $(`#posts_similar`).append("No similar results available");
                    }
                    else {
                        //removes duplicate values
                        for (var i = 0; i < similars.length; i++) {
                            var duplicate = false;
                            for (var count = 0; count < posts.length; count++) {
                                if (similars[i].post_id == posts[count].post_id) {
                                    duplicate = true;
                                }
                            }
                            if (duplicate == false) {
    
                                // Calculates Time
                                var date = new Date(similars[i].created_at);
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
                                
                                $("#posts_similar").append(`
                            <div class="post rounded mb-2" id="post_${similars[i].post_id}">
                                <div class="row g-0 rounded">
                                    <div class="col-1 upvote-section py-2 justify-content-center">
                                        <a class="text-center d-block py-1" id="post1-upvote"><i
                                                class="fas fa-arrow-up text-dark"></i></a>
                                        <p id="post#-val" class="text-center mb-0">6920</p>
                                        <a class="text-center d-block py-1" id="post1-downvote"><i
                                                class="fas fa-arrow-down text-dark"></i></a>
                                    </div>
                                    <div class="col-11 bg-white rounded p-2">
                                        <div class="d-flex flex-row align-items-baseline">
                                            <h6 class="d-inline fw-bold clickable-link">r/${similars[i].Subreaddit.subreaddit_name}</h6>
                                            <p class="fw-light text-secondary mx-1">•</p>
                                            <p class="d-inline text-secondary me-1">Posted by</p>
                                            <p class="d-inline text-secondary clickable-link" id="post#_user"> u/${similars[i].User.username}</p>
                                            <p class="fw-light text-secondary mx-1">•</p>
                                            <p class="text-secondary" id="post#_time">${post_date_output}</p>
                                        </div>
                                        <h5>${similars[i].title}</h5>
                                        
                                    </div>
                                </div>
                            </div>
                                `)   
                            }
                            
                        }
                    }
                    clickablePosts();
                },
                error: function (xhr, status, error) {
                    console.log(xhr.responseJSON.message)
                }
            })

        },
        error: function (xhr, status, error) {
            console.log(xhr.responseJSON.message)
        }
    })
}