package edu.ncsu.csc216.wolf_tickets.model.tickets;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ActiveTicketListTest {

	/** A list of active tickets */
	private ActiveTicketList atl;
	
	@BeforeEach
	public void setUp() throws Exception {
		atl = new ActiveTicketList();
	}

	@Test
	public void testActiveTicketList() {
		assertEquals("Active Tickets", atl.getCategoryName());
		assertEquals(0, atl.getCompletedCount());
		assertEquals(0, atl.getTickets().size());
	}

	@Test
	public void testAddTicket() {
		Ticket t1 = new Ticket("Ticket 1", "Test ticket 1", true);
		atl.addTicket(t1);
		
		assertEquals(1, atl.getTickets().size());
		assertEquals(t1, atl.getTicket(0));
		
		try {
			Ticket t2 = new Ticket("Ticket 2", "Test ticket 2", false);
			atl.addTicket(t2);
			fail();
		} catch (IllegalArgumentException e) {
			assertEquals("Cannot add ticket to Active Tickets.", e.getMessage());
		}
	}

	@Test
	public void testSetCategoryName() {
		try {
			atl.setCategoryName(null);
			fail();
		} catch (IllegalArgumentException e) {
			assertEquals("The Active Tickets list may not be edited.", e.getMessage());
		}
		
		try {
			atl.setCategoryName("");
			fail();
		} catch (IllegalArgumentException e) {
			assertEquals("The Active Tickets list may not be edited.", e.getMessage());
		}
		
		try {
			atl.setCategoryName("Completed Tickets");
			fail();
		} catch (IllegalArgumentException e) {
			assertEquals("The Active Tickets list may not be edited.", e.getMessage());
		}
		
		assertEquals("Active Tickets", atl.getCategoryName());
	}

	@Test
	public void testGetTicketsAsArray() {
		Ticket t1 = new Ticket("Ticket 1", "Test ticket 1", true);
		Ticket t2 = new Ticket("Ticket 2", "Test ticket 2", true);
		atl.addTicket(t1);
		atl.addTicket(t2);
		
		String[][] expected = {{"Active Tickets", "Ticket 1"}, {"Active Tickets", "Ticket 2"}};
		assertArrayEquals(expected, atl.getTicketsAsArray());
	}

	@Test
	public void testClearTickets() {
		Ticket t1 = new Ticket("Ticket 1", "Test ticket 1", true);
		Ticket t2 = new Ticket("Ticket 2", "Test ticket 2", true);
		atl.addTicket(t1);
		atl.addTicket(t2);
		
		assertEquals(2, atl.getTickets().size());

		atl.clearTickets();
		
		assertEquals(0, atl.getTickets().size());
	}

}
