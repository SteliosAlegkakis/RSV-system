
function showBooksGuest(books){
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
            +"</div>";
    }
    html+="</div>"
    return html;
}


function getBooksGuest(genre){
    console.log("getBooks");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let books = readBooks(xhr);
            $("#ajaxContent").html(showBooksGuest(books));
            document.getElementById("ajaxContent").style.display = 'flex';
            document.getElementById("links").style.display='none';
        }
    }
    let data = "request=getBooks&genre="+genre;
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function getBookGuest(title){
    console.log("getBook");
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let book = readBooks(xhr);
            $("#ajaxContent").html(showBooksGuest(book));
            document.getElementById("ajaxContent").style.display = 'flex';
        }
    }
    let data = "request=getBooks&book_title="+title;
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showLinks(){
    let links = document.getElementById("links");
    let ajax = document.getElementById("ajaxContent");
    if(links.style.display==='none'){
        links.style.display='flex';
        ajax.style.display='none';
    }
    else {
        links.style.display='none';
        ajax.style.display='flex';
    }
}