//document.querySelector("#logout").addEventListener("click",logout);
function logout(){
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.querySelector("#loginForm").style.display = 'flex';
            document.querySelector("#mainpage").style.display = 'none';
            document.querySelector("#ajaxContent").style.display = 'none';
            document.querySelector("#updateForm").style.display = 'none';
            console.log("logout");
        } else if (xhr.status !== 200) {
            console.log("Error at logout");
        }
    }
    let data = "request=logout";
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function createTableFromJSON(data) {
    let html = "<table><tr><th></th><th></th></tr>";
    for (const x in data) {
        let category = x;
        let value = data[x];
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table>";
    return html;

}

function showUser(data){
    let html="<div class='column' style='display:flex;align-items: center;justify-content: center;width: 100%;background-color: white;border-radius: 20px;box-shadow: 0px 0px 18px 0 #0000002c;'>";
    html+="<h3>User Details</h3>";
    html+="<p>Username: "+data.username+"<br>First Name: "+data.firstname+"<br>Last Name: "+data.lastname+
    "<br>Email: "+data.email+"<br>Telephone: "+data.telephone+"<br>Student ID: "+data.student_id+"<br>Student ID Start: "+data.student_id_from_date+
    "<br>Student ID Expiration: "+data.student_id_to_date+"<br>Student Type: "+data.student_type+"<br>University: "+data.university+"<br>Department: "+data.department+
    "<br>Country: "+data.country+"<br>City: "+data.city+"<br>Address: "+data.address+"<br>Birthdate: "+data.birthdate+"<br>Gender: "+data.gender+
    "<br>Personal Page: "+data.personalpage+"</p></div>";
    return html;
}

function getUser() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("ajaxContent").style.display = 'flex';
            document.getElementById("updateForm").style.display = 'none';
            $("#ajaxContent").html(showUser(JSON.parse(xhr.responseText)));
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


function showBooks(books){
    let html = "";
    html+="<div class='column' style='align-items: center;justify-content: center;width: 100%'>"
    for(let i = 0;i < books.length;i++){
        html+="<div class='column' style='align-items: center;justify-content: center;width: 100%;background-color: white;border-radius: 20px;box-shadow: 0px 0px 18px 0 #0000002c;'>" +
            "<h4>"+books[i].title+"</h4>"+
            "<div class='row' style='align-items: center'>" +
            "<img src='"+books[i].photo+"'>" +
            "<p>ISBN: "+books[i].isbn+"<br>Authors: "+books[i].authors+"<br>Genre: "+books[i].genre+
            "<br>URL: <a href='"+books[i].url+"'>"+books[i].url+"</a><br>Pages: "+books[i].pages+"<br>Publication year: "+books[i].publicationyear+
            "</p>"+
            "</div>"
            +"<button class='button'>Borrow</button>"+
            "</div>";
    }
    html+="</div>"
    return html;
}

function readBooks(xhr){
    let i = 0,j = 0,jsonBook="",books = [];
    while(i<xhr.responseText.length-1){
        while (xhr.responseText.at(i)!='|'){
            jsonBook+=xhr.responseText.at(i);
            i++;
            if(i>=xhr.responseText.length) break;
        }
        if(i>=xhr.responseText.length) break;
        books[j] = JSON.parse(jsonBook);
        jsonBook="";
        j++;
        i++;
    }
    return books;
}

function getBooks(genre){
    console.log("getBooks");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let books = readBooks(xhr);
            $("#ajaxContent").html(showBooks(books));
            document.getElementById("ajaxContent").style.display = 'flex';
            document.getElementById("updateForm").style.display = 'none';
        }
    }
    let data = "request=getBooks&genre="+genre;
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showUpdateForm(){
    document.getElementById("ajaxContent").style.display = 'none';
    document.getElementById("updateForm").style.display = 'flex';
}

function getBook(title){
    console.log("getBook");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let book = readBooks(xhr);
            $("#ajaxContent").html(showBooks(book));
            document.getElementById("ajaxContent").style.display = 'flex';
            document.getElementById("updateForm").style.display = 'none';
        }
    }
    let data = "request=getBooks&book_title="+title;
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showUpdateForm(){
    document.getElementById("ajaxContent").style.display = 'none';
    document.getElementById("updateForm").style.display = 'flex';
}

function updateInfo(user_type){
    document.getElementById("ajaxContent").style.display = 'flex';
    document.getElementById("updateForm").style.display = 'none';
    let xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.readyState === 4 && xhr.status === 200)
            $("#ajaxContent").html("<h3 style='color: #00a400'>Updated Successfully!</h3>");
        else if(xhr.status != 200)
            $("#ajaxContent").html("<h3 style='color: red'>Errror!Update failed!</h3>");
    }
    let data = $("#updateForm").serialize();
    data+="&request=update&user_type="+user_type;
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function user_menu(){
    let user_menu = document.getElementById("user_menu");
    if(user_menu.style.display === 'none') user_menu.style.display = 'flex';
    else user_menu.style.display = 'none';
}