package edu.ncsu.csc216.wolf_hire.model.manager;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_hire.model.application.Application;
import edu.ncsu.csc216.wolf_hire.model.command.Command;
import edu.ncsu.csc216.wolf_hire.model.command.Command.CommandValue;

class PositionTest {

	/** Name of the Position */
	private static final String POSITION_NAME = "Software Engineer";
	/** Hours of work per week */
	private static final int HOURS_PER_WEEK = 10;
	/** Amount paid and hour */
	private static final int PAY_RATE = 30;
	
	/** Application's rejection state name type */
	private static final String QUALIFICATIONS_REJECTION = "Qualifications";
	
	/** Valid Application */
	private Application application1 = new Application("Nick", "Gallo", "rngallo");
	/** Valid Application */
	private Application application2 = new Application("Anakin", "Skywalker", "akskywal");
	
	/**
	 * Test constructing a Position
	 */
	@Test
    public void testPosition() {
		//Test valid Position
		Position position = new Position(POSITION_NAME, HOURS_PER_WEEK, PAY_RATE);
		
        assertEquals("Software Engineer", position.getPositionName());
        assertEquals(10, position.getHoursPerWeek());
        assertEquals(30, position.getPayRate());
        
        assertTrue(position.getApplications().isEmpty());
        
        //Test Position with empty name
        try {
        	Position position2 = new Position("", HOURS_PER_WEEK, PAY_RATE);
        	fail("Expected an IllegalArgumentException to be thrown");
        } 
		catch (IllegalArgumentException e) {
            assertEquals("Position cannot be created.", e.getMessage());
        }
        
      //Test Position with invalid hours per week
        try {
        	Position position3 = new Position(POSITION_NAME, 4, PAY_RATE);
        	fail("Expected an IllegalArgumentException to be thrown");
        } 
		catch (IllegalArgumentException e) {
            assertEquals("Position cannot be created.", e.getMessage());
        }
        
        //Test Position with invalid pay rate
        try {
        	Position position4 = new Position(POSITION_NAME, HOURS_PER_WEEK, 6);
        	fail("Expected an IllegalArgumentException to be thrown");
        } 
		catch (IllegalArgumentException e) {
            assertEquals("Position cannot be created.", e.getMessage());
        }
    }
	
	/**
	 * Test getting an Application
	 */
	@Test
    public void testGetAndAddApplication() {
		Position position = new Position(POSITION_NAME, HOURS_PER_WEEK, PAY_RATE);
		
		assertNotNull(position.getApplications());
		assertTrue(position.getApplications().isEmpty());
		
        position.addApplication(application1);
        position.addApplication(application2);
        
        int app1Id = application1.getId();
        int app2Id = application2.getId();
        
        assertEquals(application1, position.getApplicationById(app1Id));
        assertEquals(application2, position.getApplicationById(app2Id));
        assertNull(position.getApplicationById(3));
    }

	/**
	 * Test deleting an Application
	 */
	@Test
    public void testDeleteApplicationById() {
		Position position = new Position(POSITION_NAME, HOURS_PER_WEEK, PAY_RATE);
		
        position.addApplication(application1);
        position.addApplication(application2);
        
        int app1Id = application1.getId();
        int app2Id = application2.getId();
        
        assertEquals(application1, position.getApplicationById(app1Id));
        assertEquals(application2, position.getApplicationById(app2Id));
        
        position.deleteApplicationById(app1Id);
        
        assertNull(position.getApplicationById(app1Id));
        assertEquals(application2, position.getApplicationById(app2Id));
    }
	
	@Test
    public void testExecuteCommand() {
		Position position = new Position(POSITION_NAME, HOURS_PER_WEEK, PAY_RATE);
		Command reject = new Command(CommandValue.REJECT, QUALIFICATIONS_REJECTION);
		
        position.addApplication(application1);
        position.addApplication(application2);
        
        int app1Id = application1.getId();
        
        position.executeCommand(app1Id, reject);
        
        assertEquals(Application.REJECTED_NAME, application1.getState());
    }
}
