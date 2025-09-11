package edu.ncsu.csc216.wolf_hire.model.application;

import edu.ncsu.csc216.wolf_hire.model.command.Command;

/**
 * This class creates an Application object with a id, state, firstName, surname, unityId, reviewer, and note. Getters 
 * and setters for each of these variables are included.
 * 
 * @author Nick Gallo
 */
public class Application {
	
	/** Appliction's ID */
	private int applicationId;
	/** user's first name */
	private String firstName;
	/** user's surname */
	private String surname;
	/** user's UnityID */
	private String unityId;
	/** reviewer's name, can be null or non-empty */
	private String reviewer;
	/** additional notes field for a rejection reason or termination reason, can be null or a constant */
	private String note;
	
	/** Current state of the application, composition relationship with the ApplicationState class*/
	private ApplicationState currentState;
	/** running count of applications */
	private static int counter = 1;
	
	/** Application's submitted state name */
	public static final String SUBMITTED_NAME = "Submitted";
	/** Application's rejected state name */
	public static final String REJECTED_NAME = "Rejected";
	/** Application's reviewing state name */
	public static final String REVIEWING_NAME = "Reviewing";
	/** Application's interviewing state name */
	public static final String INTERVIEWING_NAME = "Interviewing";
	/** Application's processing state name */
	public static final String PROCESSING_NAME = "Processing";
	/** Application's hired state name */
	public static final String HIRED_NAME = "Hired";
	/** Application's inactive state name */
	public static final String INACTIVE_NAME = "Inactive";
	
	/** Application's rejection state name type */
	public static final String QUALIFICATIONS_REJECTION = "Qualifications";
	/** Application's rejection state type */
	public static final String INCOMPLETE_REJECTION = "Incomplete";
	/** Application's rejection state type */
	public static final String POSITIONS_REJECTION = "Positions";
	/** Application's rejection state type */
	public static final String DUPLICATE_REJECTION = "Duplicate";
	
	/** Application's termination type */
	public static final String COMPLETED_TERMINATION = "Completed";
	/** Application's termination type */
	public static final String RESIGNED_TERMINATION = "Resigned";
	/** Application's termination type */
	public static final String FIRED_TERMINATION = "Fired";
	
	/** Application's final instance of SubmittedState */
	private final ApplicationState submittedState = new SubmittedState();
	/** Application's final instance of RejectedState */
	private final ApplicationState rejectedState = new RejectedState();
	/** Application's final instance of ReviewingState */
	private final ApplicationState reviewingState = new ReviewingState();
	/** Application's final instance of InterviewingState */
	private final ApplicationState interviewingState = new InterviewingState();
	/** Application's final instance of ProcessingState */
	private final ApplicationState processingState = new ProcessingState();
	/** Application's final instance of HiredState */
	private final ApplicationState hiredState = new HiredState();
	/** Application's final instance of InactiveState */
	private final ApplicationState inactiveState = new InactiveState();
	
	/**
	 * Constructs an Application object with values for all fields
	 * @param firstName user's first name
	 * @param surname user's surname
	 * @param unityId user's unityId
	 */
	public Application(String firstName, String surname, String unityId) {
		
		//Set the parameters, order matters
		setFirstName(firstName);
        setSurname(surname);
        setUnityId(unityId);
        setId(counter);
        
        //Application starts in the submitted state
        setState(SUBMITTED_NAME);
        
        //Increment the counter, an Application was created
        incrementCounter();
	}
	
	/**
	 * Creates an Application with the given parameters
	 * @param id Application's ID
	 * @param state Application's state
	 * @param firstName user's first name
	 * @param surname user's surname
	 * @param unityId user's unityId
	 * @param reviewer application reviewer
	 * @param note application note field
	 */
	public Application(int id, String state, String firstName, String surname, String unityId, 
					   String reviewer, String note) {
		
		//If the incoming id is greater than the counter, then counter should be updated to the id + 1
        if (id > counter) {
        	setCounter(id + 1);
        }
		
		//Set the parameters, order matters
		setFirstName(firstName);
        setSurname(surname);
        setUnityId(unityId);
        setReviewer(reviewer);
        setState(state);
        setNote(note);
        setId(id);
        
        //Increment the counter, an Application was created
        incrementCounter();
	}

	/**
	 * Sets applicationId
	 * @param id the applicationId to set
	 */
	private void setId(int id) {
		this.applicationId = id;
	}
	
	/**
	 * Sets currentState based on the String input
	 * @param stateValue the currentState to set
	 */
	private void setState(String stateValue) {
		switch (stateValue) {
		    case "Submitted":
		    	this.currentState = submittedState;
		        break;
		    case "Rejected":
		    	this.currentState = rejectedState;
		        break;
		    case "Reviewing":
		    	this.currentState = reviewingState;
		        break;
		    case "Interviewing":
		    	this.currentState = interviewingState;
		        break;
		    case "Processing":
		    	this.currentState = processingState;
		        break;
		    case "Hired":
		    	this.currentState = hiredState;
		        break;
		    case "Inactive":
		    	this.currentState = inactiveState;
		        break;
		    default:
		    	throw new IllegalArgumentException("Invalid state");
		}
	}	
	
	/**
	 * Gets applicationId
	 * @return the applicationId
	 */
	public int getId() {
		return applicationId;
	}
	
	/**
	 * Gets currentState
	 * @return the currentState
	 */
	public String getState() {
		if (currentState == submittedState) {
			return "Submitted";
		}
		else if (currentState == rejectedState) {
			return "Rejected";
		}
		else if (currentState == reviewingState) {
			return "Reviewing";
		}
		else if (currentState == interviewingState) {
			return "Interviewing";
		}
		else if (currentState == processingState) {
			return "Processing";
		}
		else if (currentState == hiredState) {
			return "Hired";
		}
		else if (currentState == inactiveState) {
			return "Inactive";
		}
		else {
			throw new IllegalArgumentException("Invalid state");
		}
	}

	/**
	 * Gets firstName
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * Sets firstName
	 * @param firstName the firstName to set
	 */
	public void setFirstName(String firstName) {
		if (firstName == null || "".equals(firstName)) {
            throw new IllegalArgumentException("Application cannot be created.");
		}
		this.firstName = firstName;
	}

	/**
	 * Gets surname
	 * @return the surname
	 */
	public String getSurname() {
		return surname;
	}

	/**
	 * Sets surname
	 * @param surname the surname to set
	 */
	public void setSurname(String surname) {
		if (surname == null || "".equals(surname)) {
            throw new IllegalArgumentException("Application cannot be created.");
		}
		this.surname = surname;
	}

	/**
	 * Gets unityId
	 * @return the unityId
	 */
	public String getUnityId() {
		return unityId;
	}

	/**
	 * Sets unityId
	 * @param unityId the unityId to set
	 */
	public void setUnityId(String unityId) {
		if (unityId == null || "".equals(unityId)) {
            throw new IllegalArgumentException("Application cannot be created.");
		}
		this.unityId = unityId;
	}

	/**
	 * Gets reviewer
	 * @return the reviewer
	 */
	public String getReviewer() {
		//If null return an empty string. A reviewer isn't required
		if (reviewer == null) {
			return "";
		}
		else {
			return reviewer;
		}
	}

	/**
	 * Sets reviewer
	 * @param reviewer the reviewer to set
	 */
	public void setReviewer(String reviewer) {
		this.reviewer = reviewer;
	}

	/**
	 * Gets note
	 * @return the note
	 */
	public String getNote() {
		//If null return an empty string. A note isn't required
		if (note == null) {
			return "";
		}
		else {
			return note;
		}
	}

	/**
	 * Sets note
	 * @param note the note to set
	 */
	public void setNote(String note) {
		this.note = note;
	}
	
	/**
	 * Increments counter
	 */
	public static void incrementCounter() {
		counter++;
	}
	
	/**
	 * Set counter to newCount
	 * @param newCount the integer to be set
	 */
	public static void setCounter(int newCount) {
		counter = newCount;
	}
	
	/**
	 * Gets counter for testing purposes
	 * @return the counter
	 */
	public static int getCounter() {
		return counter;
	}
	
	/**
	 * Update the Application's state using a Command
	 * @param c Command value determines the transition of Applications
	 */
	public void update(Command c) {
		currentState.updateState(c);
	}

	/**
	 * Returns a specifically formatted build of the terms
	 */
	@Override
	public String toString() {
		String reviewerStr = getReviewer() == null ? "" : getReviewer();
		String noteStr = getNote() == null ? "" : getNote();
		return "* " + applicationId + "," + currentState.getStateName() + "," + firstName + "," + surname + "," +
				unityId + "," + reviewerStr + "," + noteStr;
	}
	
	/**
	 * Interface for states in the Application State Pattern.  All 
	 * concrete Application states must implement the ApplicationState interface.
	 * 
	 * @author Dr. Sarah Heckman
	 */
	private interface ApplicationState {
		
		/**
		 * Update the Application from the given Command.
		 * An UnsupportedOperationException is thrown if the Command
		 * is not a valid action for the given state.  
		 * @param command Command describing the action that will update the Application's
		 * state.
		 * @throws UnsupportedOperationException if the Command is not a valid action
		 * for the given state.
		 */
		void updateState(Command command);
		
		/**
		 * Returns the name of the current state as a String.
		 * @return the name of the current state as a String.
		 */
		String getStateName();
	}
	
	//ASSIGN, REJECT, and TERMINATE require additional information   
	//RESUBMIT, RETURN, SCHEDULE, PROCESS, and HIRE don't require additional information
	
	/**
	 * Application state: submitted
	 * This state can be updated to reviewing or rejected
	 */
	public class SubmittedState implements ApplicationState {
		
		/**
		 * Updates the state
		 * @param command Command type
		 */
		public void updateState(Command command) {
			switch (command.getCommand()) {
			    case ASSIGN:
			        setState(REVIEWING_NAME);
			        setReviewer(command.getCommandInformation());
			        break;
			    case REJECT:
			    	//Reject command must have a correlated reason
			    	if (command.getCommandInformation() != QUALIFICATIONS_REJECTION &&
		    			command.getCommandInformation() != INCOMPLETE_REJECTION &&
		    			command.getCommandInformation() != POSITIONS_REJECTION &&
		    			command.getCommandInformation() != DUPLICATE_REJECTION) {
			    		
			    		throw new UnsupportedOperationException("Invalid command");
			    	}
			    	
			    	setState(REJECTED_NAME);
			    	setNote(command.getCommandInformation());
			        break;
			    default:
			        throw new UnsupportedOperationException("Invalid command");
			}
		}
		
		/** 
		 * Gets the state's name
		 * @return the stateName
		 */
		public String getStateName() {
			return SUBMITTED_NAME;
		}
	}
	
	/**
	 * Application state: rejected
	 * This state can be updated to submitted
	 */
	public class RejectedState implements ApplicationState {
		
		/**
		 * Updates the state
		 * @param command Command type
		 */
		public void updateState(Command command) {
			switch (command.getCommand()) {
			    case RESUBMIT:
			        setState(SUBMITTED_NAME);
			        setNote(command.getCommandInformation());
			        break;
			    default:
			        throw new UnsupportedOperationException("Invalid command");
			}
		}
		
		/**
		 * Gets the state's name
		 * @return the stateName
		 */
		public String getStateName() {
			return REJECTED_NAME;
		}
	}
	
	/**
	 * Application state: reviewing
	 * This state can be updated to rejected or interviewing
	 */
	public class ReviewingState implements ApplicationState {
		
		/**
		 * Updates the state
		 * @param command Command type
		 */
		public void updateState(Command command) {
			switch (command.getCommand()) {
				case REJECT:
			    	//Reject command must have a correlated reason
			    	if (command.getCommandInformation() != QUALIFICATIONS_REJECTION &&
		    			command.getCommandInformation() != INCOMPLETE_REJECTION &&
		    			command.getCommandInformation() != POSITIONS_REJECTION &&
		    			command.getCommandInformation() != DUPLICATE_REJECTION) {
			    		
			    		throw new UnsupportedOperationException("Invalid command");
			    	}
			    	
			    	setState(REJECTED_NAME);
			    	setReviewer("");
			    	setNote(command.getCommandInformation());
			        break;
				case RETURN:
					setState(SUBMITTED_NAME);
					setReviewer("");
				    break;
				case SCHEDULE:
				    setState(INTERVIEWING_NAME);
				    break;
			    default:
			        throw new UnsupportedOperationException("Invalid command");
			}
		}
		
		/**
		 * Gets the state's name
		 * @return the stateName
		 */
		public String getStateName() {
			return REVIEWING_NAME;
		}
	}

	/**
	 * Application state: interviewing
	 * This state can be updated to reviewing, rejected, or stay in interviewing
	 */
	public class InterviewingState implements ApplicationState {
		
		/**
		 * Updates the state
		 * @param command Command type
		 */
		public void updateState(Command command) {
			switch (command.getCommand()) {
				case ASSIGN:
				    setState(REVIEWING_NAME);
				    setReviewer(command.getCommandInformation());
				    break;
				case REJECT:
					//Reject command must have a correlated reason
			    	if (command.getCommandInformation() != QUALIFICATIONS_REJECTION &&
		    			command.getCommandInformation() != INCOMPLETE_REJECTION &&
		    			command.getCommandInformation() != POSITIONS_REJECTION &&
		    			command.getCommandInformation() != DUPLICATE_REJECTION) {
			    		
			    		throw new UnsupportedOperationException("Invalid command");
			    	}
			    	
			    	setState(REJECTED_NAME);
					setReviewer("");
					setNote(command.getCommandInformation());
				    break;
				//Keeps it in InterviewingState for a reschedule
				case SCHEDULE:
				    setState(INTERVIEWING_NAME);
				    break;
				case PROCESS:
				    setState(PROCESSING_NAME);
				    break;
			    default:
			        throw new UnsupportedOperationException("Invalid command");
			}
		}
		
		/**
		 * Gets the state's name
		 * @return the stateName
		 */
		public String getStateName() {
			return INTERVIEWING_NAME;
		}
	}
	
	/**
	 * Application state: processing
	 * This state can be updated to rejected or hired
	 */
	public class ProcessingState implements ApplicationState {
		
		/**
		 * Updates the state
		 * @param command Command type
		 */
		public void updateState(Command command) {
			switch (command.getCommand()) {
				case REJECT:
					//Reject command must have a correlated reason
			    	if (command.getCommandInformation() != QUALIFICATIONS_REJECTION &&
		    			command.getCommandInformation() != INCOMPLETE_REJECTION &&
		    			command.getCommandInformation() != POSITIONS_REJECTION &&
		    			command.getCommandInformation() != DUPLICATE_REJECTION) {
			    		
			    		throw new UnsupportedOperationException("Invalid command");
			    	}
			    	
			    	setState(REJECTED_NAME);
					setReviewer("");
					setNote(command.getCommandInformation());
				    break;
				case HIRE:
				    setState(HIRED_NAME);
				    break;
			    default:
			        throw new UnsupportedOperationException("Invalid command");
			}
		}
		
		/**
		 * Gets the state's name
		 * @return the stateName
		 */
		public String getStateName() {
			return PROCESSING_NAME;
		}
	}
	
	/**
	 * Application state: hired
	 * This state can be updated to inactive
	 */
	public class HiredState implements ApplicationState {
		
		/**
		 * Updates the state
		 * @param command Command type
		 */
		public void updateState(Command command) {
			switch (command.getCommand()) {
				case TERMINATE:
					//Terminate command must have a correlated reason
			    	if (command.getCommandInformation() != COMPLETED_TERMINATION &&
		    			command.getCommandInformation() != RESIGNED_TERMINATION &&
		    			command.getCommandInformation() != FIRED_TERMINATION) {
			    		
			    		throw new UnsupportedOperationException("Invalid command");
			    	}
			    	
				    setState(INACTIVE_NAME);
				    setNote(command.getCommandInformation());
				    break;
			    default:
			        throw new UnsupportedOperationException("Invalid command");
			}
		}
		
		/**
		 * Gets the state's name
		 * @return the stateName
		 */
		public String getStateName() {
			return HIRED_NAME;
		}
	}
	
	/**
	 * Application state: inactive
	 * This state can be canceled
	 */
	public class InactiveState implements ApplicationState {
		
		/**
		 * Updates the state
		 * @param command Command type
		 */
		public void updateState(Command command) {
			switch (command.getCommand()) {
			    default:
			        throw new UnsupportedOperationException("Invalid command.");
			}
		}
		
		/**
		 * Gets the state's name
		 * @return the stateName
		 */
		public String getStateName() {
			return INACTIVE_NAME;
		}
	}
}
