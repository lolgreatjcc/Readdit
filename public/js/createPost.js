//const baseUrl = "http://localhost:3000";
const baseUrl = "https://readdit-backend.herokuapp.com/"

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
        var subreaddit_id = $('#create_post_community').val();
        var title = $('#create_post_title').val();
        var content = $('#create_post_content').val();

        // Temporary User id
        var user_id = 2
        let webFormData = new FormData();
        webFormData.append('title',title);
        webFormData.append('content',content);
        webFormData.append('subreaddit_id',subreaddit_id);
        webFormData.append('user_id',user_id);
        var media = document.getElementsByClassName('media');
        console.log("Media length: " + media.length);
        for (var i=0;i<media.length;i++){
            console.log("Append Information: " + media[i].files[0])
            webFormData.append("media", media[i].files[0]);
        };

        $.ajax({
            url:  `${baseUrl}/post/create`,
            method: "POST",
            data: webFormData,
            processData: false,
            contentType: false,
            cache: false,
            enctype: 'multipart/form-data',
            success: function (data,status,xhr) {
                alert(data.Result);
            },
            error: function (xhr, status, err) {
                alert("Something went wrong");
            }
        })
    })
})
