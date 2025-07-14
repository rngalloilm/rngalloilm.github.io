package edu.ncsu.csc216.wolf_tickets.model.tickets;

import edu.ncsu.csc216.wolf_tickets.model.util.ISwapList;

/**
 * Active ticket class
 * 
 * @author Nick Gallo
 */
public class ActiveTicketList extends AbstractCategory {

	/** Name of the active tickets category */
	public static final String ACTIVE_TASKS_NAME = "Active Tickets";
	
	/**
	 * ActiveTicketList constructor
	 */
	public ActiveTicketList() {
		super(ACTIVE_TASKS_NAME, 0);
	}
	
	/**
	 * Add a Ticket to the list of active tickets if it is active
	 * @param t a Ticket object
	 * @throws IllegalArgumentException if the ticket is not active
	 */
	public void addTicket(Ticket t) {
	    // Check if the ticket is active
		if (!t.isActive()) {
			throw new IllegalArgumentException("Cannot add ticket to Active Tickets.");
	    }
		
	    super.addTicket(t);
	}
	
	/**
	 * Set the Category's name
	 * @param categoryName new Category name
	 * @throws IllegalArgumentException if categoryName is null or empty
	 * @throws IllegalArgumentException if the current category name is not "Active Tickets"
	 */
	@Override
	public void setCategoryName(String categoryName) {
		// Check if categoryName is null or empty
		if (categoryName == null || "".equals(categoryName)) {
			throw new IllegalArgumentException("The Active Tickets list may not be edited.");
		}
		
		// Checks if the current category name is "Active Tickets"
		if (categoryName.equals(ACTIVE_TASKS_NAME)) {
	        super.setCategoryName(categoryName);
	    } 
		
		else {
	        throw new IllegalArgumentException("The Active Tickets list may not be edited.");
	    }
	}
	
	/**
	 * Get the list of Tickets
	 * @return the list as an array
	 */
	public String[][] getTicketsAsArray() {
		// First column is the associated category and the second is name of the Ticket
		String[][] ticketArray = new String[getTickets().size()][2];
		
		for (int i = 0; i < getTickets().size(); i++) {
			// Fill the array
			ticketArray[i][0] = getTicket(i).getCategoryName();
			ticketArray[i][1] = getTicket(i).getTicketName();
		}
		
		return ticketArray;
	}
	
	/**
	 * Empty the list of Tickets
	 */
	public void clearTickets() {
		// Make a copy of tickets to determine the size
		ISwapList<Ticket> tickets = getTickets();
		
		// Iterate through the indexes and remove them 
	    while (tickets.size() != 0) {
	    	tickets.remove(0);
	    }
	}
}
