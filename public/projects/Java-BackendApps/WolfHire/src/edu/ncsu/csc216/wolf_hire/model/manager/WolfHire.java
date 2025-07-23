package edu.ncsu.csc216.wolf_hire.model.manager;

import java.util.ArrayList;

import edu.ncsu.csc216.wolf_hire.model.application.Application;
import edu.ncsu.csc216.wolf_hire.model.command.Command;
import edu.ncsu.csc216.wolf_hire.model.io.PositionReader;
import edu.ncsu.csc216.wolf_hire.model.io.PositionWriter;

/**
 * WolfHire manages the processes: saving and loading position lists, loading and adding positions, and getting applications.
 * 
 * @author Nick Gallo
 */
public class WolfHire {

	/** Instance of WolfHire object */
	private static WolfHire singleton;
	
	/** list of positions, composition relationship with the Position class*/
	public ArrayList<Position> positions = new ArrayList<Position>();
	/** active position, composition relationship with the Position class*/
	private Position activePosition;
	
	private WolfHire() {
		positions = new ArrayList<>();
	}
	
	/**
	 * Gets singleton
	 * @return the singleton
	 */
	public static WolfHire getInstance() {
		if (singleton == null) {
			singleton = new WolfHire();
		}
		return singleton;
	}
	
	/**
	 * Load a list of positions from a file
	 * @param fileName name of the file
	 */
	public void loadPositionsFromFile(String fileName) {
		//Get the ArrayList from PositionReader
        ArrayList<Position> loadedPositions = PositionReader.readPositionFile(fileName);
        positions.addAll(loadedPositions);
        
        //Set the Position at the top as the activePosition
        if (!positions.isEmpty()) {
            activePosition = positions.get(0);
            activePosition.setApplicationId();
        }
	}
	
	/**
	 * Save a list of positions to a file
	 * @param fileName name of the file
	 */
	public void savePositionsToFile(String fileName) {
		if (activePosition == null) {
            throw new IllegalArgumentException("Unable to save file.");
        }
        PositionWriter.writePositionsToFile(fileName, positions);
	}
	
	/**
	 * Add a custom position to the list
	 * @param positionName position's name
	 * @param hoursPerWeek number of hours per week
	 * @param payRate amount paid per hour
	 */
	public void addNewPosition(String positionName, int hoursPerWeek, int payRate) {
	    if (positionName == null || positionName.isEmpty()) {
	            throw new IllegalArgumentException("Position cannot be created.");
	    }
	    
	    //Check for a duplicate
        String positionNameLower = positionName.toLowerCase();
        for (Position position : positions) {
            if (position.getPositionName().toLowerCase().equals(positionNameLower)) {
                throw new IllegalArgumentException("Position cannot be created.");
            }
        }
        
        //Create a new Position and add it to the end of the positions
	    positions.add(new Position(positionName, hoursPerWeek, payRate));
	    loadPosition(positionName);
	}
	
	/**
	 * Load a position
	 * @param positionName position's name
	 */
	public void loadPosition(String positionName) {
		//Iterate through positions
	    for (Position position : positions) {
	        //Check if the position names match
	        if (position.getPositionName().equals(positionName)) {
	            //Set active position and application ID
	            activePosition = position;
	            activePosition.setApplicationId();
	            return;
	        }
	    }
        throw new IllegalArgumentException("Position not available.");
	}
	
	/**
	 * Gets activePosition
	 * @return the activePosition
	 */
	public Position getActivePosition() {
		if (activePosition != null) {
			return activePosition;
		}
		else {
			return null;
		}
	}
	
	/**
	 * Gets activePosition's name
	 * @return the activePosition's Position name
	 */
	public String getPositionName() {
		if (activePosition != null) {
			return activePosition.getPositionName();
		}
		else {
			return null;
		}
	}
	
	/**
	 * Gets the position's active name
	 * @return position's name
	 */
	public String getActivePositionName() {
		if (activePosition != null) {
			return activePosition.getPositionName();
		}
		else {
			return null;
		}
	}
	
	/**
	 * Get the current list of position names
	 * @return array of position names
	 */
	public String[] getPositionList() {
	    String[] positionList = new String[positions.size()];
	    for (int i = 0; i < positions.size(); i++) {
	        positionList[i] = positions.get(i).getPositionName();
	    }
	    return positionList;
	}
	
	/**
	 * Pair an Application to a Position
	 * @param firstName user's first name
	 * @param surname user's surname
	 * @param unityId user's unity ID
	 */
	public void addApplicationToPosition(String firstName, String surname, String unityId) {
		if (activePosition != null) {
			activePosition.addApplication(firstName, surname, unityId);
		}
	}
	
	/**
	 * Execute Command input
	 * @param id Application ID
	 * @param c Command type
	 */
	public void executeCommand(int id, Command c) {
		if (activePosition != null) {
			activePosition.executeCommand(id, c);
		}
	}
	
	/**
	 * Delete an Application entry using the associated ID
	 * @param id associated Application ID
	 */
	public void deleteApplicationById(int id) {
		if (activePosition != null) {
			activePosition.deleteApplicationById(id);
		}
	}
	
	/**
	 * Gets current array of Applications 
	 * @param stateName current Application state
	 * @return 2D array of applications for active position
	 */
	public String[][] getApplicationsAsArray(String stateName) {
		if (activePosition == null) {
	        return null;
	    }
		//Get the Application list
		ArrayList<Application> applications = activePosition.getApplications();
		
		//The 2D Object array stores: Application’s id number, Application’s state name, Application’s title,
		// and the Application’s "developer id"
		String[][] applicationArray = new String[applications.size()][4];
	    for (int i = 0; i < applications.size(); i++) {
	    	if ("All".equals(stateName)) {
	    		//Convert Application’s id number to a String
		    	String appId = Integer.toString(applications.get(i).getId());
				
		    	//Fill the array
		        applicationArray[i][0] = appId;
		        applicationArray[i][1] = applications.get(i).getState().toString();
		        applicationArray[i][2] = applications.get(i).getUnityId();
		        applicationArray[i][3] = applications.get(i).getReviewer();
	    	}
	    	else {
	    		if ((applications.get(i).getState().toString()).equals(stateName)) {
	    			//Convert Application’s id number to a String
			    	String appId = Integer.toString(applications.get(i).getId());
					
			    	//Fill the array
			        applicationArray[i][0] = appId;
			        applicationArray[i][1] = applications.get(i).getState().toString();
			        applicationArray[i][2] = applications.get(i).getUnityId();
			        applicationArray[i][3] = applications.get(i).getReviewer();
	    		}
	    	}
	    	
	    }
	    
	    return applicationArray;
	}
	
	/**
	 * Gets an Application entry using the associated ID 
	 * @param id Application ID
	 * @return associated Application
	 */
	public Application getApplicationById(int id) {
		if (activePosition == null) {
	        return null;
	    }
		//Get the Application list
		ArrayList<Application> applications = activePosition.getApplications();
		
		//If the application exists return it, else return null
		for (int i = 0; i < applications.size(); i++) {
			if (applications.get(i).getId() == id) {
				return activePosition.getApplicationById(id);
			}
		}
		return null;
	}
	
	/**
	 * Clear data in the manager
	 */
	protected void resetManager() {
		singleton = null;
	}
}