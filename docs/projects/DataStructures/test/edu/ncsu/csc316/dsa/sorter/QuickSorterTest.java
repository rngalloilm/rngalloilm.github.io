package edu.ncsu.csc316.dsa.sorter;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import edu.ncsu.csc316.dsa.data.Student;

public class QuickSorterTest {

    private Integer[] dataAscending = { 1, 2, 3, 4, 5 };
    private Integer[] dataDescending = { 5, 4, 3, 2, 1 };
    private Integer[] dataRandom = { 4, 1, 5, 3, 2 };
    private QuickSorter<Integer> integerSorter;
    
    private Integer[] data = { 3, 1, 4, 1, 5, 9, 2, 6, 5, 3 };

    @Before
    public void setUp() {
        // The BubbleSorter can be instantiated without a comparator if the elements are naturally comparable.
        integerSorter = new QuickSorter<>();
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
        // Assuming a Student class exists that implements Comparable, and compareTo is implemented.
        Student[] students = new Student[] {
            new Student("John", "Doe", 3, 15, 3.5, "jdoe"),
            new Student("Jane", "Smith", 1, 12, 3.8, "jsmith"),
            new Student("Alice", "Johnson", 2, 18, 3.6, "ajohnson")
        };

        // Here the BubbleSorter is used to sort Student objects
        QuickSorter<Student> studentSorter = new QuickSorter<>();
        studentSorter.sort(students);

        // Tests would need to be adjusted to the actual natural ordering of the Student objects.
        assertEquals("Doe", students[0].getLast());
        assertEquals("Johnson", students[1].getLast());
        assertEquals("Smith", students[2].getLast());
    }
    
    @Test
    public void testFirstElementSelector() {
        QuickSorter<Integer> sorter = new QuickSorter<>(QuickSorter.FIRST_ELEMENT_SELECTOR);
        sorter.sort(data);
        assertArrayEquals(new Integer[] { 1, 1, 2, 3, 3, 4, 5, 5, 6, 9 }, data);
    }

    @Test
    public void testLastElementSelector() {
        QuickSorter<Integer> sorter = new QuickSorter<>(QuickSorter.LAST_ELEMENT_SELECTOR);
        sorter.sort(data);
        assertArrayEquals(new Integer[] { 1, 1, 2, 3, 3, 4, 5, 5, 6, 9 }, data);
    }

    @Test
    public void testMiddleElementSelector() {
        QuickSorter<Integer> sorter = new QuickSorter<>(QuickSorter.MIDDLE_ELEMENT_SELECTOR);
        sorter.sort(data);
        assertArrayEquals(new Integer[] { 1, 1, 2, 3, 3, 4, 5, 5, 6, 9 }, data);
    }
}
