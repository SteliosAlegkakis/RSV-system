/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mainClasses;

import com.google.gson.JsonObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;


public class JSON_Converter {

	/**
	 * Extracts the json data sent from the frontend and returns a string containing them.
	 * @param reader
	 * @return
	 * @throws IOException
	 */
    public String getJSONFromAjax(BufferedReader reader) throws IOException{
		StringBuilder buffer = new StringBuilder();
		String line;
		while ((line = reader.readLine()) != null) {
			buffer.append(line);
		}
		String data = buffer.toString();
		return data;
	}

	/**
	 * Gets the results of a resultSet to json format and returns a string containing them.
	 * @param rs
	 * @return
	 * @throws SQLException
	 */
	public static String getResultsToJSON(ResultSet rs) throws SQLException {
		ResultSetMetaData metadata = rs.getMetaData();
		int columnCount = metadata.getColumnCount();
		JsonObject object = new JsonObject();


		String row = "";
		for (int i = 1; i <= columnCount; i++) {
			String name = metadata.getColumnName(i);
			String value = rs.getString(i);
			object.addProperty(name,value);
		}
		return object.toString();
	}

}
