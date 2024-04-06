import com.google.gson.Gson;
import mainClasses.Admin;
import mainClasses.User;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "AdminServlet", value = "/AdminServlet")
public class AdminServlet extends HttpServlet {

    Admin loggedIn = null;
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doGet Admin");
        String req = request.getParameter("request");
        if(req.equals("login")) login(request,response);
        else if(req.equals("logout")) logout(request,response);
        else if(req.equals("profile")) profile(request,response);
        else if(req.equals("getReservations")) getReservations(request,response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doPost Admin");
        manageReservation(request,response);
    }

    /**
     * Checks if there is an entry with given email and password in the admin table and if so,
     * creates the loggedIn admin and puts some parameters to the session.
     * @param request
     * @param response
     */
    public void login(HttpServletRequest request, HttpServletResponse response){
        System.out.println("login");
        HttpSession session=request.getSession();
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            Admin admin = Admin.dbToAdmin(email, password);
            if(admin == null) response.setStatus(403);
            else {
                loggedIn = admin;
                session.setAttribute("emp_id",admin.getEmp_id());
                session.setAttribute("loggedIn",email);
                session.setAttribute("password",password);
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
            System.out.println("SQLException in login");
            response.setStatus(400);
        }
        catch (ClassNotFoundException e) {
            System.out.println("ClassNotFoundException in login");
            response.setStatus(500);
        }
    }


    /**
     * Invalidates the session and puts null to the loggedIn Admin
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
     * Converts the loggedIn admin to json string and sends it to the frontend.
     * @param request
     * @param response
     */
    public void profile(HttpServletRequest request, HttpServletResponse response){
        System.out.println("profile");
        try {
            PrintWriter out = response.getWriter();
            Gson gson = new Gson();
            String json = gson.toJson(loggedIn, Admin.class);
            out.println(json);
            response.setStatus(200);
        } catch (IOException e) {
            System.out.println("Error at profile");
            response.setStatus(500);
            throw new RuntimeException(e);
        }
    }

    /**
     * Calls getReservations and sends the results of it to the frontend.
     * @param request
     * @param response
     */
    public void getReservations(HttpServletRequest request, HttpServletResponse response){
        System.out.println("getReservations");
        try {
            PrintWriter out = response.getWriter();
            out.println(loggedIn.getReservations());
            System.out.println(loggedIn.getReservations());
            response.setStatus(200);
        } catch (SQLException e) { System.err.println("SQLException at getReservations"); }
        catch (ClassNotFoundException e) { System.err.println("ClassNotFoundException at getReservation");}
        catch (IOException e) { System.out.println("IOException at getReservation");}
    }

    /**
     * Calls manageReservation to update the entry in the reservation_request table with the given r_id
     * and result.
     * @param request
     * @param response
     */
    public void manageReservation(HttpServletRequest request, HttpServletResponse response){
        System.out.println("manageReservation");
        int r_id = Integer.parseInt(request.getParameter("r_id"));
        String result = request.getParameter("result");
        try {
            loggedIn.manageReservation(result, r_id);
            response.setStatus(200);
        } catch (SQLException e) {
            System.err.println("SQLException at manageReservation");
            response.setStatus(500);
        } catch (ClassNotFoundException e) {
            System.err.println("ClassNotFoundException at mangeReservation");
            response.setStatus(500);
        }
    }
}
