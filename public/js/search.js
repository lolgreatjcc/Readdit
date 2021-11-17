//const baseUrl = "http://localhost:3000"
const baseUrl = "https://readdit-backend.herokuapp.com"

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
            searchSubreaddits();
            searchPosts();
        })

        function searchSubreaddits(){
            var query = window.location.search;
            console.log(query)
            $.ajax({
                url: `${baseUrl}/r/search/query` + query,
                method: 'GET',
                contentType: "application/json; charset=utf-8",
                success: function (data, status, xhr) {
                    var subreaddits = data.Result;
                    console.log(subreaddits)
                    for (var i=0;i<subreaddits.length;i++){
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
                 
                },
                error: function (xhr, status, error) {
                    console.log("Error: " + error)
                }
            })
        }

        function searchPosts(){
            var query = window.location.search;
            console.log(query)
            $.ajax({
                url: `${baseUrl}/post/search` + query,
                method: 'GET',
                contentType: "application/json; charset=utf-8",
                success: function (data, status, xhr) {
                    var posts = data.Result;
                    console.log(posts)
                    for (var i=0;i<posts.length;i++){
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
                 
                },
                error: function (xhr, status, error) {
                    console.log("Error: " + error)
                }
            })
        }
