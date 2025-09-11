package edu.ncsu.csc216.wolf_hire.model.manager;

import java.util.ArrayList;

import edu.ncsu.csc216.wolf_hire.model.application.Application;
import edu.ncsu.csc216.wolf_hire.model.command.Command;

/**
 * This class creates a Position object with apositionName, hoursPerWeek, payRate, and maintains a List of Applications. Getters 
 * and setters for each of these variables are included.
 * 
 * @author Nick Gallo
 */
public class Position {

	/** name of the Position */
	private String positionName;
	/** hours of work per week */
	private int hoursPerWeek;
	/** amount paid and hour */
	private int payRate;
	
	/** Application's inactive state name */
	public static final String INACTIVE_NAME = "Inactive";
	
	/** List of Applications, composition relationship with the Application class */
	private ArrayList<Application> applications;
	
	/**
	 * Constructs a Position object with values for all fields
	 * @param positionName name of the Position 
	 * @param hoursPerWeek hours of work per week
	 * @param payRate amount paid and hour
	 */
	public Position(String positionName, int hoursPerWeek, int payRate) {
		//Null or empty parameters fail construction
		if (positionName == null || positionName.isEmpty() || hoursPerWeek < 5 || hoursPerWeek > 20 ||
			payRate < 7 || payRate > 35) {
			
			throw new IllegalArgumentException("Position cannot be created.");
	    }
		
		//Apply the parameters
        setPositionName(positionName);
        setHoursPerWeek(hoursPerWeek);
        setPayRate(payRate);
        this.applications = new ArrayList<Application>();
	}
	
	/**
	 * Sets applicationId, taking the Application list's size and 
	 * adding one for the next Application
	 */
	public void setApplicationId() {
		//Sets the counter in Application to 1 + highest current ID
		int max = 0;
		for (int i = 0; i < applications.size(); i++) {
			if (applications.get(i).getId() > max) {
				max = applications.get(i).getId();
			}
		}
		
		Application.setCounter(max + 1);
	}
	
	/**
	 * Sets positionName
	 * @param positionName name of the Position
	 */
	private void setPositionName(String positionName) {
		this.positionName = positionName;
	}
	
	/**
	 * Gets positionName
	 * @return the positionName
	 */
	public String getPositionName() {
		return positionName;
	}
	
	/**
	 * Sets hoursPerWeek
	 * @param hoursPerWeek hours of work per week
	 */
	private void setHoursPerWeek(int hoursPerWeek) {
		this.hoursPerWeek = hoursPerWeek;	
	}
	
	/**
	 * Gets hoursPerWeek
	 * @return the hoursPerWeek
	 */
	public int getHoursPerWeek() {
		return hoursPerWeek;
	}
	
	/**
	 * Sets payRate
	 * @param payRate amount paid and hour
	 */
	private void setPayRate(int payRate) {
		this.payRate = payRate;
	}
	
	/**
	 * Gets payRate
	 * @return the payRate
	 */
	public int getPayRate() {
		return payRate;
	}
	
	/**
	 * Creates a new Application in the submitted state and adds it to the list in sorted order
	 * @param firstName user's first name
	 * @param surname user's surname
	 * @param unityId user's unity ID
	 * @return the applicationId
	 */
	public int addApplication(String firstName, String surname, String unityId) {
	    //Create the new Application
	    Application newApp = new Application(firstName, surname, unityId);

	    //Add to the list
	    addApplication(newApp);

	    return newApp.getId();
	}
	
	/**
	 * Adds an Application to the list in sorted order by id
	 * @param application the Application to be input
	 * @return the applicationId
	 */
	public int addApplication(Application application) {
		//Check for a duplicate ID
	    for (int i = 0; i < applications.size(); i++) {
	    	if (applications.get(i).getId() == application.getId()) {
	    		//If the application is Inactive, duplicate is allowed
	    		if (application.getState().toString() == INACTIVE_NAME) {
	    			return -1;
	    		}
	    		throw new IllegalArgumentException("Application cannot be created.");
	    	}
	    }
	    
	    // Loop through the applications list to find the index where the new application should be inserted
	    int index = 0;
	    while (index < applications.size() && applications.get(index).getId() < application.getId()) {
	        index++;
	    }
	    // Add the new application at the correct index
	    applications.add(index, application);

	    this.setApplicationId();
	    return application.getId();
	}
	
	/**
	 * Gets the applications list
	 * @return the applications
	 */
	public ArrayList<Application> getApplications() {
		return applications;
	}
	
	/**
	 * Gets the Application in the list with the given id
	 * @param id Application's ID
	 * @return referenced Application
	 */
	public Application getApplicationById(int id) {
		//Iterate through the applications list
		for (int i = 0; i < applications.size(); i++) {
	        //If an ID matches return it
	        if (applications.get(i).getId() == id) {
	        	return applications.get(i);
	        }
	    }
		
		//If the ID doesn't exist, return null
	    return null;
	}
	
	/**
	 * Execute Command input on an Application on the list
	 * @param id Application ID
	 * @param c Command type
	 */
	public void executeCommand(int id, Command c) {
		//Iterate through the applications list
		for (Application app : applications) {
			//If an ID matches apply the command
		    if (app.getId() == id) {
		        app.update(c);
		        break;
		    }
		}
	}
	
	/**
	 * Removes the Application with the given id from the list
	 * If there is no Application to remove, the list doesn’t change
	 * @param id Application's ID
	 */
	public void deleteApplicationById(int id) {
		int index = -1;
		//Iterate through the applications list
	    for (int i = 0; i < applications.size(); i++) {
	        if (applications.get(i).getId() == id) {
	            index = i;
	            break;
	        }
	    }
	    //If the index exists it will be removed from the list
	    if (index >= 0) {
	        applications.remove(index);
	    }
	}

	/**
	 * Returns a specifically formatted build of the terms
	 */
	@Override
	public String toString() {
		return "# " + positionName + "," + hoursPerWeek + "," + payRate;
	}
}
