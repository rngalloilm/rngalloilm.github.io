package edu.ncsu.csc316.dsa.io;

import static org.junit.Assert.*;

import org.junit.Test;

import edu.ncsu.csc316.dsa.data.Student;

public class StudentReaderTest {
	
	@Test
	public void testReadFile() {
		Student[] contents = StudentReader.readInputAsArray("input/student_ascendingID.csv");
		assertEquals("Amber",contents[0].getFirst());
		assertEquals("Ara",contents[1].getFirst());
		assertEquals("Lacie",contents[2].getFirst());
		assertEquals("Idalia",contents[3].getFirst());
		assertEquals("Evelin",contents[4].getFirst());
		assertEquals("Lewis",contents[5].getFirst());
		assertEquals("Alicia",contents[6].getFirst());
		assertEquals("Tyree",contents[7].getFirst());
		assertEquals("Loise",contents[8].getFirst());
		assertEquals("Roxann",contents[9].getFirst());
		assertEquals("Nichole",contents[10].getFirst());
		assertEquals("Charlene",contents[11].getFirst());
		assertEquals("Shanti",contents[12].getFirst());
		assertEquals("Cristine",contents[13].getFirst());
		assertEquals("Tanner",contents[14].getFirst());
		assertEquals("Dante",contents[15].getFirst());
	}
	
	// Uses a package visible processLine().
//	// Test processing of a single line.
//    @Test
//    public void testProcessLine() {
//        String sampleLine = "Nick,Gallo,boyo,3,5.11,14";
//        Student s = StudentReader.processLine(sampleLine);
//        
//        assertEquals("Leisha", s.getFirst());
//        assertEquals("Yee", s.getLast());
//        assertEquals("yeel", s.getUnityID());
//        assertEquals(2, s.getId());
//        assertEquals(1.57, s.getGpa(), 0.0001);
//        assertEquals(14, s.getCreditHours());
//    }
//    
//    // Test handling of invalid input.
//    @Test(expected = NumberFormatException.class)
//    public void testInvalidInput() {
//        String invalidLine = "Nick,Gallo,boyo,not_num,5.11,14";
//        StudentReader.processLine(invalidLine);
//    }
//    
//    // Test handling of a file with inconsistent number of fields per line.
//    @Test
//    public void testInconsistentFields() {
//        String inconsistentLine = "Nick,Gallo,boyo,3,5.11";
//        try {
//            StudentReader.processLine(inconsistentLine);
//            fail("Expected an ArrayIndexOutOfBoundsException to be thrown");
//        } catch (ArrayIndexOutOfBoundsException e) {
//            // Test passes if this exception is thrown.
//        }
//    }
}
