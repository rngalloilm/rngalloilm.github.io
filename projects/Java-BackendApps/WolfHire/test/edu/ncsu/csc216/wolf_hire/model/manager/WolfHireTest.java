package edu.ncsu.csc216.wolf_hire.model.manager;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_hire.model.command.Command;
import edu.ncsu.csc216.wolf_hire.model.command.Command.CommandValue;

class WolfHireTest {

    /** WolfHire instance */
	WolfHire wolfHire;
	
	/** For writing Position records */
	private final String writeTestFile = "test-files/writerPositions.txt";
	
	/** Application's rejection state name type */
	private static final String QUALIFICATIONS_REJECTION = "Qualifications";
	/** ASSIGN command */
	private Command assign = new Command(CommandValue.ASSIGN, "Now reviewing");
	/** REJECT command */
	private Command reject = new Command(CommandValue.REJECT, QUALIFICATIONS_REJECTION);
	
	/** Application's submitted state name */
	public static final String SUBMITTED_NAME = "Submitted";
	/** Application's reviewing state name */
	private static final String REVIEWING_NAME = "Reviewing";
	/** Application's rejected state name */
	private static final String REJECTED_NAME = "Rejected";

    @BeforeEach
    void setUp() {
        wolfHire = WolfHire.getInstance();
        wolfHire.resetManager();
    }

    @Test
    void testGetInstance() {
        assertNotNull(wolfHire);
    }

    @Test
    void testAddNewPosition() {
    	//Check if the position list is empty
    	assertTrue(wolfHire.positions.isEmpty());
        
        //Add a new position
        wolfHire.addNewPosition("Developer", 15, 25);
        
        //Check if the new position was added to the list
        assertFalse(wolfHire.positions.isEmpty());
        //Check the position's name
        assertEquals("Developer", wolfHire.getPositionName());
        
        //Add invalid positions
        assertThrows(IllegalArgumentException.class, () -> wolfHire.addNewPosition(null, 10, 15));
        assertThrows(IllegalArgumentException.class, () -> wolfHire.addNewPosition("", 10, 15));
        assertThrows(IllegalArgumentException.class, () -> wolfHire.addNewPosition("Developer", 4, 15));
        assertThrows(IllegalArgumentException.class, () -> wolfHire.addNewPosition("Developer", 25, 15));
        assertThrows(IllegalArgumentException.class, () -> wolfHire.addNewPosition("Developer", 10, 6));
        assertThrows(IllegalArgumentException.class, () -> wolfHire.addNewPosition("Developer", 10, 40));
    }
    
    @Test
    void testLoadPosition() {
    	//Add a new position
        wolfHire.addNewPosition("Developer", 15, 25);
        
        //Load a non-existent position
        assertThrows(IllegalArgumentException.class, () -> wolfHire.loadPosition("Manager"));
        
        //Load the new position
        wolfHire.loadPosition("Developer");
        assertEquals("Developer", wolfHire.getPositionName());
    }
    
    @Test
    void testGetActivePosition() {
    	//Add a new position
        wolfHire.addNewPosition("Developer", 15, 25);

        // Load new position and check active position
        wolfHire.loadPosition("Developer");
        assertNotNull(wolfHire.getActivePosition());
        assertEquals("Developer", wolfHire.getActivePosition().getPositionName());
    }

    @Test
    void testGetPositionName() {
    	//Add a new position
        wolfHire.addNewPosition("Developer", 15, 25);

        //Load the position and check the name
        wolfHire.loadPosition("Developer");
        assertEquals("Developer", wolfHire.getPositionName());
    }
    
    @Test
    void testGetPositionList() {
    	//Ensure the position list is empty
        assertEquals(0, wolfHire.getPositionList().length);
        
        //Add two positions
        wolfHire.addNewPosition("Developer", 15, 25);
        wolfHire.addNewPosition("Manager", 10, 30);
        
        //Check the contents of the list
        String[] positionList = wolfHire.getPositionList();
        assertEquals(2, positionList.length);
        assertEquals("Developer", positionList[0]);
        assertEquals("Manager", positionList[1]);
    }
    
    @Test
    public void testLoadPositionsFromFile() {
        wolfHire.loadPositionsFromFile("test-files/positions1.txt");
        assertEquals("CSC 216 PTF", wolfHire.getPositionList()[0]);
        assertEquals("Submitted", wolfHire.getActivePosition().getApplications().get(0).getState());
        assertEquals("Rejected", wolfHire.getActivePosition().getApplications().get(1).getState());
        assertEquals("Hired", wolfHire.getActivePosition().getApplications().get(2).getState());
    }

    @Test
    void testSavePositionsToFile() {
    	//Add a new position
        wolfHire.addNewPosition("Developer", 15, 25);
        
        //Call savePositionsToFile()
        assertDoesNotThrow(() -> wolfHire.savePositionsToFile(writeTestFile));
    }
    
    @Test
    public void testGetActivePositionName() {
    	//Add a new position
        wolfHire.addNewPosition("Developer", 15, 25);
        
        //Get the active position
        String activePositionName = wolfHire.getActivePositionName();
        assertEquals("Developer", activePositionName);
    }
    
    @Test
	public void testAddApplicationToPosition() {
    	//Add a new position
    	wolfHire.addNewPosition("Developer", 15, 25);
		
    	//Add applications to the new position
		wolfHire.addApplicationToPosition("John", "Doe", "johndoe");
		wolfHire.addApplicationToPosition("Jane", "Doe", "janedoe");
		
		//Check the applications through getActivePosition()
		assertEquals(2, wolfHire.getActivePosition().getApplications().size());
		assertEquals("John", wolfHire.getActivePosition().getApplications().get(0).getFirstName());
		assertEquals("Doe", wolfHire.getActivePosition().getApplications().get(0).getSurname());
		assertEquals("johndoe", wolfHire.getActivePosition().getApplications().get(0).getUnityId());
		assertEquals("Jane", wolfHire.getActivePosition().getApplications().get(1).getFirstName());
		assertEquals("Doe", wolfHire.getActivePosition().getApplications().get(1).getSurname());
		assertEquals("janedoe", wolfHire.getActivePosition().getApplications().get(1).getUnityId());
	}
    
    @Test
    public void testGetApplicationById() {
    	//Add a new position
    	wolfHire.addNewPosition("Developer", 15, 25);
    	
    	//Add applications to the new position
        wolfHire.addApplicationToPosition("John", "Doe", "johndoe");
        wolfHire.addApplicationToPosition("Jane", "Doe", "janedoe");
        
        //Check the applications through getApplicationById()
        assertEquals(wolfHire.getApplicationById(1).getFirstName(), "John");
        assertEquals(wolfHire.getApplicationById(1).getSurname(), "Doe");
        assertEquals(wolfHire.getApplicationById(2).getUnityId(), "janedoe");
        assertNull(wolfHire.getApplicationById(3));
    }
    
    @Test
	public void testExecuteCommand() {
    	//Add a new position
    	wolfHire.addNewPosition("Developer", 15, 25);
    	
    	//Add applications to the new position
        wolfHire.addApplicationToPosition("John", "Doe", "johndoe");
        wolfHire.addApplicationToPosition("Jane", "Doe", "janedoe");
        
        //Execute assign command on the first application
		wolfHire.executeCommand(1, assign);
		assertNotNull(wolfHire.getActivePosition().getApplicationById(1).getState());
		assertEquals(REVIEWING_NAME, wolfHire.getActivePosition().getApplicationById(1).getState());
		
		//Execute reject command on the second application
		wolfHire.executeCommand(2, reject);
		assertNotNull(wolfHire.getActivePosition().getApplicationById(2).getState());
		assertEquals(REJECTED_NAME, wolfHire.getActivePosition().getApplicationById(2).getState());
		
		try {
			wolfHire.executeCommand(0, assign);
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid application ID.", e.getMessage());
		}
		
		try {
			wolfHire.executeCommand(3, assign);
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid application ID.", e.getMessage());
		}
	}
    
    @Test
    public void testDeleteApplicationById() {
    	//Add a new position
    	wolfHire.addNewPosition("Developer", 15, 25);
    	
    	//Add applications to the new position
        wolfHire.addApplicationToPosition("John", "Doe", "johndoe");
        wolfHire.addApplicationToPosition("Jane", "Doe", "janedoe");
        
        //Delete the first application
        int applicationId = wolfHire.getActivePosition().getApplications().get(0).getId();
        wolfHire.deleteApplicationById(applicationId);
        assertNull(wolfHire.getActivePosition().getApplicationById(applicationId));
        assertEquals(1, wolfHire.getActivePosition().getApplications().size());
    }
    
    @Test
    public void testGetApplicationsAsArray() {
    	//Add a new position
    	wolfHire.addNewPosition("Developer", 15, 25);
    	
    	//Add applications to the new position
        wolfHire.addApplicationToPosition("John", "Doe", "johndoe");
        wolfHire.addApplicationToPosition("Jane", "Doe", "janedoe");
        
        //Check the array
        String[][] expected = {{"1", "Submitted", "johndoe", ""}, {"2", "Submitted", "janedoe", ""}};
        assertArrayEquals(expected, wolfHire.getApplicationsAsArray(SUBMITTED_NAME));
    }
    

}
