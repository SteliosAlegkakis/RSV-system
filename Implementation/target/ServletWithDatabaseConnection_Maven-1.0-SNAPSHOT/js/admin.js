/**
 * Sends a GET request to the AdminServlet to get all the reservations with pending status and calls
 * showReservations to display the results.
 */
function getReservations() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function (){
        if(xhr.readyState === 4 && xhr.status === 200) {
            let reservations = jsonArrayReader(xhr);
            showReservations(reservations);
        }
    }
    xhr.open('GET', 'AdminServlet?request=getReservations');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

/**
 * Displays all the elements in the reservations array to ajax-content using the request component, if there are
 * no elements in the array, displays a message.
 * @param reservations the array with the reservations.
 */
function showReservations(reservations){
    let html = "empty";
    if(reservations.length === 0) {
        html = title("There are no pending reservations.");
        document.getElementById('ajax-content').innerHTML = html;
    }
    else{
        console.log("else");
        let html = title("Pending Reservations");
        for(let i = 0; i < reservations.length; i++) {
            html += request(reservations[i].r_id,reservations[i].title,reservations[i].room_id,reservations[i].date,reservations[i].start,reservations[i].end);
        }
        document.getElementById('ajax-content').innerHTML = html;
    }
}

/**
 * Sends a POST request to the AdminServlet to change the status of a reservation to Confirmed or Declined.
 * @param r_id the id of the reservation to be managed
 * @param result Confirmed or Declined
 */
function manageReservation(r_id, result){
    let xhr = new XMLHttpRequest();
    xhr.onload = function (){
        if(xhr.readyState === 4 && xhr.status === 200) {
            getReservations();
        }
    }
    let data = "r_id="+r_id+"&result="+result;
    xhr.open('POST', 'AdminServlet?'+data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

