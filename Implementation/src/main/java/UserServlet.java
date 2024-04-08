import com.google.gson.Gson;
import mainClasses.JSON_Converter;
import mainClasses.User;

import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.*;

@WebServlet(name = "UserServlet", value = "/UserServlet")
public class UserServlet extends HttpServlet {
    User loggedIn = null;
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        System.out.println("doGet");
        String req = request.getParameter("request");
        if(req.equals("login")) login(request,response);
        else if(req.equals("logout")) logout(request,response);
        else if(req.equals("profile")) profile(request,response);
        else if(req.equals("getRooms")) getRooms(request,response);
        else if(req.equals("history")) getHistory(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doPost");
        String req = request.getParameter("request");
        if(req.equals("register")) register(request,response);
        else if(req.equals("reservationRequest")) reservationRequest(request,response);
    }

    /**
     * Gets the json from the frontend and calls addNewUser with this json to create a new entry at the
     * user table.
     * @param request
     * @param response
     * @throws IOException
     */
    private void register(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JSON_Converter jc = new JSON_Converter();
        String json = jc.getJSONFromAjax(request.getReader());
        try {
            User.addNewUser(json);
            response.setStatus(200);
        } catch (ClassNotFoundException e) {
            System.err.println("ClassNotFoundException at register");
            response.setStatus(500);
        } catch (SQLException e) {
            System.err.println("SQLException at register");
            response.setStatus(500);
        }
    }

    /**
     * Checks if there is an entry with given email and password in the user table and if so,
     * creates the loggedIn user and puts some parameters to the session.
     * @param request
     * @param response
     */
    public void login(HttpServletRequest request, HttpServletResponse response){
        System.out.println("login");
        HttpSession session=request.getSession();
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            User user = User.dbToUser(email, password);
            if(user == null) response.setStatus(403);
            else {
                loggedIn = user;
                session.setAttribute("emp_id",user.getEmp_id());
                session.setAttribute("loggedIn",email);
                System.out.println("logged in:"+session.getAttribute("loggedIn"));
                int activeUsers=0;
                if(request.getServletContext().getAttribute("activeUsers")!=null){
                    activeUsers=(int) request.getServletContext().getAttribute("activeUsers");
                    request.getServletContext().setAttribute("activeUsers",activeUsers+1);
                    System.out.println("activeUsers: "+request.getServletContext().getAttribute("activeUsers"));
                }
                else{
                    request.getServletContext().setAttribute("activeUsers",1);
                    System.out.println("active users:"+request.getServletContext().getAttribute("activeUsers"));
                }
                response.setStatus(200);
            }
        }
        catch (SQLException e) {
            System.err.println("SQLException in login");
            response.setStatus(400);
        }
        catch (ClassNotFoundException e) {
            System.err.println("ClassNotFoundException in login");
            response.setStatus(500);
        }
    }

    /**
     * Invalidates the session and puts null to the loggedIn user
     * @param request
     * @param response
     */
    public void logout(HttpServletRequest request, HttpServletResponse response){
        System.out.println("logout");
        HttpSession session = request.getSession();
        System.out.println(session.getAttribute("loggedIn"));
        if(session.getAttribute("loggedIn")!=null){
            loggedIn = null;
            session.invalidate();
            int activeUsers=(int) request.getServletContext().getAttribute("activeUsers");
            request.getServletContext().setAttribute("activeUsers",activeUsers-1);
            response.setStatus(200);
        }
        else{
            response.setStatus(403);
        }
    }

    /**
     * Converts the loggedIn user to json string and sends it to the frontend.
     * @param request
     * @param response
     */
    public void profile(HttpServletRequest request, HttpServletResponse response){
        System.out.println("profile");
        try {
            PrintWriter out = response.getWriter();
            Gson gson = new Gson();
            String json = gson.toJson(loggedIn, User.class);
            out.println(json);
            response.setStatus(200);
        } catch (IOException e) {
            System.err.println("Error at profile");
            response.setStatus(500);
            throw new RuntimeException(e);
        }
    }

    /**
     * Calls getRooms with the parameters date,start,end and guests given from the fronted and sends back the
     * results.
     * @param request
     * @param response
     */
    public void getRooms(HttpServletRequest request, HttpServletResponse response){
        System.out.println("getRooms");
        try{
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date date = format.parse(request.getParameter("date"));
            int start = Integer.parseInt(request.getParameter("start"));
            int end = Integer.parseInt(request.getParameter("end"));
            int guests = Integer.parseInt(request.getParameter("guests"));
            String json = User.getRooms(date,start,end,guests);
            PrintWriter out = response.getWriter();
            out.println(json);
            response.setStatus(200);
        }
        catch (SQLException e) {System.err.println("SQLException in getRooms");}
        catch (ClassNotFoundException e) {System.err.println("ClassNotFoundException in getRooms");}
        catch (IOException e) {System.err.println("IOException in getRooms");}
        catch (ParseException e) {System.err.println("ParseException in getRooms");}
    }

    /**
     * Calls reservationRequest to create a new entry in the reservation_request table with the given
     * parameters from the frontend.
     * @param request
     * @param response
     */
    public void reservationRequest(HttpServletRequest request, HttpServletResponse response){
        System.out.println("reservationRequest");

        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            Date date = format.parse(request.getParameter("date"));
            int start = Integer.parseInt(request.getParameter("start"));
            int end = Integer.parseInt(request.getParameter("end"));
            int room_id = Integer.parseInt(request.getParameter("room_id"));
            int guests = Integer.parseInt(request.getParameter("guests"));
            String title = request.getParameter("title");
            loggedIn.reservationRequest(date,start,end,room_id,title,guests);
        } catch (ParseException e) { System.err.println("ParseException at reservationRequest");}
        catch (SQLException e) { System.err.println("SQLException at reservationRequest");}
        catch (ClassNotFoundException e) { System.err.println("ClassNotFoundException at reservationRequest"); }
    }

    public void getHistory(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("getHistory");
        try{
            String json = "";
            if(loggedIn != null) json = loggedIn.getHistory();
            PrintWriter out = response.getWriter();
            out.println(json);
            response.setStatus(200);
        }
        catch (SQLException e) {System.err.println("SQLException in getHistory");}
        catch (ClassNotFoundException e) {System.err.println("ClassNotFoundException in getHistory");}
        catch (IOException e) {System.err.println("IOException in getHistory");}
    }
}
