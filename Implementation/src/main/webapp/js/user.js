let name;
let date;
let start;
let end;
let guests;

/**
 * Shows the room request form
 */
function showRequestForm(){
    let form = document.getElementById('room-request').innerHTML;
    document.getElementById('ajax-content').innerHTML = form;
}

/**
 * Sends a get request to the UserServlet and gets the available rooms, then calls showRooms to display
 * them to ajax-content
 */
function getAvailableRooms(){
    name = document.getElementById('title').value;
    date = document.getElementById('date').value;
    start = document.getElementById('start').value;
    end = document.getElementById('end').value;
    guests = document.getElementById('guests').value;
    console.log(name,date,start,end,guests);
    let xhr = new XMLHttpRequest();
    xhr.onload = function (){
        if(xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            let rooms = jsonArrayReader(xhr);
            showRooms(rooms);
        }
    }
    let request = "request=getRooms&date="+date+"&start="+start+"&end="+end+"&guests="+guests;
    xhr.open('GET', 'UserServlet?'+request);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

/**
 * Displays all the elements in the rooms to the ajax-content
 * @param rooms
 */
function showRooms(rooms) {
    let html = title("Available Rooms");
    for(let i=0; i<rooms.length; i++)
        html += room(rooms[i].room_id, rooms[i].name, rooms[i].floor, rooms[i].size, rooms[i].capacity);
    document.getElementById("ajax-content").innerHTML = html;
}

/**
 * Sends a POST request to the user servlet to submit a new reservation_request
 * @param id the id of the selected room
 */
function bookRoom(id){
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('ajax-content').innerHTML = title("Your request has been submitted successfully.");
        }
        else if(xhr.status!=200){
            document.getElementById('ajax-content').innerHTML = title("Something went wrong. Could not submit the reservation request.");
        }
    }
    let data = "request=reservationRequest&date="+date+"&start="+start+"&end="+end+"&guests="+guests+"&title="+name+"&room_id="+id;
    xhr.open('POST','UserServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send("whatever");
}

function getHistory() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            let reservations = jsonArrayReader(xhr);
            if(reservations.length === 0)
                document.getElementById('ajax-content').innerHTML = title("You haven't made any reservations yet.");
            else
                showHistory(reservations);
        }
        else if(xhr.status != 200) {
            document.getElementById('ajax-content').innerHTML = title("You haven't made any reservations yet.");
        }
    }
    let data = "request=history";
    xhr.open('GET','UserServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showHistory(reservations) {
    let html = title("Reservation History");
    for(let i = 0; i < reservations.length; i++)
        html += history(reservations[i].title, reservations[i].name, reservations[i].date, reservations[i].start, reservations[i].end, reservations[i].status);
    document.getElementById("ajax-content").innerHTML = html;
}
