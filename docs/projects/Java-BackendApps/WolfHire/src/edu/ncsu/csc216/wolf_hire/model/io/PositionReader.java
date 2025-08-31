package edu.ncsu.csc216.wolf_hire.model.io;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

import edu.ncsu.csc216.wolf_hire.model.application.Application;
import edu.ncsu.csc216.wolf_hire.model.manager.Position;

/**
 * Reads Position records from text files. Processes a set of Positions.
 * 
 * @author Nick Gallo
 */
public class PositionReader {
	
	/** Application's inactive state name */
	public static final String INACTIVE_NAME = "Inactive";
	
	/**
	 * Reads position records from a file and generates a list of valid Positions
	 * @param fileName name of the file
	 * @return a list of positions
	 */
	public static ArrayList<Position> readPositionFile(String fileName) {
		//The ArrayList of Positions
		ArrayList<Position> positions = new ArrayList<Position>();
	    
	    //Get the file information
        try (FileInputStream input = new FileInputStream(fileName);
             Scanner scnr = new Scanner(input)) {
            
        	//Iterate through the lines
            String line;
            Position position = null;
            while (scnr.hasNextLine()) {
                line = scnr.nextLine().trim();
                
                //Lines starting with a "#" are marking Positions
                if (line.startsWith("#")) {
                	if (position != null) {
                        positions.add(position);
                    }
                    //Get the Position from the line
                    position = processPosition(line);
                }
                
                //Get the Applications
                else if (position != null) {
                    Application application = processApplication(line);
                    
                    if (application != null) {
                        position.addApplication(application);
                    }
                }
            }
            
            if (position != null) {
                positions.add(position);
            }
            
        } 
        
        catch (FileNotFoundException e) {
            throw new IllegalArgumentException("Unable to load file " + fileName);
        } 
        catch (IOException e) {
            throw new IllegalArgumentException("Unable to close file " + fileName);
        }
        
        return positions;
	}
	
	/**
	 * Processes text
	 * @param positionText the current String
	 * @return a position
	 */
	private static Position processPosition(String positionText) {
		//Brake apart the lines with \\r?\\n onto and array
	    String[] lines = positionText.split("\\r?\\n");
	    
	    //If there is no line return null
	    if (lines.length < 1) {
	        return null;
	    }
	    //Take the line and remove the header and any whitespace
	    String positionLine = lines[0].substring(2).trim();
	    //Take the line to get processed in the helper
	    Position position = processPositionLine(positionLine);
	    //Iterate through the following lines containing the Applications
	    for (int i = 1; i < lines.length; i++) {
	    	//Process the Applications in the helper
	        Application application = processApplication(lines[i].trim());
	        //Add any predetermined Applications
	        if (application != null) {
	            position.addApplication(application);
	        }
	    }
	    return position;
	}
	
	/**
	 * Processes a line of text containing a Position
	 * @param positionLine the current line
	 * @return a position
	 */
	private static Position processPositionLine(String positionLine) {
		//Break apart the terms with "," onto an array
		String[] line = positionLine.split(",");
		
		//If the Application isn't made up of the name, hours, and pay return null
	    if (line.length != 3) {
	        return null;	
	    }
	    //Assign the Position name
	    String name = line[0].trim();
	    //Assign the hours per week
	    int hoursPerWeek = Integer.parseInt(line[1].trim());
	    //Assign the pay rate
	    int payRate = Integer.parseInt(line[2].trim());
	    //Return a constructed Position
	    return new Position(name, hoursPerWeek, payRate);
	}
	
	private static Application processApplication(String applicationLine) {
		// || applicationLine.startsWith("*")
		if (applicationLine.isEmpty() || applicationLine.startsWith("#")) {
	        return null;
	    }
		
		//
	    String[] applicationFields = applicationLine.split(",");
	    
	    //Assign generic Application terms
	    int id = Integer.parseInt(applicationFields[0].substring(1).trim());
	    String state = applicationFields[1].trim();
	    String firstName = applicationFields[2].trim();
	    String surname = applicationFields[3].trim();
	    String unityId = applicationFields[4].trim();
	    String reviewer = null;
	    String note = null;
	    //Check if there is a reviewer and a note, and assign accordingly
	    if (applicationFields.length >= 7) {
	        note = applicationFields[6].trim();
	    }
	    if (applicationFields.length >= 6) {
	        reviewer = applicationFields[5].trim();
	    }
	    
	    if (state == INACTIVE_NAME) {
	    	return null;
	    }
	    
	    try {
	    	//If the id is less than 1, throw IllegalArgumentException
			if (id < 1) {
				throw new IllegalArgumentException("Application cannot be created.");
			}
	        return new Application(id, state, firstName, surname, unityId, reviewer, note);
	    } 
	    catch (IllegalArgumentException e) {
	        return null;
	    }
	}
}