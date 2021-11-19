const baseUrl = ["http://localhost:3000", "http://localhost:3001"]
//const baseUrl = ["https://readdit-backend.herokuapp.com","https://readdit-sp.herokuapp.com"]

function loadSubreadditInfo(subreaddit_id) {
    $('#load').html("Loading Info...");

    // call the web service endpoint
    $.ajax({
        url: `${baseUrl[0]}/r/subreaddit/` + subreaddit_id,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var subreaddit = data;
            // compile the data that the card needs for it's creation

            document.getElementById("name").value = subreaddit.subreaddit_name;
            document.getElementById("description").value = subreaddit.subreaddit_description;

            $('#load').html("");
        },


        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
            $('#loadingText').html("<h6 class='text-danger'>ERROR LOADING!</h6>");
            if (xhr.status == 403) {
                $('#msg').html('F̵̤̈ò̵̬r̶͙̃b̴͖͛i̶̲͒d̸̞̓d̵̮́e̷̬̐n̵̻̄');
            }
        }
    });
};


$(document).ready(function () {
    try {
        var userData = localStorage.getItem('userInfo');
        var token = localStorage.getItem("token")
        // userData = userData.slice(1,-1);

        var userJsonData = JSON.parse(userData);
        var role = userJsonData.fk_user_type_id;

        var tmpToken = localStorage.getItem('token');

        if (role != 2) {
            alert("Unauthorized User!");
            window.location.assign(`${baseUrl[1]}/home.html`);
        }
    } catch (error) {
        alert("Unauthenticated User!");
        window.location.assign(`${baseUrl[1]}/login.html`);
    }
    
    var queryParams = new URLSearchParams(window.location.search);
    console.log("---------Query Parameters---------");
    console.log("Query Param (source): " + window.location.search);
    console.log("Query Param (extracted): " + queryParams);

    var subreaddit_id = queryParams.get("id");

    loadSubreadditInfo(subreaddit_id);

    $("#update").click(function () {
        var name = $('#name').val();
        var description = $('#description').val();

        const requestBody = {
            subreaddit_name: name,
            subreaddit_description: description
        };

        console.log(requestBody);

        // axios.put(`https://readdit-backend.herokuapp.comr/subreaddit/` + subreaddit_id,requestBody)

        axios.put(`${baseUrl[0]}/r/subreaddit/` + subreaddit_id, requestBody)
            .then(response => {
                $('#load').html('Subreaddit updated successfully!');
            })
            .catch(error => {
                $('#load').html('Error updating Subreaddit');
            })
    });

    $("#Return").click(function () {
        window.location.assign(`${baseUrl[1]}/admin/ManageSubs.html`);
    });
})
