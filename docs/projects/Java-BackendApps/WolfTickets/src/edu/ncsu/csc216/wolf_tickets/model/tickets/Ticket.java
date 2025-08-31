package edu.ncsu.csc216.wolf_tickets.model.tickets;

import edu.ncsu.csc216.wolf_tickets.model.util.ISwapList;
import edu.ncsu.csc216.wolf_tickets.model.util.SwapList;

/**
 * Ticket object
 * 
 * @author Nick Gallo
 */
public class Ticket {

	/** The list of Categories */
	private ISwapList<AbstractCategory> categories;
	/** The name of the Ticket */
	private String ticketName;
	/** The description of the Ticket */
	private String ticketDescription;
	/** Is the Ticket active */
	private boolean active;
	
	/**
	 * Ticket constructor
	 * @param ticketName The Ticket's name
	 * @param ticketDescription The Ticket's description 
	 * @param active The Ticket's activity
	 */
	public Ticket(String ticketName, String ticketDescription, boolean active) {
		this.categories = new SwapList<AbstractCategory>();
	    setTicketName(ticketName);
	    setTicketDescription(ticketDescription);
	    setActive(active);
	}
	
	/**
	 * Gets the Ticket name
	 * @return the Ticket name
	 */
	public String getTicketName() {
		return ticketName;
	}
	
	/**
	 * Set Ticket name
	 * The ticket name cannot contain a ',' character
	 * @param ticketName the Ticket name
	 * @throws IllegalArgumentException if there's a null or empty ticket name
	 * @throws IllegalArgumentException if there is a comma in the title
	 */
	public void setTicketName(String ticketName) {
		// Check if there's a ticket name
		if (ticketName == null || ticketName.trim().isEmpty()) {
	        throw new IllegalArgumentException("Incomplete ticket information.");
	    }
		
		// Check if there is a comma in the title
		if (ticketName.contains(",")) {
			throw new IllegalArgumentException("Incomplete ticket information.");
		}
		
	    this.ticketName = ticketName.trim();
	}
	
	/**
	 * Gets the Ticket description
	 * @return the Ticket description
	 */
	public String getTicketDescription() {
		return ticketDescription;
	}
	
	/**
	 * Set Ticket description
	 * @param ticketDescription new Ticket description
	 * @throws IllegalArgumentException if there's a null or empty ticket description
	 */
	public void setTicketDescription(String ticketDescription) {
		// Check if there's a ticket description
		if (ticketDescription == null || ticketDescription.trim().isEmpty()) {
	        throw new IllegalArgumentException("Incomplete ticket information.");
	    }
		
	    this.ticketDescription = ticketDescription.trim();
	}
	
	/**
	 * Get the active tickets
	 * @return the active tickets
	 */
	public boolean isActive() {
		return active;
	}
	
	/**
	 * Set a Ticket's activity
	 * @param active the Ticket's activity
	 */
	public void setActive(boolean active) {
		this.active = active;
	}
	
	/**
	 * Gets the Category's name
	 * @return the Category's name
	 */
	public String getCategoryName() {
		// Check if there are categories
		if (categories == null || categories.isEmpty()) {
	        return "";
	    }
		
	    return categories.get(0).getCategoryName();
	}
	
	/**
	 * Add a category to the group
	 * @param category Category object
	 * @throws IllegalArgumentException if category is null
	 */
	public void addCategory(AbstractCategory category) {
		// Check if there's a category
		if (category == null) {
	        throw new IllegalArgumentException("Incomplete ticket information.");
	    }
		
		categories.add(category);
	}
	
	/**
	 * Set a ticket to complete
	 */
	public void completeTicket() {
		// Notify all categories by calling their completeTicket method with this Ticket instance
	    for (int i = 0; i < categories.size(); i++) {
	        categories.get(i).completeTicket(this);
	    }
	    
	    // Set the Ticket as inactive
	    setActive(false);
	}
	
	/**
	 * Ticket's toString
	 * @return Ticket's toString
	 */
	@Override
	public String toString() {
		// Ticket will always have a name
		String s = "";
		
		// Add the ticket line header
		s += "* ";
		
		// Add the ticket name
		s += getTicketName();
		
		// If the ticket is active add the String
		if (isActive()) {
			s += ",active";
		}
		
		// Add the ticket description on the next line
		s += "\n" + getTicketDescription();
				
		return s;
	}
}
