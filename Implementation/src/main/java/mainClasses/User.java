package mainClasses;

import com.google.gson.Gson;

import java.sql.*;
import java.util.ArrayList;
import java.util.Date;

public class User {

    int emp_id;
    String fname,lname,department,email,phone,password;

    /**
     * Checks if there is an entry in the user Table in the database with the given email and password
     * and returns a User object with the data in this entry or null if the entry is not found.
     * @param email
     * @param password
     * @return an Admin object if an entry with the given parameters exists in the database, null otherwise
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public static User dbToUser(String email,String password) throws SQLException,ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;

        rs = stmt.executeQuery("SELECT * FROM user WHERE email = '" + email + "' AND password='"+password+"'");
        System.out.println("SELECT * FROM User WHERE email = '" + email + "' AND password='"+password+"'");
        rs.next();
        String json = JSON_Converter.getResultsToJSON(rs);
        Gson gson = new Gson();
        User user = gson.fromJson(json, User.class);

        return user;

    }

    /**
     * Takes a json String containing the data for a user and adds a new entry in the
     * User table with this data.
     * @param json
     * @throws ClassNotFoundException
     * @throws SQLException
     */
    public static void addNewUser(String json) throws ClassNotFoundException,SQLException {
        //converts json user data to User object
        Gson gson = new Gson();
        User user = gson.fromJson(json, User.class);
        //connects to database
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        //execute insert query
        String insertQuery = "INSERT INTO "
                + " user (fname,lname,department,email,phone,password)"
                + " VALUES ("
                + "'" + user.getFname() + "',"
                + "'" + user.getLname() + "',"
                + "'" + user.getDepartment() + "',"
                + "'" + user.getEmail() + "',"
                + "'" + user.getPhone() + "',"
                + "'" + user.getPassword() + "'"
                + ")";
        System.out.println(insertQuery);
        stmt.executeUpdate(insertQuery);
        System.out.println("# The user was successfully added in the database.");
        stmt.close();
    }

    /**
     * Finds from the reservation_request table of the database all the rooms that are not available based on the given
     * parameters, subtracts them from the total rooms and returns a json string with all the rooms that are available.
     * @param date
     * @param start
     * @param end
     * @param guests
     * @return a json string containing all the available rooms
     * @throws ClassNotFoundException
     * @throws SQLException
     */
    public static String getRooms(Date date, int start, int end, int guests) throws ClassNotFoundException,SQLException{

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Integer> unavailable = new ArrayList<Integer>(); //will contain the ids of all the unavailable rooms
        ArrayList<Room> available = new ArrayList<Room>();
        String json = "";

        ResultSet rs;
        try {

            //get all the unavailable rooms
            String d = (date.getYear()+1900)+"-"+(date.getMonth()+1)+"-"+date.getDate();
            //the cases of overlapping times between two reservations
            String case1 = "(start<='"+start+"' AND end>'"+start+"')";
            String case2 = "(start<'"+end+"' AND end>='"+end+"')";
            String case3 = "(start<='"+start+"' AND end>='"+end+"')";
            String case4 = "(start>'"+start+"' AND end<'"+end+"')";
            //execute the query
            rs = stmt.executeQuery("SELECT room_id FROM reservation_request WHERE date = '" + d + "' AND ("+case1+" OR "+case2+" OR "+case3+" OR "+case4+") AND status='Confirmed'");
            System.out.println("# SELECT room_id FROM reservation_request WHERE date = '" + d + "' AND ("+case1+" OR "+case2+" OR "+case3+" OR "+case4+") AND status='Confirmed'");
            //add all the unavailable rooms to the arraylist
            while (rs.next()) {
                unavailable.add(Integer.parseInt(rs.getString("room_id")));
            }

            // puts all the rooms from the db to the arraylist allRooms
            rs = stmt.executeQuery("SELECT * FROM room");
            while (rs.next()) {
                Gson gson = new Gson();
                Room room = gson.fromJson(JSON_Converter.getResultsToJSON(rs), Room.class);
                available.add(room);
            }

            //remove the unavailable rooms
            int i=0;
            boolean removed = false;
            while ( i < available.size() ){
                for (int j=0; j<unavailable.size(); j++){
                    if(available.get(i).getRoom_id() == unavailable.get(j)){
                        available.remove(i);
                        removed = true;
                        break;
                    }
                }
                if(removed){
                    removed=false;
                    continue;
                }
                if(available.get(i).getCapacity() < guests){
                    available.remove(i);
                    continue;
                }
                i++;
            }

            System.out.println("Avilable Rooms :");
            for(i=0; i<available.size(); i++){
                Gson gson = new Gson();
                String room = gson.toJson(available.get(i), Room.class);
                json += room + " | ";
                System.out.println(room);
            }
            System.out.println(json);
            return json;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    /**
     * Creates a new entry at the reservation_request table with the given parameters
     * @param date
     * @param start
     * @param end
     * @param room_id
     * @param title
     * @param guests
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public void reservationRequest(Date date, int start, int end, int room_id, String title, int guests) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        //execute insert query
        String d = (date.getYear()+1900)+"-"+(date.getMonth()+1)+"-"+date.getDate();
        String insertQuery = "INSERT INTO "
                + " reservation_request (emp_id,status,room_id,title,date,start,end,guests)"
                + " VALUES ("
                + "'" + this.getEmp_id() + "',"
                + "'pending',"
                + "'" + room_id + "',"
                + "'" + title + "',"
                + "'" + d + "',"
                + "'" + start + "',"
                + "'" + end + "',"
                + "'" + guests + "'"
                + ")";
        System.out.println(insertQuery);
        stmt.executeUpdate(insertQuery);
        stmt.close();
    }

    public int getEmp_id() {
        return emp_id;
    }

    public void setEmp_id(int emp_id){
        this.emp_id = emp_id;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

}
