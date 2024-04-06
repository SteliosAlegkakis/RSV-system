function login(){
    console.log("login");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 201) {
            getBooks("All");
            document.querySelector("#loginForm").style.display = 'none';
            document.querySelector("#mainpage").style.display = 'flex';
            document.getElementById("wrong_login").style.display = 'none';
            //document.getElementById("ajaxContent").style.display = 'none';
        } else if (xhr.status !== 201) {
            document.getElementById("wrong_login").style.display = 'block';
            console.log("wrong login");
        }
    }
    let data = $('#loginForm').serialize();
    data+="&request=login";
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}
function isLoggedIn(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            getBooks("All");
            document.getElementById("loginForm").style.display = 'none';
            document.getElementById("ajaxContent").style.display = 'flex';
            document.getElementById("mainpage").style.display = 'flex';
        } else if (xhr.status !== 200) {
            document.getElementById("loginForm").style.display = 'flex';
            document.getElementById("mainpage").style.display = 'none';
            document.getElementById("ajaxContent").style.display = 'flex';
        }
    };
    let data = "request=isLoggedIn";
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}
