package edu.ncsu.csc216.wolf_tickets.model.tickets;

/**
 * Category object class
 * 
 * @author Nick Gallo
 */
public class Category extends AbstractCategory implements Comparable<Category> {

	/**
	 * Category constructor
	 * @param categoryName Category's name
	 * @param completedCount number of completed tickets
	 */
	public Category(String categoryName, int completedCount) {
		super(categoryName, completedCount);
	}
	
	/**
	 * Get the Ticket list data to be displayed
	 * @return the list of ticket data as an array
	 */
	public String[][] getTicketsAsArray() {
		// First column is the index of the Ticket and the second is name of the Ticket
		String[][] ticketArray = new String[getTickets().size()][2];
		
		for (int i = 0; i < getTickets().size(); i++) {
			// Convert the index integer to a String
			String strIdx = Integer.toString(i);
			
			// Fill the array
			ticketArray[i][0] = strIdx;
			ticketArray[i][1] = getTicket(i).getTicketName();
		}
		
		return ticketArray;
	}
	
	/**
	 * compareTo method
	 * @param otherCategory the Category to be compared
	 * @return the result from comparing
	 * @throws NullPointerException if the object is null
	 */
	@Override
	public int compareTo(Category otherCategory) {
		// If the object is null throw NullPointerException
		if (otherCategory == null) {
			throw new NullPointerException("Invalid category.");
		}
		
		// Compare the category names in a case-insensitive manner
	    return this.getCategoryName().compareToIgnoreCase(otherCategory.getCategoryName());
	}
}
