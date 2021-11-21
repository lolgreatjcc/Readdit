const baseUrl = "http://localhost:3000"
//const baseUrl = "https://readdit-backend.herokuapp.com"

let notifier = new AWN({icons:{enabled:false}})

$(document).ready(function () {
    localStorage.removeItem("subreaddit_id");
    checkOwner();
})

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
                console.log(JSON.stringify(data[i]));
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
            getFlairs();
        },
        error: function (xhr, status, error) {
            notifier.alert(xhr.responseJSON.message);
        }
    });

};

function createFlair(){
    var fk_subreaddit_id = localStorage.getItem("subreaddit_id");
    var user_id = JSON.parse(localStorage.getItem("userInfo")).user_id;
    var token = localStorage.getItem("token");
    var flair_name = $('#flair_name').val();
    var flair_colour = $('#flair_colour').val();
    var data = JSON.stringify({"flair_name":flair_name,"flair_colour":flair_colour,
                                "fk_subreaddit_id":fk_subreaddit_id,"user_id":user_id});
    console.log(data);
    notifier.info("Creating Flair...")
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
            console.log(error);
        }
    })
}

function deleteFlair(flair_id){
    var fk_subreaddit_id = localStorage.getItem("subreaddit_id");
    var user_id = JSON.parse(localStorage.getItem("userInfo")).user_id;
    var data = JSON.stringify({"fk_subreaddit_id":fk_subreaddit_id, "user_id":user_id});
    notifier.info("Deleting Flair...")
    var token = localStorage.getItem("token");
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
