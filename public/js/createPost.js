const baseUrl = "http://localhost:3000";
//const baseUrl = "https://readdit-backend.herokuapp.com"

$(document).ready(function () {

    // Retrieves subreaddits.
    $.ajax({
        url: `${baseUrl}/r/subreaddits`,
        method: 'get',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) {
            var data = data.Result

            for (var i = 0; i < data.length; i++) {
                $('#create_post_community').append(`
                    <option id='subreaddit_id_${data[i].subreaddit_id}' value='${data[i].subreaddit_id}'>${data[i].subreaddit_name}</option>
                `)
            }

        },
        error: function (xhr, status, err) {
            console.log(xhr)
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

        // Adds the loading animation
        $('#post_loading_div').removeClass('d-none');

        var subreaddit_id = $('#create_post_community').val();
        var title = $('#create_post_title').val();
        var content = $('#create_post_content').val();
        var fk_flair_id = document.getElementById("create_post_flair").value;
        // Temporary User id
        var token = localStorage.getItem("token")
        
        if (subreaddit_id == null) {
            $(`#msg`).html(`<p class="text-danger"> Please select a subreaddit to post in! </p>`);
        }
        else if (title.trim() == "") {
            $(`#msg`).html(`<p class="text-danger"> Post title cannot be blank! </p>`);
        }
        else {
            let webFormData = new FormData();
            webFormData.append('title', title);
            webFormData.append('content', content);
            webFormData.append('subreaddit_id', subreaddit_id);
            webFormData.append('fk_flair_id', fk_flair_id);
            var media = document.getElementsByClassName('media');
            console.log("Media length: " + media.length);
            for (var i = 0; i < media.length; i++) {
                console.log("Append Information: " + media[i].files[0])
                webFormData.append("media", media[i].files[0]);
            };
    
            $.ajax({
                url: `${baseUrl}/post/create`,
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
                    $('#post_loading_div').addClass('d-none');
                    alert(data.Result);
                },
                error: function (xhr, status, err) {
                    $(`#msg`).html(`<h5 class="text-danger"> An error has occured while creating your post. </h5>`);
                }
            })
        }
    })


})

function selectedSubreadditId() {
    var subreaddit_id = document.getElementById("create_post_community").value;
    showFlairs(subreaddit_id);
}

function showFlairs(subreaddit_id) {
    $.ajax({
        url: `${baseUrl}/flair/` + subreaddit_id,
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
                    console.log(JSON.stringify(data[i]));
                    $("#create_post_flair").append(`
                    <option id='flair_id_${data[i].flair_id}' value='${data[i].flair_id}'>${data[i].flair_name}</option>
                `);
                    document.getElementById("no_flairs").hidden = true;
                    document.getElementById("flair_section").hidden = false;
                }
            }

        },
        error: function (xhr, status, error) {
            $("#currentModerators").html(`
                <div class="row g-0 border-top">
                <div class="col-12 bg-white p-2 text-center d-flex justify-content-center align-items-center">
                    <h5>Error loading moderators</h5>
                </div>
            </div>
                `);
        }
    })
}
