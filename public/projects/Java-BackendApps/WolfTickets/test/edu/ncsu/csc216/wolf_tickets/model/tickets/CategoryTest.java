package edu.ncsu.csc216.wolf_tickets.model.tickets;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CategoryTest {

	/** A Category */
	private Category cat;
	
	@BeforeEach
	public void setUp() {
		cat = new Category("Concert", 0);
	}
	
	@Test
	public void testConstructor() {
		assertEquals("Concert", cat.getCategoryName());
		assertEquals(0, cat.getCompletedCount());
		assertNotNull(cat.getTickets());
	}
	
	@Test
	public void testAddTicket() {
		Ticket t = new Ticket("Concert Ticket", "Description", true);
		cat.addTicket(t);
		assertEquals(1, cat.getTickets().size());
		assertEquals(t, cat.getTickets().get(0));
	}
	
	@Test
	public void testRemoveTicket() {
		Ticket t = new Ticket("Concert Ticket", "Description", true);
		cat.addTicket(t);
		Ticket removed = cat.removeTicket(0);
		assertEquals(t, removed);
		assertEquals(0, cat.getTickets().size());
	}
	
	@Test
	public void testCompleteTicket() {
		Ticket t = new Ticket("Concert Ticket", "Description", true);
		cat.addTicket(t);
		cat.completeTicket(t);
		assertEquals(1, cat.getCompletedCount());
		assertEquals(0, cat.getTickets().size());
	}
	
	@Test
	public void testGetTicketsAsArray() {
		Ticket t1 = new Ticket("Ticket 1", "Description", true);
		Ticket t2 = new Ticket("Ticket 2", "Description", true);
		cat.addTicket(t1);
		cat.addTicket(t2);
		String[][] ticketArray = cat.getTicketsAsArray();
		assertEquals(2, ticketArray.length);
		assertEquals("0", ticketArray[0][0]);
		assertEquals("Ticket 1", ticketArray[0][1]);
		assertEquals("1", ticketArray[1][0]);
		assertEquals("Ticket 2", ticketArray[1][1]);
	}
	
	@Test
	public void testCompareToNull() {
		try {
			cat.compareTo(null);
		} catch (NullPointerException e) {
			assertEquals("Invalid category.", e.getMessage());
		}
	}
	
	@Test
	public void testCompareTo() {
		Category cat1 = new Category("Concert", 0);
		Category cat2 = new Category("Exhibition", 0);
		assertEquals(0, cat.compareTo(cat1));
		assertTrue(cat.compareTo(cat2) < 0);
		assertTrue(cat2.compareTo(cat) > 0);
	}

}
