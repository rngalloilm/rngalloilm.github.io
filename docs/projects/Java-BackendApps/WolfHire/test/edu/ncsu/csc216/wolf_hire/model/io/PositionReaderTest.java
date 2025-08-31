package edu.ncsu.csc216.wolf_hire.model.io;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_hire.model.application.Application;
import edu.ncsu.csc216.wolf_hire.model.manager.Position;

class PositionReaderTest {
	
	/** Valid Position records. Includes one position and six applications in order */
	private final String validTestFile = "test-files/positions1.txt";
	/** Invalid Position records. Missing applications */
	private final String invalidTestFile12 = "test-files/positions12.txt";

	@Test
	public void testReadValidPositionFile() {
		List<Position> positions = PositionReader.readPositionFile(validTestFile);
		
		//Check that the correct number of positions were read
		assertEquals(1, positions.size());
		
		//Check the details of the position
		Position position = positions.get(0);
		assertEquals("CSC 216 PTF", position.getPositionName());
		assertEquals(12, position.getHoursPerWeek());
		assertEquals(15, position.getPayRate());
		
		//Check the details of the applications
		List<Application> applications = position.getApplications();
		assertEquals(6, applications.size());
		
		//ASSIGN, REJECT, and TERMINATE require additional information   
		//RESUBMIT, RETURN, SCHEDULE, PROCESS, and HIRE don't require additional information
		
		Application app1 = applications.get(0);
		assertEquals(2, app1.getId());
		assertEquals(Application.SUBMITTED_NAME, app1.getState());
		assertEquals("Carol", app1.getFirstName());
		assertEquals("Schmidt", app1.getSurname());
		assertEquals("cschmid", app1.getUnityId());
		assertEquals("", app1.getNote());
		assertEquals("", app1.getReviewer());
		
		Application app2 = applications.get(1);
		assertEquals(3, app2.getId());
		assertEquals(Application.REJECTED_NAME, app2.getState());
		assertEquals("Kathleen", app2.getFirstName());
		assertEquals("Gillespie", app2.getSurname());
		assertEquals("kgilles", app2.getUnityId());
		assertEquals("Incomplete", app2.getNote());
		assertEquals("", app2.getReviewer());
		
		Application app3 = applications.get(2);
		assertEquals(4, app3.getId());
		assertEquals(Application.HIRED_NAME, app3.getState());
		assertEquals("Fiona", app3.getFirstName());
		assertEquals("Rosario", app3.getSurname());
		assertEquals("frosari", app3.getUnityId());
		assertEquals("", app3.getNote());
		assertEquals("sesmith5", app3.getReviewer());
		
		Application app4 = applications.get(3);
		assertEquals(7, app4.getId());
		assertEquals(Application.INACTIVE_NAME, app4.getState());
		assertEquals("Deanna", app4.getFirstName());
		assertEquals("Sanders", app4.getSurname());
		assertEquals("dsander", app4.getUnityId());
		assertEquals("Completed", app4.getNote());
		assertEquals("sesmith5", app4.getReviewer());
		
		Application app5 = applications.get(4);
		assertEquals(8, app5.getId());
		assertEquals(Application.INTERVIEWING_NAME, app5.getState());
		assertEquals("Benjamin", app5.getFirstName());
		assertEquals("Nieves", app5.getSurname());
		assertEquals("bmnieves", app5.getUnityId());
		assertEquals("", app5.getNote());
		assertEquals("sesmith5", app5.getReviewer());
		
		Application app6 = applications.get(5);
		assertEquals(11, app6.getId());
		assertEquals(Application.PROCESSING_NAME, app6.getState());
		assertEquals("Quemby", app6.getFirstName());
		assertEquals("Mullen", app6.getSurname());
		assertEquals("qmullen", app6.getUnityId());
		assertEquals("", app6.getNote());
		assertEquals("sesmith5", app6.getReviewer());
	}
	
	/**
	 * Test reading a file with no position name
	 */
	@Test
	void testReadPositionFileNotFound() {
		//Read from a non existent file
	    String fileName = "invalid_file.txt";
	    assertThrows(IllegalArgumentException.class, () -> {
	        PositionReader.readPositionFile(fileName);
	    });
	    
	    assertEquals("Unable to load file invalid_file.txt", 
	    assertThrows(IllegalArgumentException.class, () -> {
	    	PositionReader.readPositionFile(fileName);
	    }).getMessage());
	}
	
	/**
	 * Test a file with no Applications
	 */
	@Test
	public void testReadPositionFileNoApplications() {
		String fileName = invalidTestFile12;
		ArrayList<Position> positions = PositionReader.readPositionFile(fileName);
		assertEquals(1, positions.size());
		Position position = positions.get(0);
		List<Application> applications = position.getApplications();
		
		assertEquals(0, applications.size());
	}
	
}
