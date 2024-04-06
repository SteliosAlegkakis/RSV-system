function login(){
    console.log("login");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 202) {
            document.querySelector("#loginForm").style.display = 'none';
            document.querySelector("#mainpage").style.display = 'flex';
            document.getElementById("wrong_login").style.display = 'none';
            //document.getElementById("ajaxContent").style.display = 'none';
        } else if (xhr.status !== 202) {
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

function showLibrarian(data){
    let html="<div class='column' style='display:flex;align-items: center;justify-content: center;width: 100%;background-color: white;border-radius: 20px;box-shadow: 0px 0px 18px 0 #0000002c;'>";
    html+="<h3>Library Details</h3>";
    html+="<p>Username: "+data.username+"<br>First Name: "+data.firstname+"<br>Last Name: "+data.lastname+
        "<br>Email: "+data.email+"<br>Telephone: "+data.telephone+"<br>Birth Date: "+data.birthdate+"<br>Gender: "+data.gender+
        "<br>Country: "+data.country+"<br>City: "+data.city+"<br>Address: "+data.address+"<br>Birthdate: "+data.birthdate+"<br>Gender: "+data.gender+
        "<br>Library Name: "+data.libraryname+"<br>Library info: <p>"+data.libraryinfo+"</p><br>Telephone: "+data.telephone+
        "<br>Library Page: "+data.personalpage+"</p></div>";
    return html;
}

function getLibrarian() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("ajaxContent").style.display = 'flex';
            document.getElementById("updateForm").style.display = 'none';
            $("#ajaxContent").html(showLibrarian(JSON.parse(xhr.responseText)));
        } else if (xhr.status !== 200) {
            $("#ajaxContent").html("User not exists or incorrect password");
        }
    };
    //let data = $('#loginForm').serialize();
    let data="request=getUser";
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showAdd(){
    let add = document.getElementById("addForm");
    let ajax = document.getElementById("ajaxContent");
    if(add.style.display==='none'){
        ajax.style.display='none';
        add.style.display='flex';
    }
    else add.style.display='none';
}

function insertBook(){
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        document.getElementById("ajaxContent").style.display='flex';
        document.getElementById("addForm").style.display='none';
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxContent").html("<h3 style='color: #00a400'>Book Added Successfully!</h3>");
            console.log("success");
        }
        else if(xhr.status!=200){
            $("#ajaxContent").html("<h3 style='color: red'>Failed To Add Book!</h3>");
            console.log("fail");
        }
    }
    let data = $('#addForm').serialize()+"&request=insert_book";
    xhr.open('GET','MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showAvailability(){
    let form = document.getElementById("editAvailability");
    let ajax = document.getElementById("ajaxContent");
    if(form.style.display==='none'){
        form.style.display='flex';
        ajax.style.display='none';
    }
    else form.style.display='none';
}