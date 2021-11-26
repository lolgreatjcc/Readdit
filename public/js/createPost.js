const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

let notifier = new AWN({icons:{enabled:false}})

$(document).ready(function () {
    //check if user is logged in
    try {
        var userData = localStorage.getItem('userInfo');
        var token = localStorage.getItem("token")
        var userJsonData = JSON.parse(userData);
        var role = userJsonData.fk_user_type_id;
    } catch (error) {
        notifier.alert("You need to be logged in to access this page!");
        setTimeout(function() {
            window.location.assign(`${baseUrl[1]}/login.html`);
        }, 2000);
    }

    // Retrieves subreaddits.
    $.ajax({
        url: `${baseUrl[0]}/r/subreaddits`,
        method: 'get',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            var data = data.Result

            //lists out all subreaddits into dropdown list
            for (var i = 0; i < data.length; i++) {
                $('#create_post_community').append(`
                    <option id='subreaddit_id_${data[i].subreaddit_id}' value='${data[i].subreaddit_id}'>${data[i].subreaddit_name}</option>
                `)
            }

        },
        error: function (xhr, status, err) {
            console.log(xhr)
            notifier.alert(xhr.responseJSON.message);
        }
    })

    // Adds a media form field
    var media_form_count = 0
    $('#add_media_form_button').on('click', () => {
        media_form_count++
        var media_form = $('#media_form')
        media_form.append(`
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="inputGroupFile01">Media ${media_form_count}</label>
                                <input type="file" class="form-control media" id="inputGroupFile01">
                            </div>
        
        `)
    })

    // Submits the post
    $('#create_post_submit').on('click', () => {

        var subreaddit_id = $('#create_post_community').val();
        var subreaddit_name = $(`#subreaddit_id_${subreaddit_id}`).text();
        var title = $('#create_post_title').val();
        var content = $('#create_post_content').val();
        var fk_flair_id = document.getElementById("create_post_flair").value;
        // Temporary User id
        var token = localStorage.getItem("token")
        
        if (subreaddit_id == null) {
            notifier.warning("Please select a subreaddit to post in!");
        }
        else if (title.trim() == "") {
            notifier.warning("Post title cannot be blank!");
        }
        else {
            // Adds the loading animation
            $('#post_loading_div').removeClass('d-none');

            let webFormData = new FormData();
            webFormData.append('title', title);
            webFormData.append('content', content);
            webFormData.append('subreaddit_id', subreaddit_id);
            webFormData.append('fk_flair_id', fk_flair_id);
            var media = document.getElementsByClassName('media');
            for (var i = 0; i < media.length; i++) {
                webFormData.append("media", media[i].files[0]);
            };
    
            $.ajax({
                url: `${baseUrl[0]}/post/create`,
                method: "POST",
                data: webFormData,
                processData: false,
                contentType: false,
                cache: false,
                enctype: 'multipart/form-data',
                headers: {
                    authorization: "Bearer " + token
                },
                success: function (data, status, xhr) {
                    var post_id = data.Result.post_id || data.Result.fk_post_id
                    $('#post_loading_div').addClass('d-none');
                    notifier.success("Post created successfully!");

                    setTimeout(function() {
                        window.location.assign(`${baseUrl[1]}/r/${subreaddit_name}/${post_id}.html`);
                    }, 2000);
                },
                error: function (xhr, status, err) {
                    $('#post_loading_div').addClass('d-none');
                    notifier.alert(xhr.responseJSON.message);
                }
            })
        }
    })


})

//extracts subreadditid of selected subreaddit
function selectedSubreadditId() {
    var subreaddit_id = document.getElementById("create_post_community").value;
    showFlairs(subreaddit_id);
}

//display flairs that belong to the subreaddit
function showFlairs(subreaddit_id) {
    $.ajax({
        url: `${baseUrl[0]}/flair/` + subreaddit_id,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            $("#create_post_flair").html("<option disabled selected value=null>No Flair Chosen - choose a flair?</option>");
            var data = data.Result;
            if (data.length == 0) {
                document.getElementById("no_flairs").hidden = false;
                document.getElementById("flair_section").hidden = true;
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    $("#create_post_flair").append(`
                    <option id='flair_id_${data[i].flair_id}' value='${data[i].flair_id}'>${data[i].flair_name}</option>
                `);
                    document.getElementById("no_flairs").hidden = true;
                    document.getElementById("flair_section").hidden = false;
                }
            }

        },
        error: function (xhr, status, error) {
            notifier.alert(xhr.responseJSON.message);
        }
    })
}
