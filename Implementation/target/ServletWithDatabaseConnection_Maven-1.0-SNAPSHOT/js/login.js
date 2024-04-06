/**
 * Sends a POST request to the USerServlet to register a new user. On success, redirects to the login page.
 * On fail shows an error message to the register form.
 */
function register(){
    console.log('register');
    let myForm = document.getElementById('register-form');
    let formData = new FormData(myForm);
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            window.location.replace("http://localhost:8080/ServletWithDatabaseConnection_Maven_war_exploded/");
            console.log('success');
        }
        else if(xhr.status!=200){
            document.getElementById("register-error").style.display = 'flex';
            console.log('fail');
        }
    }
    const json = {};
    formData.forEach((value, key) => (json[key] = value));
    let data = "request=register";
    xhr.open('POST','UserServlet?request=register');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send(JSON.stringify(json));
    console.log('json: '+JSON.stringify(json));
}


/**
 * Sends a GET request to the servlet with name ServletName with the parameters email and password. On success
 * redirects to the main page. On fail displays an error message to the login form.
 * @param servletName the name of the servlet to send the request
 */
function login(servletName){
    console.log("login");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if(servletName === 'UserServlet')
                window.location.replace("http://localhost:8080/ServletWithDatabaseConnection_Maven_war_exploded/user.html");
            else
                window.location.replace("http://localhost:8080/ServletWithDatabaseConnection_Maven_war_exploded/admin.html");
        } else if (xhr.status !== 200) {
            document.getElementById("wrong-login").style.display = 'block';
            console.log("wrong login");
        }
    }
    let data = $('#login-form').serialize();
    data+="&request=login";
    xhr.open('GET', servletName+'?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}


/**
 * Sends a GET request to the given servlet, gets the profile information of the logged-in user and displays
 * them to the ajax-content using the profile component.
 * @param servletName the name of the servlet to send the request
 */
function showProfile(servletName){
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let user = JSON.parse(xhr.responseText);
            let html = profile(user.fname,user.lname,user.department,user.email,user.phone,servletName);
            document.getElementById("ajax-content").innerHTML = html;
        } else if (xhr.status !== 200) {
            console.log("Error at profile");
        }
    }
    xhr.open('GET', servletName+'?&request=profile');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

/**
 * Sends a GET request to the given servlet to perform the logout and redirects to the login page.
 * @param servletName the name of the servlet to send the request
 */
function logout(servletName){
    console.log("logout");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200)
            window.location.replace("http://localhost:8080/ServletWithDatabaseConnection_Maven_war_exploded/index.html");
        else if (xhr.status !== 200)
            console.log("Error at logout");

    }
    xhr.open('GET', servletName+'?&request=logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}