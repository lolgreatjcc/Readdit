// Add this js file to ant html file to include jQyuery, Bootstrap, Bootstrap.js and font-awesome icons.
// Requires head.js and jQuery
// Note: the href link uses a relative path.  

$('head').append(`
    <link href="/css/color_scheme.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/notification.css"></link>
    <script src="/js/notification.js"></script>
`);
$(document).ready(() => {
    var login;
    try {
        var userData = localStorage.getItem('userInfo');
        var token = localStorage.getItem("token")
        // userData = userData.slice(1,-1);

        var userJsonData = JSON.parse(userData);
        var role = userJsonData.fk_user_type_id;
        console.log("Logged in")
        login = true;
    } catch (error) {
        console.log("Not logged in");
        login = false;
    }

    var prependstr = `
    <script>
        function runSearch(){
            var query = $('#Search').val();
            window.location.href = "/search.html?query=" + query;
        }  


    </script>
    <nav class="navbar navbar-dark navbar-expand-lg" id="header">
    <div class=" container-fluid">
        <a class="navbar-brand" href="/">
            <img src="/assets/reddit.png" alt="" width="30" height="30" class="d-inline-block align-text-top me-1">
            Readdit
        </a>
        <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#readitNavbar" aria-controls="readitNavbar" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div id="readitNavbar" class="collapse navbar-collapse">
            <form class="flex-grow-1 me-5 ms-5 mb-0" action="javascript:runSearch()">
                <div class="input-group">
                    <input class="form-control bg-light h-100" type="text" placeholder="Search for Post / Subreadit"
                        aria-label="Search" id="Search">
                    <button class="btn bg-white" type="button" id="headerSearchBtn" onclick="runSearch()">
                        <i class="fas fa-search text-white"></i>
                    </button>

                </div>

            </form>
        `

    if (!login) {
        prependstr += `
                                <ul class="navbar-nav ms-auto">

                                    <a href="/login.html" id="loginButton" class="btn me-2 px-4 rounded-pill">Login</a>
                                    <a href="/addUser.html" id="signUpButton" class="btn me-3 px-4">Sign Up</a>
                                </ul>
                        `;
    }
    else {
        prependstr += `
        <ul class="navbar-nav ms-auto">
            <a href="/profile" id="profileButton" class="btn me-2 px-4 rounded-pill ">Profile</a>
            <a href="/login.html" onclick="localStorage.clear()" id="signUpButton" class="btn me-3 px-4">Log Out</a>
        </ul>
`;
    }

    prependstr += `
                        </div>

                    </div>
                </nav>
                `


    $('body').prepend(prependstr);
})
