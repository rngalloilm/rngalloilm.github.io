package edu.ncsu.csc316.dsa.sorter;

import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;

import edu.ncsu.csc316.dsa.data.Student;

public class SelectionSorterTest {

    private Integer[] dataAscending = { 1, 2, 3, 4, 5 };
    private Integer[] dataDescending = { 5, 4, 3, 2, 1 };
    private Integer[] dataRandom = { 4, 1, 5, 3, 2 };

    private SelectionSorter<Integer> integerSorter;

    @Before
    public void setUp() {
        integerSorter = new SelectionSorter<>();
    }

    @Test
    public void testSortIntegers() {
        integerSorter.sort(dataAscending);
        assertEquals(Integer.valueOf(1), dataAscending[0]);
        assertEquals(Integer.valueOf(2), dataAscending[1]);
        assertEquals(Integer.valueOf(3), dataAscending[2]);
        assertEquals(Integer.valueOf(4), dataAscending[3]);
        assertEquals(Integer.valueOf(5), dataAscending[4]);

        integerSorter.sort(dataDescending);
        assertEquals(Integer.valueOf(1), dataDescending[0]);
        assertEquals(Integer.valueOf(2), dataDescending[1]);
        assertEquals(Integer.valueOf(3), dataDescending[2]);
        assertEquals(Integer.valueOf(4), dataDescending[3]);
        assertEquals(Integer.valueOf(5), dataDescending[4]);

        integerSorter.sort(dataRandom);
        assertEquals(Integer.valueOf(1), dataRandom[0]);
        assertEquals(Integer.valueOf(2), dataRandom[1]);
        assertEquals(Integer.valueOf(3), dataRandom[2]);
        assertEquals(Integer.valueOf(4), dataRandom[3]);
        assertEquals(Integer.valueOf(5), dataRandom[4]);
    }
    
    @Test
    public void testSortStudents() {
        // Assuming the Student class implements Comparable and is comparable by last name.
        Student[] students = new Student[] {
            new Student("John", "Doe", 3, 15, 3.5, "jdoe"),
            new Student("Jane", "Smith", 1, 12, 3.8, "jsmith"),
            new Student("Alice", "Johnson", 2, 18, 3.6, "ajohnson")
        };

        SelectionSorter<Student> studentSorter = new SelectionSorter<>();
        studentSorter.sort(students);

        // Sorted by last name.
        assertEquals("Doe", students[0].getLast());
        assertEquals("Johnson", students[1].getLast());
        assertEquals("Smith", students[2].getLast());
    }
}
