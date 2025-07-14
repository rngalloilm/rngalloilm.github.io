package edu.ncsu.csc216.wolf_hire.model.io;

import java.io.FileWriter; 
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import edu.ncsu.csc216.wolf_hire.model.application.Application;
import edu.ncsu.csc216.wolf_hire.model.manager.Position;

/**
 * Writes positions to file.
 * 
 * @author Nick Gallo
 */
public class PositionWriter {

	/**
	 * Writes the given list of Positions to file
	 * @param fileName name of the file
	 * @param positions ArrayList of positions
	 */
	public static void writePositionsToFile(String fileName, ArrayList<Position> positions) {
		//Print the Positions into a file using the Position toString() format
		try (PrintWriter writer = new PrintWriter(new FileWriter(fileName))) {
	        for (int i = 0; i < positions.size(); i++) {
	            Position position = positions.get(i);
	            writer.println(position.toString());
	            
	            //Print the Applications into a file
	            for (int j = 0; j < position.getApplications().size(); j++) {
	                Application application = position.getApplications().get(j);
	                //Print in the Application toString() format
	                writer.println("* " + application.getId() + "," + application.getState() + ","
	                        + application.getFirstName() + "," + application.getSurname() + ","
	                        + application.getUnityId() + "," + application.getReviewer() + "," + application.getNote());
	            }
	        }
	    } 
		
		catch (IOException e) {
	        throw new IllegalArgumentException("Unable to save file.");
	    }
	}
}