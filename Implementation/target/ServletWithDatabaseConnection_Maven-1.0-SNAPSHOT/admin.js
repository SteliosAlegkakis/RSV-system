function adminLogin(){
    console.log("adminLogin");

    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.querySelector("#admin_login").style.display = 'none';
            document.querySelector("#admin_page").style.display = 'flex';
            document.getElementById("wrong_admin_login").style.display = 'none';
        } else if (xhr.status !== 200) {
            document.getElementById("wrong_admin_login").style.display = 'block';
            console.log("wrong login");
        }
    }
    let data =$('#admin_login').serialize();
    data+="&request=admin_login"
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function parseUsers(xhr){
    let i = 0,j = 0,jsonUser="",users = [];
    while(i<xhr.responseText.length-1){
        while (xhr.responseText.at(i)!='|'){
            jsonUser+=xhr.responseText.at(i);
            i++;
            if(i>=xhr.responseText.length) break;
        }
        if(i>=xhr.responseText.length) break;
        users[j] = JSON.parse(jsonUser);
        jsonUser="";
        j++;
        i++;
    }

    let html = "";
    html+="<div class='column' style='align-items: center;justify-content: center;width: 100%'>"
    for(let i = 0;i < users.length;i++){
        html+="<div class='column' id='"+users[i].username+"' style='align-items: center;justify-content: center;width: 100%;background-color: white;border-radius: 20px;box-shadow: 0px 0px 18px 0 #0000002c;'>" +
            "<div class='row' style='align-items: center'>" +
            "<p>username : "+users[i].username+"        First Name : "+users[i].firstname+"<br>Last Name: "+users[i].lastname+"     Email: "+users[i].email+
            "</p>"+
            "</div>" +
            "<button class='button' style='color: red' onclick=\"deleteUser('"+users[i].username+"')\">Delete</button>" +
            "</div>";
    }
    html+="</div>"
    return html;
}

function showUsers(){
    console.log("showUsers");
    document.getElementById("charts").style.display='none';

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("adminContent").style.display = 'flex';
            document.getElementById("adminContent").innerHTML=parseUsers(xhr);
        }
    };
    let data="&request=getUsers";
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();

}

function showStatistics(){
    console.log("showStatistics");
    document.getElementById("adminContent").style.display='none'
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let json = JSON.parse(xhr.responseText)
            console.log(json);
            document.getElementById("charts").style.display='flex';
            StudentsChart(json.undergraduate,json.postgraduate,json.phd);
            BooksChart(json.adventure,json.fantasy,json.fantasy_novel,json.romance,json.romance_novel,json.novel,json.sports);
        }
    };
    let data="&request=getStatistics";
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function StudentsChart(under,post,phd) {
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'users'],
            ['Undergraduate',     under],
            ['Postgraduate',      post],
            ['Phd',  phd]
        ]);

        var options = {
            title: 'Users',
            is3D: true,
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
        chart.draw(data, options);
    }
}

function BooksChart(adventure,fantasy,fantasy_novel,romance,romance_novel,novel,sports) {
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'books'],
            ['Adventure',     adventure],
            ['Fantasy',      fantasy],
            ['Fantasy, Novel',  fantasy_novel],
            ['Romance', romance],
            ['Romance, Novel' , romance_novel],
            ['Novel' , novel],
            ['Sports', sports]
        ]);

        var options = {
            title: 'Books',
            is3D: true,
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart_3d1'));
        chart.draw(data, options);
    }
}


function deleteUser(username){
    console.log("deleteUser");

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("adminContent").style.display = 'flex';
            //document.getElementById("adminContent").innerHTML="<h3 style='color: #00a400'>User Deleted</h3>"
            document.getElementById(username).style.display='none';
            document.getElementById("delete").style.display = 'none';
        } else if (xhr.status !== 200) {
            document.getElementById("delete_fail").style.display='block';
            document.getElementById("adminContent").style.display = 'none';
        }
    };
    //let data = $('#delete').serialize();
    let data="&request=delete&username="+username;
    xhr.open('GET', 'MyServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

