// Add this js file to ant html file to include jQyuery, Bootstrap, Bootstrap.js and font-awesome icons.
// Requires head.js and jQuery
// Note: the href link uses a relative path.  

$('head').append('<link href="/css/color_scheme.css" rel="stylesheet">');
$(document).ready(() => {
    $('body').prepend(`
    <nav class="navbar navbar-dark navbar-expand-lg" id="header">
    <div class=" container-fluid">
        <a class="navbar-brand" href="#">
            <img src="/assets/reddit.png" alt="" width="30" height="30" class="d-inline-block align-text-top me-1">
            Readdit
        </a>
        <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#readitNavbar" aria-controls="readitNavbar" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div id="readitNavbar" class="collapse navbar-collapse">
            <ul class="navbar-nav mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
            </ul>
            <form class="flex-grow-1 me-5 ms-5">
                <div class="input-group">
                    <input class="form-control bg-light h-100" type="text" placeholder="Search for Post / Subreadit"
                        aria-label="Search">
                    <button class="btn bg-white" type="button" id="headerSearchBtn">
                        <i class="fas fa-search text-white"></i>
                    </button>

                </div>

            </form>

            <ul class="navbar-nav ms-auto">

                <a href="#" id="loginButton" class="btn me-2 px-4 rounded-pill">Login</a>
                <a href="#" id="signUpButton" class="btn me-3 px-4">Sign Up</a>
                <div class="nav-item flex-row d-flex">
                    <i class="far fa-user fa-lg me-1 align-middle"></i>
                    <i class="fas fa-chevron-down fa-sm align-middle"></i>
                </div>

            </ul>

        </div>

    </div>
</nav>
`)
})
