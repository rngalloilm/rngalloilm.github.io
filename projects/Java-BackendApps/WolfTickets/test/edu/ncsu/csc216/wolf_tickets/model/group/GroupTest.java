package edu.ncsu.csc216.wolf_tickets.model.group;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;

import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_tickets.model.tickets.Category;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Ticket;

class GroupTest {

	@Test
	public void testGroup() {
		Group group = new Group("Group Name");
		assertEquals("Group Name", group.getGroupName());
		assertTrue(group.isChanged());
		
		try {
			new Group(null);
			fail("Should have thrown an IllegalArgumentException");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid name.", e.getMessage());
		}
		
		try {
			new Group("");
			fail("Should have thrown an IllegalArgumentException");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid name.", e.getMessage());
		}
		
		try {
			new Group("Active Tickets");
			fail("Should have thrown an IllegalArgumentException");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid name.", e.getMessage());
		}
	}

	@Test
	public void testSaveGroup() {
		Group group = new Group("Group Name");
		File file = new File("test-files/group.txt");
		
		group.addCategory(new Category("Category 1", 0));
		group.addCategory(new Category("Category 2", 0));
		
		group.saveGroup(file);
		assertFalse(group.isChanged());
	}

	@Test
	public void testAddCategory() {
		Group group = new Group("Group Name");
		
		group.addCategory(new Category("Category 1", 0));
		assertEquals(2, group.getCategoriesNames().length);
		assertEquals("Active Tickets", group.getCategoriesNames()[0]);
		assertEquals("Category 1", group.getCategoriesNames()[1]);
		
		group.addCategory(new Category("Category 2", 0));
		assertEquals(3, group.getCategoriesNames().length);
		assertEquals("Active Tickets", group.getCategoriesNames()[0]);
		assertEquals("Category 1", group.getCategoriesNames()[1]);
		assertEquals("Category 2", group.getCategoriesNames()[2]);
		
		try {
			group.addCategory(new Category("category 1", 0));
			fail("Should have thrown an IllegalArgumentException");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid name.", e.getMessage());
		}
		
		try {
			group.addCategory(new Category("Active Tickets", 0));
			fail("Should have thrown an IllegalArgumentException");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid name.", e.getMessage());
		}
		
		try {
			group.addCategory(null);
			fail("Should have thrown a NullPointerException");
		} catch (NullPointerException e) {
			// Expected
		}
	}

	@Test
	public void testSetCurrentCategory() {
		Group group = new Group("Group Name");
		group.addCategory(new Category("Category 1", 0));
		group.addCategory(new Category("Category 2", 0));
		
		group.setCurrentCategory("Category 1");
		assertEquals("Category 1", group.getCurrentCategory().getCategoryName());
		
		group.setCurrentCategory("Category 2");
		assertEquals("Category 2", group.getCurrentCategory().getCategoryName());
	}
	
	@Test
    public void testEditCategory() {
        // Create a new group and add some categories
        Group group = new Group("My Group");
        Category cat1 = new Category("Category 1", 0);
        Category cat2 = new Category("Category 2", 0);
        Category cat3 = new Category("Category 3", 0);
        
        // Add and edit the current category's names
        group.addCategory(cat1);
        group.editCategory("Category 1 new");
        group.addCategory(cat2);
        group.addCategory(cat3);
        group.editCategory("Category 3 new");
        
        assertEquals("Active Tickets", group.getCategoriesNames()[0]);
        assertEquals("Category 1 new", group.getCategoriesNames()[1]);
        assertEquals("Category 2", group.getCategoriesNames()[2]);
        assertEquals("Category 3 new", group.getCategoriesNames()[3]);
    }
	
	@Test
    public void testRemoveCategory() {
		Group group = new Group("Test Group");
		Category category1 = new Category("Category 1", 0);
		Category category2 = new Category("Category 2", 0);
        Category category3 = new Category("Category 3", 0);
		
        // Add categories to the group
        group.addCategory(category1);
        group.addCategory(category2);
        
        // Remove category2
        group.removeCategory();
        
        // Add another category to the group
        group.addCategory(category3);

        // Check that the category was removed
        assertEquals(3, group.getCategoriesNames().length);
        assertTrue(group.getCategoriesNames()[1].equals("Category 1"));
        assertTrue(group.getCategoriesNames()[2].equals("Category 3"));
        assertTrue(group.isChanged());
    }
	
	@Test
    public void testAddTicket() {
        // Create a new Group object
        Group g = new Group("Test Group");
        // Create a new Category object
        Category c = new Category("Test Category", 0);
        // Add the Category to the Group
        g.addCategory(c);

        // Add a ticket to an empty category
        g.addTicket(new Ticket("ID1", "Description", true));
        assertEquals(1, c.getTickets().size());

        // Add a ticket to a non-empty category
        g.addTicket(new Ticket("ID2", "Description", true));
        assertEquals(2, c.getTickets().size());
    }

	@Test
    public void testEditTicket() {
    	Group group = new Group("Test Group");
		Category category = new Category("Test Category", 0);
        group.addCategory(category);
        Ticket ticket = new Ticket("Test Ticket", "Test Description", true);
        category.addTicket(ticket);
    	
        // Test editing a ticket that exists
        group.editTicket(0, "Edited Ticket", "Edited Description", false);
        assertEquals("Edited Ticket", ticket.getTicketName());
        assertEquals("Edited Description", ticket.getTicketDescription());
        assertFalse(ticket.isActive());

        // Test editing a ticket that does not exist
        try {
            group.editTicket(1, "Another Ticket", "Another Description", true);
            fail("Should have thrown an IndexOutOfBoundsException");
        } catch (IndexOutOfBoundsException e) {
        	assertEquals("Invalid index.", e.getMessage());
        }
    }
}
