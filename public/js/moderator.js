//const baseUrl = "http://localhost:3000"
const baseUrl = "https://readdit-backend.herokuapp.com"

$(document).ready(function () {
    localStorage.removeItem("subreaddit_id");
    checkOwner();
})

function checkOwner(){
    let params = (new URL(document.location)).searchParams;
    let subreadditName = params.get("subreaddit");
    var token = localStorage.getItem("token");
    $.ajax({
        url: `${baseUrl}/r/checkOwner/` + subreadditName,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        headers: {authorization:"Bearer " + token},
        success: function (data, status, xhr) { 
            getSubreadditId();
        },
        error: function (xhr, status, error) {
            window.location.href = "/home.html";
        }
    });
}


function getLikeUsername(){
    var username = $("#usernameSearch").val();
    if (username.trim().length != 0){
        $.ajax({
            url: `${baseUrl}/usernameSearch/` + username,
            method: 'GET',
            contentType: "application/json; charset=utf-8",
            success: function (data, status, xhr) {
                filterUsers(data.Result);
            },
            error: function (xhr, status, error) {

            }
        })
    }
    else{
        $("#non-moderator-list").html("");
    }

};

//removes users who are already moderators
function filterUsers(searchResults){
    var subreaddit_id = localStorage.getItem('subreaddit_id');
    $.ajax({
        url: `${baseUrl}/moderator/` + subreaddit_id,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) { 
            var data = data.Result;
            console.log("Mods: " + JSON.stringify(data))

            $("#non-moderator-list").html("");
            var filteredLength = 0;
            for (var i=0;i<searchResults.length;i++){
                if ((data.some(moderator => moderator.fk_user_id == searchResults[i].user_id)) == false ){
                    $("#non-moderator-list").append(`
                        <div class="row g-0 border-top">
                        <div class="col-8 bg-white p-2 text-center d-flex justify-content-center align-items-center">
                            <h5>u/${searchResults[i].username}</h5>
                        </div>
                        <div class="col-4 p-2 text-center" >
                            <a onclick="addModerator(${searchResults[i].user_id})" id="addModerator" class="btn me-2 px-4 rounded-pill">Add Moderator</a>
                        </div>
                    </div>
                    `);
                    filteredLength++;
                }
            };
            if (filteredLength == 0){
                $("#non-moderator-list").append(`
                        <div class="row g-0 border-top">
                        <div class="col-12 bg-white p-2 text-center d-flex justify-content-center align-items-center">
                            <h5>No Matches Found.</h5>
                        </div>
                    </div>
                    `);
            }

        },
        error: function (xhr, status, error) {
            success = false;
        }
    });
};


function getCurrentMods(){
    var subreaddit_id = localStorage.getItem('subreaddit_id');
    $.ajax({
        url: `${baseUrl}/moderator/` + subreaddit_id,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) { 
            $("#currentModerators").html("");
            var data = data.Result;
            if (data.length == 0){
                $("#currentModerators").append(`
                <div class="row g-0 border-top">
                <div class="col-12 bg-white p-2 text-center d-flex justify-content-center align-items-center">
                    <h5>There are no moderators</h5>
                </div>
            </div>
                `);
            }
            else{
                for (var i=0;i<data.length;i++){
                console.log(JSON.stringify(data[i]));
                $("#currentModerators").append(`
                <div class="row g-0 border-top">
                <div class="col-8 bg-white p-2 text-center d-flex justify-content-center align-items-center">
                    <h5>u/${data[i]["User.username"]}</h5>
                </div>
                <div class="col-4 p-2 text-center" >
                    <a onclick="deleteModerator(${data[i].moderator_id})" id="removeModerator" class="btn me-2 px-4 rounded-pill">Remove Moderator</a>
                </div>
            </div>
                `);
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

function getSubreadditId(){
    let params = (new URL(document.location)).searchParams;
    let subreadditName = params.get("subreaddit");
    $.ajax({
        url: `${baseUrl}/r/` + subreadditName,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) { 
            data = JSON.parse(data);
            localStorage.setItem("subreaddit_id", data.subreaddit_id)
            getCurrentMods();
        },
        error: function (xhr, status, error) {
            success = false;
        }
    });

};

function addModerator(user_id){
    var subreaddit_id = localStorage.getItem("subreaddit_id");
    var token = localStorage.getItem("token");
    $.ajax({
        url: `${baseUrl}/moderator/${subreaddit_id}/${user_id}`,
        method: 'post',
        contentType: "application/json; charset=utf-8",
        headers:{authorization:"Bearer " + token},
        success: function (data, status, xhr) { 
            getCurrentMods();
            getLikeUsername();
        },
        error: function (xhr, status, error) {
            success = false;
        }
    })
}

function deleteModerator(moderator_id){
    var subreaddit_id = localStorage.getItem("subreaddit_id");
    var token = localStorage.getItem("token");
    $.ajax({
        url: `${baseUrl}/moderator/${moderator_id}/${subreaddit_id}`,
        method: 'DELETE',
        contentType: "application/json; charset=utf-8",
        headers: {authorization:"Bearer " + token},
        success: function (data, status, xhr) { 
            getCurrentMods();
            getLikeUsername();
        },
        error: function (xhr, status, error) {
            success = false;
        }
    })
}
