package edu.ncsu.csc316.dsa.sorter;

import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;
import edu.ncsu.csc316.dsa.data.Student;
//import edu.ncsu.csc316.dsa.data.Identifiable;

public class RadixSorterTest {
    
    private Student sOne;
    private Student sTwo;
    private Student sThree;
    private Student sFour;
    private Student sFive;
    
    private RadixSorter<Student> sorter;

    @Before
    public void setUp() {
        sOne = new Student("OneFirst", "OneLast", 1, 1, 1.0, "oneUnityID");
        sTwo = new Student("TwoFirst", "TwoLast", 2, 2, 2.0, "twoUnityID");
        sThree = new Student("ThreeFirst", "ThreeLast", 3, 3, 3.0, "threeUnityID");
        sFour = new Student("FourFirst", "FourLast", 4, 4, 4.0, "fourUnityID");
        sFive = new Student("FiveFirst", "FiveLast", 5, 5, 5.0, "fiveUnityID");
        
        // The ToInteger implementation is assuming that Student implements Identifiable
        // and the ID is the integer representation we wish to sort by.
        sorter = new RadixSorter<Student>();
    }
    
    @Test
    public void testSortById() {
        Student[] original = { sTwo, sOne, sFour, sThree, sFive };
        sorter.sort(original);
        assertEquals(sOne, original[0]);
        assertEquals(sTwo, original[1]);
        assertEquals(sThree, original[2]);
        assertEquals(sFour, original[3]);
        assertEquals(sFive, original[4]);
    }
    
    // Additional test cases can be added here to test different scenarios.
}
