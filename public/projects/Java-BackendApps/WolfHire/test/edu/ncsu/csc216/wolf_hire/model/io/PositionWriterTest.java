package edu.ncsu.csc216.wolf_hire.model.io;

import static org.junit.jupiter.api.Assertions.*; 

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_hire.model.application.Application;
import edu.ncsu.csc216.wolf_hire.model.manager.Position;

class PositionWriterTest {

	/** For writing Position records */
	private final String writeTestFile = "test-files/writer_positions.txt";
	/** For writing Position records */
	private final String writeTestFile2 = "test-files/writer_positions2.txt";
	/** Valid Position records. Includes one position and six applications in order */
	private final String validTestFile = "test-files/expected_positions.txt";

	/** list of positions */
	private ArrayList<Position> positions;
	
	@Test
	public void testWritePositionsToFile() throws IOException {
		positions = PositionReader.readPositionFile(validTestFile);
		
		PositionWriter.writePositionsToFile(writeTestFile, positions);
		
		//Verify that the file was written correctly
		File testFile = new File(writeTestFile);
		
		List<String> lines = Files.readAllLines(Paths.get(writeTestFile));
		
		assertEquals("# Position A,18,20", lines.get(0));
		assertEquals("* 2,Submitted,Carol,Schmidt,cschmid,,", lines.get(1));
		assertEquals("* 4,Hired,Fiona,Rosario,frosari,sesmith5,", lines.get(2));
		assertEquals("# Position B,10,12", lines.get(3));
		assertEquals("* 7,Inactive,Deanna,Sanders,dsander,tmbarnes,Completed", lines.get(4));
		assertEquals("* 8,Interviewing,Benjamin,Nieves,bmnieves,sesmith5,", lines.get(5));
		assertEquals("* 11,Processing,Quemby,Mullen,qmullen,sesmith5,", lines.get(6));
		assertEquals("# Position D,11,11", lines.get(7));
		assertEquals("* 3,Rejected,Kathleen,Gillespie,kgilles,,Incomplete", lines.get(8));
		
		
		//Delete the test file
	    testFile.delete();
	}
	
	@Test
	public void testWritePositionsToFile2() {
	    positions = PositionReader.readPositionFile(validTestFile);
	    
	    // Check that the correct number of positions were read
	    assertEquals(3, positions.size());
	    
	    System.out.println(positions.get(0));
	    Position position1 = positions.get(0);
	    List<Application> applications1 = position1.getApplications();
	    System.out.println(applications1);
	    
	    System.out.println(positions.get(1));
	    Position position2 = positions.get(1);
	    List<Application> applications2 = position2.getApplications();
	    System.out.println(applications2);
	    
	    System.out.println(positions.get(2));
	    Position position3 = positions.get(2);
	    List<Application> applications3 = position3.getApplications();
	    System.out.println(applications3);
	    
	    System.out.println();
	    
	    PositionWriter.writePositionsToFile(writeTestFile2, positions);
	    
	    ArrayList<Position> positions2 = PositionReader.readPositionFile(writeTestFile2);
	    
	    System.out.println(positions.get(0));
	    Position position4 = positions2.get(0);
	    List<Application> applications4 = position4.getApplications();
	    System.out.println(applications4);
	    
	    System.out.println(positions.get(1));
	    Position position5 = positions2.get(1);
	    List<Application> applications5 = position5.getApplications();
	    System.out.println(applications5);
	    
	    System.out.println(positions.get(2));
	    Position position6 = positions2.get(2);
	    List<Application> applications6 = position6.getApplications();
	    System.out.println(applications6);
	    
//	    assertEquals(positions, positions2);
//	    assertEquals(applications1, applications4);
//	    assertEquals(applications2, applications5);
//	    assertEquals(applications3, applications6);
	    
	}
	
	@Test
	public void testWritePositionsToFileIOException() {
	    String fileName = "nonexistentDirectory/test.txt";
	    positions = new ArrayList<>();
	    try {
	        PositionWriter.writePositionsToFile(fileName, positions);
	        fail("Expected an IllegalArgumentException to be thrown");
	    } catch (IllegalArgumentException e) {
	        assertEquals("Unable to save file.", e.getMessage());
	    }
	}

}