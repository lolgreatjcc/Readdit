const baseUrl = "http://localhost:3000"
//const baseUrl = "https://readdit-backend.herokuapp.com"

let notifier = new AWN({icons:{enabled:false}})

$(document).ready(function () {
    localStorage.removeItem("subreaddit_id");
    checkOwner();
})

//checks if logged in user is the owner of the subreaddit
function checkOwner(){
    notifier.info("Getting flairs...");
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
            checkModerator(subreadditName);
        }
    });
}

//checks if logged in user is a moderator of the subreaddit
function checkModerator(subreadditName) {
    var token = localStorage.getItem("token");
    $.ajax({
        url: `${baseUrl}/moderator/checkModerator/` + subreadditName,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        headers: { authorization: "Bearer " + token },
        success: function (data, status, xhr) {
            getSubreadditId();
        },
        error: function (xhr, status, error) {
            window.location.href = "/";
        }
    });
    
}

//get all flairs that belong to that subreaddit
function getFlairs(){
    var subreaddit_id = localStorage.getItem('subreaddit_id');
    $.ajax({
        url: `${baseUrl}/flair/` + subreaddit_id,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) { 
            $("#flairs").html("");
            var data = data.Result;
            if (data.length == 0){
                $("#flairs").append(`
                <div class="row g-0 border-top">
                <div class="col-12 bg-white p-2 text-center d-flex justify-content-center align-items-center">
                    <h5>There are no flairs</h5>
                </div>
            </div>
                `);
            }
            else{
                for (var i=0;i<data.length;i++){
                $("#flairs").append(`
                <div class="row g-0 border-top">
                    <div class="col-8 bg-white p-2 text-center d-flex justify-content-center align-items-center">
                        <a class="btn me-2 px-4 rounded-pill" id="flair" style="background-color:${data[i].flair_colour}">${data[i].flair_name}</a>
                    </div>
                    <div class="col-4 p-2 text-center" >
                        <a onclick="deleteFlair(${data[i].flair_id})" id="removeFlair" class="btn me-2 px-4 rounded-pill">Remove Flair</a>
                    </div>
                </div>
                `);
            } 
            }
            
        },
        error: function (xhr, status, error) {
            notifier.alert(xhr.responseJSON.message);
        }
    })
}

//extract subreaddit ID by subreaddit name in URL
function getSubreadditId(){
    //extract subreaddit name from URL params
    let params = (new URL(document.location)).searchParams;
    let subreadditName = params.get("subreaddit");

    //ajax call to get subreaddit id by name
    $.ajax({
        url: `${baseUrl}/r/` + subreadditName,
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        success: function (data, status, xhr) { 
            data = JSON.parse(data);
            localStorage.setItem("subreaddit_id", data.subreaddit_id)
            getFlairs();
        },
        error: function (xhr, status, error) {
            notifier.alert(xhr.responseJSON.message);
        }
    });

};

//create a new flair
function createFlair(){
    //extract data
    var fk_subreaddit_id = localStorage.getItem("subreaddit_id");
    var user_id = JSON.parse(localStorage.getItem("userInfo")).user_id;
    var token = localStorage.getItem("token");
    var flair_name = $('#flair_name').val();
    var flair_colour = $('#flair_colour').val();
    var data = JSON.stringify({"flair_name":flair_name,"flair_colour":flair_colour,
                                "fk_subreaddit_id":fk_subreaddit_id,"user_id":user_id});
    notifier.info("Creating Flair...")
    //ajax call to delete flair
    $.ajax({
        url: `${baseUrl}/flair`,
        method: 'POST',
        contentType: "application/json; charset=utf-8",
        data: data,
        headers:{authorization:"Bearer " + token},
        success: function (data, status, xhr) { 
            notifier.success("Flair added successfully.")
            getFlairs();
        },
        error: function (xhr, status, error) {
            notifier.alert(xhr.responseJSON.message);
        }
    })
}

//delete flair
function deleteFlair(flair_id){
    //extract data
    var fk_subreaddit_id = localStorage.getItem("subreaddit_id");
    var user_id = JSON.parse(localStorage.getItem("userInfo")).user_id;
    var data = JSON.stringify({"fk_subreaddit_id":fk_subreaddit_id, "user_id":user_id});
    notifier.info("Deleting Flair...")
    var token = localStorage.getItem("token");

    //ajax call to delete flair
    $.ajax({
        url: `${baseUrl}/flair/${flair_id}`,
        method: 'DELETE',
        contentType: "application/json; charset=utf-8",
        headers: {authorization:"Bearer " + token},
        data: data,
        success: function (data, status, xhr) { 
            notifier.success("Flair deleted successfully.")
            getFlairs();
        },
        error: function (xhr, status, error) {
            notifier.alert(xhr.responseJSON.message);
        }
    })
}
