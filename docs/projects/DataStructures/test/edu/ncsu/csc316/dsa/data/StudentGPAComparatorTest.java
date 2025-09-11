package edu.ncsu.csc316.dsa.data;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class StudentGPAComparatorTest {

	private Student sOne;
	private Student sTwo;
	private Student sThree;
	private Student sFour;
	private Student sFive;
	private Student sSix;

	private StudentGPAComparator comparator;

	@Before
	public void setUp() {
		sOne = new Student("OneFirst", "OneLast", 1, 1, 1.0, "oneUnityID");
		sTwo = new Student("TwoFirst", "TwoLast", 2, 2, 2.0, "twoUnityID");
		sThree = new Student("ThreeFirst", "ThreeLast", 3, 3, 3.0, "threeUnityID");
		sFour = new Student("FourFirst", "FourLast", 4, 4, 4.0, "fourUnityID");
		sFive = new Student("FiveFirst", "FiveLast", 5, 5, 5.0, "fiveUnityID");
		
		sSix = new Student("SixFirst", "Zebra", 6, 6, 5.0, "sixUnityID");

		comparator = new StudentGPAComparator();
	}

	@Test
	public void testCompare() {
		assertTrue(comparator.compare(sTwo, sOne) < 0);
		assertFalse(comparator.compare(sOne, sTwo) < 0);

		assertTrue(comparator.compare(sTwo, sThree) != 0);
        assertTrue(comparator.compare(sOne, sFive) != 0);
        assertTrue(comparator.compare(sThree, sTwo) < 0);
        
        // Test with students having the same GPA, sSix has last name "Zebra".
        assertTrue(comparator.compare(sFive, sSix) < 0);
        
        // Comparing a student with itself
        assertTrue(comparator.compare(sOne, sOne) == 0);
	}

}
