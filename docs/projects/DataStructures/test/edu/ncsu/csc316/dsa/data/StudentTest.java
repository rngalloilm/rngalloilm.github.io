package edu.ncsu.csc316.dsa.data;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class StudentTest {

	private Student sOne;
	private Student sTwo;
	private Student sThree;
	private Student sFour;
	private Student sFive;

	@Before
	public void setUp() {
		sOne = new Student("OneFirst", "OneLast", 1, 1, 1.0, "oneUnityID");
		sTwo = new Student("TwoFirst", "TwoLast", 2, 2, 2.0, "twoUnityID");
		sThree = new Student("ThreeFirst", "ThreeLast", 3, 3, 3.0, "threeUnityID");
		sFour = new Student("FourFirst", "FourLast", 4, 4, 4.0, "fourUnityID");
		sFive = new Student("FiveFirst", "FiveLast", 5, 5, 5.0, "fiveUnityID");
	}

	@Test
	public void testSetFirst() {
		sOne.setFirst("newOne");
		assertEquals("newOne", sOne.getFirst());
	}

	@Test
	public void testSetLast() {
		sOne.setLast("newOne");
		assertEquals("newOne", sOne.getLast());
	}

	@Test
	public void testSetId() {
		sOne.setId(100);
		assertEquals(100, sOne.getId());
	}

	@Test
	public void testSetGpa() {
		sOne.setGpa(3.51);
		assertEquals(3.51, sOne.getGpa(), 0.001);
	}
	
	@Test
	public void testSetUnityID() {
		sOne.setUnityID("oneUnity");
		assertEquals("oneUnity", sOne.getUnityID());
	}

	@Test
	public void testCompareTo() {
		assertTrue(sOne.compareTo(sTwo) < 0);
		assertTrue(sTwo.compareTo(sOne) > 0);
		assertTrue(sOne.compareTo(sOne) == 0);
		assertTrue(sTwo.compareTo(sTwo) == 0);
	}
	
	@Test
    public void testSetCreditHours() {
        sOne.setCreditHours(15);
        assertEquals(15, sOne.getCreditHours());
    }

    @Test
    public void testEquals() {
        // Test for equality with self
        assertTrue(sOne.equals(sOne));
        // Test for equality with identical object
        Student sOneClone = new Student("OneFirst", "OneLast", 1, 1, 1.0, "oneUnityID");
        assertTrue(sOne.equals(sOneClone));
        // Test for inequality with different object
        assertFalse(sOne.equals(sTwo));
        // Test for inequality with null
//        assertNull(sOne);
        // Test for inequality with object of different type
        assertFalse(sOne.equals("not a student"));
        // Test for equality with different first names
        sOneClone.setFirst("DifferentFirst");
        assertFalse(sOne.equals(sOneClone));
        // Test for equality with different last names
        sOneClone.setFirst("OneFirst"); // Reset to original
        sOneClone.setLast("DifferentLast");
        assertFalse(sOne.equals(sOneClone));
    }
    
    @Test
    public void testHashCode() {
        // Two students with the same attributes should have the same hash code
        Student sOneClone = new Student("OneFirst", "OneLast", 1, 1, 1.0, "oneUnityID");
        assertEquals(sOne.hashCode(), sOneClone.hashCode());
        // Changing a field should change the hash code
        sOneClone.setId(999);
        assertNotEquals(sOne.hashCode(), sOneClone.hashCode());
    }
    
    @Test
    public void testToString() {
        String expected = "Student [First Name=OneFirst, Last Name=OneLast, ID=1, Credit Hours=1, GPA=1.0, UnityID=oneUnityID]";
        assertEquals(expected, sOne.toString());
    }
}
