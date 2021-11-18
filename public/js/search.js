const baseUrl = "http://localhost:3000"
//const baseUrl = "https://readdit-backend.herokuapp.com"

function switchTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" tabColour", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " tabColour";
}

$(document).ready(function () {
    var queryParams = new URLSearchParams(window.location.search);
    console.log("---------Query Parameters---------");
    console.log("Query Param (source): " + window.location.search);
    console.log("Query Param (extracted): " + queryParams);

    var input = queryParams.get("query");

    $(`#resultheader`).html(`<h4> Displaying Search Results for ${input} </h4>`)
    searchSubreaddits();
    searchPosts();
})

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

function searchSubreaddits() {
    var query = window.location.search;
    console.log(query)
    $.ajax({
        url: `${baseUrl}/r/search/query` + query,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            var subreaddits = data.Result;
            if (subreaddits.length == 0) {
                $(`#subreaddits`).append("No results found");
            }
            else {
                for (var i = 0; i < subreaddits.length; i++) {
                    console.log(i)
                    $("#subreaddits").append(`
                                <div class="post rounded">
                                    <div class="row g-0">
                                        <div class="col-12 bg-white p-2">
                                            <div class="d-flex flex-row align-items-baseline">
                                                <a href="/r/${subreaddits[i].subreaddit_name}"><h6 class="d-inline fw-bold clickable-link">r/${subreaddits[i].subreaddit_name}</h6></a>
                                                <p class="fw-light text-secondary mx-1">•</p>
                                                <p class="fw-light text-secondary mx-1">•</p>
                                            </div>
    
                                            <h5>${subreaddits[i].subreaddit_description}</h5>
                                        </div>
                                    </div>
                                </div>
                                `)
                }
            }

        },
        error: function (xhr, status, error) {
            console.log("Error: " + error)
        }
    })
}

function searchPosts() {
    var queryParams = new URLSearchParams(window.location.search);
    console.log("---------Query Parameters---------");
    console.log("Query Param (source): " + window.location.search);
    console.log("Query Param (extracted): " + queryParams);

    var input = queryParams.get("query");

    $.ajax({
        url: `${baseUrl}/post/search` + window.location.search,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            var posts = data.Result;
            if (posts.length == 0) {
                $(`#posts`).append("No results found");
            }
            else {
                for (var i = 0; i < posts.length; i++) {
                    console.log(i)
                    $("#posts").append(`
                                <div class="post rounded">
                                    <div class="row g-0">
                                        <div class="col-12 bg-white p-2">
                                            <div class="d-flex flex-row align-items-baseline">
                                                <a href="/r/${posts[i].Subreaddit.subreaddit_name}/${posts[i].post_id}"><h6 class="d-inline fw-bold clickable-link">${posts[i].title}</h6></a>
                                                <p class="fw-light text-secondary mx-1">•</p>
                                                <p class="fw-light text-secondary mx-1">•</p>
                                            </div>
    
                                            <h5>${posts[i].content}</h5>
                                        </div>
                                    </div>
                                </div>
                                `)
                }
            }

            $.ajax({
                url: `${baseUrl}/post/post/search/` + input,
                method: 'GET',
                contentType: "application/json; charset=utf-8",
                success: function (data, status, xhr) {
                    var similars = arrangeSimilars(data);;
                    for (var i = 0; i < similars.length; i++) {
                        var duplicate = false;
                        for (var count = 0; count < posts.length; count++) {
                            if (similars[i].post_id == posts[count].post_id) {
                                duplicate = true;
                            }
                        }
                        if (duplicate == false) {
                            $("#similar").append(`
                                    <div class="post rounded">
                                        <div class="row g-0">
                                            <div class="col-12 bg-white p-2">
                                                <div class="d-flex flex-row align-items-baseline">
                                                    <a href="/r/${similars[i].Subreaddit.subreaddit_name}/${similars[i].post_id}"><h6 class="d-inline fw-bold clickable-link">${similars[i].title}</h6></a>
                                                    <p class="fw-light text-secondary mx-1">•</p>
                                                    <p class="fw-light text-secondary mx-1">•</p>
                                                </div>
        
                                                <h5>${similars[i].content}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    `)
                        }
                    }

                },
                error: function (xhr, status, error) {
                    console.log("Error: " + error)
                }
            })

        },
        error: function (xhr, status, error) {
            console.log("Error: " + error)
        }
    })
}