/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mainClasses;

import com.google.gson.Gson;

import java.sql.*;

public class Admin {


    int emp_id;
    String fname,lname,department,email,phone,password;

    /**
     * Checks if there is an entry in the admin Table in the database with the given email and password
     * and returns an Admin object with the data in this entry or null if the entry is not found.
     * @param email
     * @param password
     * @return an Admin object if an entry with the given parameters exists in the database, null otherwise
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public static Admin dbToAdmin(String email,String password) throws SQLException,ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;

        rs = stmt.executeQuery("SELECT * FROM Admin WHERE email = '" + email + "' AND password='"+password+"'");
        System.out.println("SELECT * FROM Admin WHERE email = '" + email + "' AND password='"+password+"'");
        rs.next();
        String json = JSON_Converter.getResultsToJSON(rs);
        Gson gson = new Gson();
        Admin admin = gson.fromJson(json, Admin.class);

        return admin;
    }

    /**
     * Gets all the entries from the reservation_request table and puts them in json formatted string
     * @return the json string containing the reservations
     */
    public String getReservations() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        String json = "";

        rs = stmt.executeQuery("SELECT * FROM reservation_request WHERE status = 'pending' ");
        System.out.println("SELECT * FROM reservation_request WHERE status = 'pending' ");
        while (rs.next()) {
            json += JSON_Converter.getResultsToJSON(rs)+"|";
        }

        return json;
    }

    public void manageReservation(String result,int r_id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        PreparedStatement stmtIns = con.prepareStatement("UPDATE reservation_request SET status = '"+result+"' WHERE r_id="+r_id+"");
        System.out.println("UPDATE reservation_request SET status = '"+result+"' WHERE r_id="+r_id+"");
        stmtIns.executeUpdate();
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
