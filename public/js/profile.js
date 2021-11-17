const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

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
            var age_arr = user.created_at.split("-");
            $('#age').append(`On readdit since ${age_arr[0]}`);

            try {
                if (user.profile_pic === "undefined" || user.profile_pic == null || user.profile_pic.trim().length == 0 || user.profile_pic == "NULL") {
                    $('#pfpImg').html('<img src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="profile image" id="pfp" class="pb-2"></img><br>')
                }
                else {
                    console.log("Pfp: " + user.profile_pic);
                    var pfpTempString = user.profile_pic.split("upload");
                    user.profile_pic = pfpTempString[0] + "upload" + "/ar_1.0,c_fill/r_max" + pfpTempString[1]
                    $('#pfpImg').html('<img src="' + user.profile_pic + '" alt="profile image" id="pfp" class="pb-2"></img><br>')
                }
            }
            catch (error) {
                $('#pfpImg').html('<img src="https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png" alt="profile image" id="pfp" class="pb-2"></img><br>')
                console.log(error)
            }
        },


        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            $('#loadingText').html("<h6 class='text-danger'>ERROR LOADING!</h6>");
            if (xhr.status == 403) {
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

    console.log("Displaying Posts");
    $(`#data_table`).html(`<thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Post Title</th>
                                <th scope="col">Posted in</th>
                                <th scope="col">Posted at</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody id="table_data">
                        </tbody>`
                        );
    // call the web service endpoint
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        url: baseUrl[0] + '/post/user/' + user_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var appendString = "";
            for (var i = 0; i < data.length; i++) {
                var post = data[i];
                appendString += `<tr>
                                                <th scope="row">${i + 1}</th>
                                                <td>${post.title}</td>
                                                <td>${post.Subreaddit.subreaddit_name}</td>
                                                <td>${post.created_at}</td>
                                                <td> <button type="submit" onclick="window.location.href='${baseUrl[1] + "/r/" + post.Subreaddit.subreaddit_name + "/" + post.post_id + "'"}" class="ViewCall" style="background-color:#6a5acd; color:white; border-width: 0px;">View Post</button> </td>
                                            </tr>`;
            }
            $("#load").html("");
            $("#table_data").append(appendString);

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
    $(`#data_table`).html(`<thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Comment</th>
                                <th scope="col">Commented on</th>
                                <th scope="col">Commented at</th>
                            </tr>
                        </thead>
                        <tbody id="table_data">
                        </tbody>`
                        );
    // call the web service endpoint
    $.ajax({
        //headers: { 'authorization': 'Bearer ' + tmpToken },
        url: baseUrl[0] + '/comment/user/' + user_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var appendString = "";
            for (var i = 0; i < data.length; i++) {
                var comment = data[i];
                appendString += `<tr>
                                                <th scope="row">${i + 1}</th>
                                                <td>${comment.comment}</td>
                                                <td>${comment.Post.title}</td>
                                                <td>${comment.created_at}</td>
                                            </tr>`;
            }
            $("#load").html("");
            $("#table_data").append(appendString);

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
})
