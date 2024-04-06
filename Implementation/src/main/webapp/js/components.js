/**
 * Returns a title element with the given title.
 * @param title
 * @returns {string}
 */
function title(title){
    return "<h1 class='title'>"+title+"</h1>"
}

/**
 * Returns html for a room element with the given parameters.
 * @param id
 * @param name
 * @param floor
 * @param size
 * @param capacity
 * @returns {string}
 */
function room(id,name,floor,size,capacity) {

    return "<div class='room'>"+
                "<div class='details'>"+
                    "<h1>"+name+"</h1>"+
                    "<div class='content'>"+
                        "<p>floor : "+floor+"</p>"+
                        "<p>size : "+size+" sqrm</p>"+
                        "<p>capacity : "+capacity+" guests</p>"+
                    "</div>"+
                "</div>"+
                "<div class='select-room' onclick=bookRoom("+id+")>"+
                    "<p>select</p>"+
                "</div>"+
            "</div>"

}

/**
 * Returns html for a history element with the given parameters
 * @param title
 * @param room
 * @param date
 * @param start
 * @param end
 * @param status
 * @returns {string}
 */
function history(title,room,date,start,end,status){

    return "<div class='history'>"+
                "<div class='details'>"+
                    "<h1>"+title+"</h1>"+
                    "<div class='content'>"+
                        "<p>Room : "+room+"</p>"+
                        "<p>Date : "+date+"</p>"+
                        "<p>Time : "+start+":00 - "+end+":00</p>"+
                        "<p>Status : "+status+"</p>"+
                    "</div>"+
                "</div>"+
            "</div>"

}

/**
 * Returns html for a reservation request element with the given parameters.
 * @param id
 * @param title
 * @param room
 * @param date
 * @param start
 * @param end
 * @returns {string}
 */
function request(id,title,room,date,start,end){

    return "<div class='request'>"+
                "<div class='details'>"+
                    "<h1>"+title+"</h1>"+
                    "<div class='content'>"+
                        "<p>Room : "+room+"</p>"+
                        "<p>Date : "+date+"</p>"+
                        "<p>Time : "+start+":00 - "+end+":00</p>"+
                    "</div>"+
                "</div>"+
                "<div class='request-buttons'>"+
                    "<div class='request-decline' onclick=manageReservation("+id+",'Declined')>"+
                        "<p>decline</p>"+
                    "</div>"+
                    "<div class='request-confirm' onclick=manageReservation("+id+",'Confirmed')>"+
                        "<p>confirm</p>"+
                    "</div>"+
                "</div>"+
            "</div>"

}

/**
 * Returns html for a profile element with the given parameters.
 * @param fname
 * @param lname
 * @param department
 * @param email
 * @param phone
 * @param servletName
 * @returns {string}
 */
function profile(fname,lname,department,email,phone,servletName){
    return "<div class='profile'>"+
        "<h1 class='title'>Profile</h1>"+
        "<div class='output-element'>"+
            "<label>Name</label>"+
            "<p>"+fname+"</p>"+
        "</div>"+
        "<div class='output-element'>"+
        "   <label>Surname</label>"+
            "<p>"+lname+"</p>"+
        "</div>"+
        "<div class='output-element'>"+
            "<label>Department</label>"+
            "<p>"+department+"</p>"+
        "</div>"+
        "<div class='output-element'>"+
            "<label>Email</label>"+
            "<p>"+email+"</p>"+
        "</div>"+
        "<div class='output-element'>"+
            "<label>Phone</label>"+
            "<p>"+phone+"</p>"+
        "</div>"+
        "<button class='submit' onclick=logout('"+servletName+"')>" +
            "<p>Logout</p>"+
        "</button>"+
        "</div>"

}

/**
 * Gets a string with multiple json objects, parses each one of them, puts them into an array and returns it.
 * @param xhr
 * @returns {*[]}
 */
function jsonArrayReader(xhr){
    console.log("jsonarrayreader")
    let i = 0,j = 0,jsonObject="",objects = [];
    while(i<xhr.responseText.length-1){
        while (xhr.responseText.at(i)!='|'){
            jsonObject+=xhr.responseText.at(i);
            i++;
            if(i>=xhr.responseText.length) break;
        }
        if(i>=xhr.responseText.length) break;
        objects[j] = JSON.parse(jsonObject);
        jsonObject="";
        j++;
        i++;
    }
    return objects;
}