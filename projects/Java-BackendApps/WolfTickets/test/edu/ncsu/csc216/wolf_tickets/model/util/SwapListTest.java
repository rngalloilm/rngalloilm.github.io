package edu.ncsu.csc216.wolf_tickets.model.util;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class SwapListTest {

	@Test
    public void testAddAndRemove() {
        SwapList<Integer> list = new SwapList<>();
        assertEquals(0, list.size());

        // add some elements to the list
        list.add(1);
        list.add(2);
        list.add(3);
        assertEquals(3, list.size());

        // remove an element from the list
        int removed = list.remove(1);
        assertEquals(2, removed);
        assertEquals(2, list.size());

        // try to remove an element from an invalid index
        try {
            list.remove(-1);
            fail("Expected IndexOutOfBoundsException was not thrown.");
        } catch (IndexOutOfBoundsException e) {
            assertEquals("Invalid index.", e.getMessage());
        }

        // try to add a null element to the list
        try {
            list.add(null);
            fail("Expected NullPointerException was not thrown.");
        } catch (NullPointerException e) {
            assertEquals("Cannot add null element.", e.getMessage());
        }
    }

    @Test
    public void testMoveUpAndMoveDown() {
        SwapList<String> list = new SwapList<>();
        list.add("one");
        list.add("two");
        list.add("three");
        list.add("four");

        // move an element up in the list
        list.moveUp(1);
        assertEquals("two", list.get(0));
        assertEquals("one", list.get(1));
        assertEquals("three", list.get(2));
        assertEquals("four", list.get(3));

        // try to move the first element up
        list.moveUp(0);
        assertEquals("two", list.get(0));
        assertEquals("one", list.get(1));
        assertEquals("three", list.get(2));
        assertEquals("four", list.get(3));

        // move an element down in the list
        list.moveDown(1);
        assertEquals("two", list.get(0));
        assertEquals("three", list.get(1));
        assertEquals("one", list.get(2));
        assertEquals("four", list.get(3));

        // try to move the last element down
        list.moveDown(3);
        assertEquals("two", list.get(0));
        assertEquals("three", list.get(1));
        assertEquals("one", list.get(2));
        assertEquals("four", list.get(3));

        // try to move an element at an invalid index up
        try {
            list.moveUp(-1);
            fail("Expected IndexOutOfBoundsException was not thrown.");
        } catch (IndexOutOfBoundsException e) {
            assertEquals("Invalid index.", e.getMessage());
        }

        // try to move an element at an invalid index down
        try {
            list.moveDown(4);
            fail("Expected IndexOutOfBoundsException was not thrown.");
        } catch (IndexOutOfBoundsException e) {
            assertEquals("Invalid index.", e.getMessage());
        }
    }

    @Test
    public void testCapacity() {
        SwapList<Integer> list = new SwapList<>();
        assertEquals(10, list.capacity());

        // add enough elements to the list to reach its initial capacity
        for (int i = 0; i < 10; i++) {
            list.add(i);
        }
        assertEquals(10, list.capacity());

        // add one more element to the list to exceed its initial capacity
        list.add(10);
        assertEquals(20, list.capacity());
    }
    
    @Test
    public void testMoveToFront() {
        SwapList<String> list = new SwapList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        list.add("D");

        // Move the element at index 2 to the front
        list.moveToFront(2);

        // Check that the list has been updated correctly
        assertEquals("C", list.get(0));
        assertEquals("A", list.get(1));
        assertEquals("B", list.get(2));
        assertEquals("D", list.get(3));

        // Move the element at index 0 to the front (should have no effect)
        list.moveToFront(0);

        // Check that the list has not changed
        assertEquals("C", list.get(0));
        assertEquals("A", list.get(1));
        assertEquals("B", list.get(2));
        assertEquals("D", list.get(3));
    }

    @Test
    public void testMoveToBack() {
        SwapList<String> list = new SwapList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        list.add("D");

        // Move the element at index 1 to the back
        list.moveToBack(1);

        // Check that the list has been updated correctly
        assertEquals("A", list.get(0));
        assertEquals("C", list.get(1));
        assertEquals("D", list.get(2));
        assertEquals("B", list.get(3));

        // Move the element at index 3 to the back (should have no effect)
        list.moveToBack(3);

        // Check that the list has not changed
        assertEquals("A", list.get(0));
        assertEquals("C", list.get(1));
        assertEquals("D", list.get(2));
        assertEquals("B", list.get(3));
    }
}
