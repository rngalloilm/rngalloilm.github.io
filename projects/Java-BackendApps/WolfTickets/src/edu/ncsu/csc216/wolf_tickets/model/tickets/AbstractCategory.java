package edu.ncsu.csc216.wolf_tickets.model.tickets;

import edu.ncsu.csc216.wolf_tickets.model.util.ISwapList;
import edu.ncsu.csc216.wolf_tickets.model.util.SwapList;

/**
 * Abstract category class
 * 
 * @author Nick Gallo
 */
public abstract class AbstractCategory {

	/** The list of tickets */
	private ISwapList<Ticket> tickets;
	/** The Catagory's name */
	private String categoryName;
	/** The number of completed tickets */
	private int completedCount;
	
	/**
	 * AbstractCategory constructor
	 * @param categoryName Catagory's name
	 * @param completedCount number of completed Tickets
	 * @throws IllegalArgumentException if category name is null or empty
	 * @throws IllegalArgumentException if completed count is less than 0
	 */
	public AbstractCategory(String categoryName, int completedCount) {
		// Check if there's a category name
		if (categoryName == null || categoryName.isEmpty()) {
			throw new IllegalArgumentException("Invalid name.");
		}
		
		// Check if the completed count is valid
		if (completedCount < 0) {
			throw new IllegalArgumentException("Invalid completed count.");
		}
		
		this.categoryName = categoryName;
		this.completedCount = completedCount;
		this.tickets = new SwapList<Ticket>();
	}
	
	/**
	 * Gets Catagory name
	 * @return the Catagory's name
	 */
	public String getCategoryName() {
		return categoryName;
	}
	
	/**
	 * Set the Category name
	 * @param categoryName Catagory's name
	 */
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	
	/**
	 * Gets the list of Tickets
	 * @return the list of Tickets
	 */
	public ISwapList<Ticket> getTickets() {
		return tickets;
	}
	
	/**
	 * Get the number of completed tickets
	 * @return the number of completed tickets
	 */
	public int getCompletedCount() {
		return completedCount;
	}
	
	/**
	 * Add a ticket to the list
	 * @param t a Ticket object
	 */
	public void addTicket(Ticket t) {
		tickets.add(t);
	    t.addCategory(this);
	}
	
	/**
	 * Remove a ticket from the list
	 * @param idx the index of the Ticket
	 * @return the removed Ticket
	 */
	public Ticket removeTicket(int idx) {
		Ticket removedTicket = tickets.remove(idx);
	    return removedTicket;
	}
	
	/**
	 * Gets the Ticket from the list
	 * @param idx the index of the Ticket
	 * @return the Ticket
	 */
	public Ticket getTicket(int idx) {
		return tickets.get(idx);
	}
	
	/**
	 * Set a Ticket to complete
	 * @param t the Ticket to be complete
	 */
	public void completeTicket(Ticket t) {
		for (int i = 0; i < tickets.size(); i++) {
	        if (tickets.get(i) == t) {
	        	// Remove the ticket from the list
	            tickets.remove(i);
	            // Increment number of completed tickets
	            completedCount++;
	            return;
	        }
	    }
	}
	
	/**
	 * Gets the Tickets data
	 * @return Tickets data as an array
	 */
	public abstract String[][] getTicketsAsArray();
}
