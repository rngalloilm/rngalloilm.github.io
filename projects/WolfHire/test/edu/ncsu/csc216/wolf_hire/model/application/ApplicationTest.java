package edu.ncsu.csc216.wolf_hire.model.application;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.Before;
import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_hire.model.command.Command;
import edu.ncsu.csc216.wolf_hire.model.command.Command.CommandValue;

/**
 * Tests the Application class
 * 
 * @author Nick Gallo
 */
class ApplicationTest {
	
	/** Application's submitted state name */
	private static final String SUBMITTED_NAME = "Submitted";
	/** Application's rejected state name */
	private static final String REJECTED_NAME = "Rejected";
	/** Application's reviewing state name */
	private static final String REVIEWING_NAME = "Reviewing";
	/** Application's interviewing state name */
	private static final String INTERVIEWING_NAME = "Interviewing";
	/** Application's processing state name */
	private static final String PROCESSING_NAME = "Processing";
	/** Application's hired state name */
	private static final String HIRED_NAME = "Hired";
	/** Application's inactive state name */
	private static final String INACTIVE_NAME = "Inactive";
	
	/** Application's rejection state name type */
	private static final String QUALIFICATIONS_REJECTION = "Qualifications";
	/** Application's termination type */
	private static final String COMPLETED_TERMINATION = "Completed";
	
	//ASSIGN, REJECT, and TERMINATE require additional information   
	//RESUBMIT, RETURN, SCHEDULE, PROCESS, and HIRE don't require additional information
	
	/** ASSIGN command */
	private Command assign = new Command(CommandValue.ASSIGN, "Now reviewing");
	/** REJECT command */
	private Command reject = new Command(CommandValue.REJECT, QUALIFICATIONS_REJECTION);
	/** TERMINATE command */
	private Command terminate = new Command(CommandValue.TERMINATE, COMPLETED_TERMINATION);

	/** RESUBMIT command */
	private Command resubmit = new Command(CommandValue.RESUBMIT, null);
	/** RETURN command */
	private Command returnCommand = new Command(CommandValue.RETURN, null);
	/** SCHEDULE command */
	private Command schedule = new Command(CommandValue.SCHEDULE, null);
	/** PROCESS command */
	private Command process = new Command(CommandValue.PROCESS, null);
	/** HIRE command */
	private Command hire = new Command(CommandValue.HIRE, null);
	
	/** Appliction's ID */
	private static final int APPLICATION_ID = 1;
	/** user's first name */
	private static final String FIRST_NAME = "Nick";
	/** user's surname */
	private static final String SURNAME = "Gallo";
	/** user's UnityID */
	private static final String UNITY_ID = "rngallo";
	/** reviewer's name, can be null or non-empty */
	private static final String REVIEWER = "John";
	/** additional notes field for a rejection reason or termination reason, can be null or a constant */
	private static final String NOTE = "Because";
	/** Current state of the application, composition relationship with the ApplicationState class*/
	private static final String STATE = SUBMITTED_NAME;
	
	@Before
	public void setUp() throws Exception {
		//Reset the counter at the beginning of every test.
		Application.setCounter(0);
	}
	
	/**
	 * Tests constructing an Application with a reviewer and note
	 */
	@Test
	public void testApplication() {
		//Test a valid construction
		Application a = assertDoesNotThrow(
				() -> new Application(APPLICATION_ID, STATE, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE),
				"Should not throw an exception");
		
		assertAll("Application",
				() -> assertEquals(1, a.getId()),
				() -> assertEquals(APPLICATION_ID, a.getId(), "incorrect ID"),
				() -> assertEquals(STATE, a.getState(), "incorrect state"),
				() -> assertEquals(FIRST_NAME, a.getFirstName(), "incorrect first name"),
				() -> assertEquals(SURNAME, a.getSurname(), "incorrect surname"),
				() -> assertEquals(UNITY_ID, a.getUnityId(), "incorrect unity ID"),
				() -> assertEquals(REVIEWER, a.getReviewer(), "incorrect reviewer"),
				() -> assertEquals(NOTE, a.getNote(), "incorrect note"));
		
		//Try with null first name
		try {
		    Application app2 = new Application(null, "Doe", "johndoe");
	        fail("Expected an IllegalArgumentException to be thrown");
	    } 
		catch (IllegalArgumentException e) {
	        assertEquals("Application cannot be created.", e.getMessage());
	    }
		
		//Try null surname
		try {
            Application app2 = new Application("John", null, "johndoe");
            fail("Expected an IllegalArgumentException to be thrown");
        } 
		catch (IllegalArgumentException e) {
            assertEquals("Application cannot be created.", e.getMessage());
        }
		
		//Try null UnityId
		try {
            Application app2 = new Application("John", "Doe", null);
            fail("Expected an IllegalArgumentException to be thrown");
        } 
		catch (IllegalArgumentException e) {
            assertEquals("Application cannot be created.", e.getMessage());
        }
	}
	
	/**
	 * Test setter and getter for reviewer
	 */
    @Test
    public void testReviewerSetterAndGetter() {
    	Application application = new Application(APPLICATION_ID, STATE, FIRST_NAME, SURNAME, UNITY_ID, null, NOTE);
    	application.setReviewer(REVIEWER);
        assertEquals(REVIEWER, application.getReviewer());
    }
    
    /**
     * Test setter and getter for note
     */
    @Test
    public void testNoteSetterAndGetter() {
    	Application application = new Application(APPLICATION_ID, STATE, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, null);
        application.setNote(NOTE);
        assertEquals(NOTE, application.getNote());
    }
    
    /**
     * Test getting the Application ID
     */
    @Test
    public void testGetId() {
    	Application application = new Application(APPLICATION_ID, STATE, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
        assertEquals(1, application.getId());
    }
    
    /**
     * Test getting the state from a new Application
     */
    @Test
    public void testGetState() {
    	Application application = new Application(APPLICATION_ID, STATE, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
        assertEquals("Submitted", application.getState());
    }
    
    /**
     * Test update() from submitted state
     */
    @Test
    public void testUpdateFromSubmitted() {
    	//Test setting state to "Reviewing"
    	Application application = new Application(APPLICATION_ID, STATE, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application.update(assign);
    	assertEquals(Application.REVIEWING_NAME, application.getState());

    	//Test setting state to "Rejected"
    	Application application2 = new Application(APPLICATION_ID, STATE, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application2.update(reject);
    	assertEquals(Application.REJECTED_NAME, application2.getState());
    	
    	//Test setting state to an invalid value
    	Application applicationE = new Application(APPLICATION_ID, STATE, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	Exception exception = assertThrows(UnsupportedOperationException.class, () -> applicationE.update(hire));
    	assertEquals("Invalid command", exception.getMessage());
    }
    
    /**
     * Test update() from rejected state
     */
    @Test
    public void testUpdateFromRejeceted() {
    	
    	//Test setting state to "Submitted"
    	Application application = new Application(APPLICATION_ID, REJECTED_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application.update(resubmit);
    	assertEquals(Application.SUBMITTED_NAME, application.getState());
    	
    	//Test setting state to an invalid value
    	Application applicationE = new Application(APPLICATION_ID, REJECTED_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	Exception exception = assertThrows(UnsupportedOperationException.class, () -> applicationE.update(hire));
    	assertEquals("Invalid command", exception.getMessage());
    }
    
    /**
     * Test update() from reviewing state
     */
    @Test
    public void testUpdateFromReviewing() {
    	//Test setting state to "Rejected"
    	Application application = new Application(APPLICATION_ID, REVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application.update(reject);
    	assertEquals(Application.REJECTED_NAME, application.getState());
    	
    	//Test setting state to "Interviewing"
    	Application application2 = new Application(APPLICATION_ID, REVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application2.update(schedule);
    	assertEquals(Application.INTERVIEWING_NAME, application2.getState());
    	
    	//Test setting state to "Submitted"
    	Application application3 = new Application(APPLICATION_ID, REVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application3.update(returnCommand);
    	assertEquals(Application.SUBMITTED_NAME, application3.getState());
    	
    	//Test setting state to an invalid value
    	Application applicationE = new Application(APPLICATION_ID, REVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	Exception exception = assertThrows(UnsupportedOperationException.class, () -> applicationE.update(hire));
    	assertEquals("Invalid command", exception.getMessage());
    }
    
    /**
     * Test update() from interviewing state
     */
    @Test
    public void testUpdateFromInterviewing() {
    	//Test setting state to "Reviewing"
    	Application application = new Application(APPLICATION_ID, INTERVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application.update(assign);
    	assertEquals(Application.REVIEWING_NAME, application.getState());
    	
    	//Test setting state to "Rejected"
    	Application application2 = new Application(APPLICATION_ID, INTERVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application2.update(reject);
    	assertEquals(Application.REJECTED_NAME, application2.getState());
    	
    	//Test setting and keeping state to "Interviewing"
    	Application application3 = new Application(APPLICATION_ID, INTERVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application3.update(schedule);
    	assertEquals(Application.INTERVIEWING_NAME, application3.getState());
    	
    	//Test setting state to "Processing"
    	Application application4 = new Application(APPLICATION_ID, INTERVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application4.update(process);
    	assertEquals(Application.PROCESSING_NAME, application4.getState());
    	
    	//Test setting state to an invalid value
    	Application applicationE = new Application(APPLICATION_ID, INTERVIEWING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	Exception exception = assertThrows(UnsupportedOperationException.class, () -> applicationE.update(hire));
    	assertEquals("Invalid command", exception.getMessage());
    }
    
    /**
     * Test update() from processing state
     */
    @Test
    public void testUpdateFromProcessing() {
    	//Test setting state to "Rejected"
    	Application application = new Application(APPLICATION_ID, PROCESSING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application.update(reject);
    	assertEquals(Application.REJECTED_NAME, application.getState());
    	
    	//Test setting state to "Hired"
    	Application application2 = new Application(APPLICATION_ID, PROCESSING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application2.update(hire);
    	assertEquals(Application.HIRED_NAME, application2.getState());
    	
    	//Test setting state to an invalid value
    	Application applicationE = new Application(APPLICATION_ID, PROCESSING_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	Exception exception = assertThrows(UnsupportedOperationException.class, () -> applicationE.update(process));
		assertEquals("Invalid command", exception.getMessage());
    }
    
    /**
     * Test update() from hired state
     */
    @Test
    public void testUpdateFromHired() {
    	//Test setting state to "Inactive"
    	Application application = new Application(APPLICATION_ID, HIRED_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	application.update(terminate);
    	assertEquals(Application.INACTIVE_NAME, application.getState());
    	
    	//Test setting state to an invalid value
    	Application applicationE = new Application(APPLICATION_ID, HIRED_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	Exception exception = assertThrows(UnsupportedOperationException.class, () -> applicationE.update(hire));
		assertEquals("Invalid command", exception.getMessage());
    }
    
    /**
     * Test update() from inactive state
     * No commands for InactiveState, will throw
     */
    @Test
    public void testUpdateFromInactive() {
    	//Test setting state
    	Application applicationE = new Application(APPLICATION_ID, INACTIVE_NAME, FIRST_NAME, SURNAME, UNITY_ID, REVIEWER, NOTE);
    	Exception exception = assertThrows(UnsupportedOperationException.class, () -> applicationE.update(hire));
		assertEquals("Invalid command.", exception.getMessage());
    }
    
    @Test
	public void testToString() {
		Application application = new Application(3, "Rejected", "Kathleen", "Gillespie", "kgilles", null, "Incomplete");
		String expected = "* 3,Rejected,Kathleen,Gillespie,kgilles,,Incomplete";
		assertEquals(expected, application.toString());
	}
    
}
