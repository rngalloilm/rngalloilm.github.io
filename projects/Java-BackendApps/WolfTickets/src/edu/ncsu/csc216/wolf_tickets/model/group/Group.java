package edu.ncsu.csc216.wolf_tickets.model.group;

import java.io.File;

import edu.ncsu.csc216.wolf_tickets.model.io.GroupWriter;
import edu.ncsu.csc216.wolf_tickets.model.tickets.AbstractCategory;
import edu.ncsu.csc216.wolf_tickets.model.tickets.ActiveTicketList;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Category;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Ticket;
import edu.ncsu.csc216.wolf_tickets.model.util.ISortedList;
import edu.ncsu.csc216.wolf_tickets.model.util.ISwapList;
import edu.ncsu.csc216.wolf_tickets.model.util.SortedList;

/**
 * Group object class
 * 
 * @author Nick Gallo
 */
public class Group {

	/** The name of the group */
	private String groupName;
	/** Boolean flag that keeps track of if the Group has been changed since the last save */
	private boolean isChanged;
	/** List of the categories */
	private ISortedList<Category> categories;
	/** List of the the active tickets */
	private ActiveTicketList activeTicketList;
	/** The current category */
	private AbstractCategory currentCategory;
	
	/**
	 * Group constructor
	 * @param groupName the Group's name
	 * @throws IllegalArgumentException if groupName is null, empty, or matches ACTIVE_TASKS_NAME
	 */
	public Group(String groupName) {
		setGroupName(groupName);
	    setChanged(true);
	    this.categories = new SortedList<Category>();
	    this.activeTicketList = new ActiveTicketList();
	    this.currentCategory = this.activeTicketList;
	}
	
	/**
	 * Saves the Group to a file
	 * @param groupFile file name
	 */
	public void saveGroup(File groupFile) {
        GroupWriter.writeGroupFile(groupFile, groupName, categories);
        
        isChanged = false;
	}
	
	/**
	 * Gets the Group's name
	 * @return the Group's name
	 */
	public String getGroupName() {
		return groupName;
	}
	
	/**
	 * Set the Group name
	 * @param groupName the Group's name
	 */
	private void setGroupName(String groupName) {
		// Check if groupName is null, empty, or matches ACTIVE_TASKS_NAME
		if (groupName == null || groupName.trim().equals("") || 
			groupName.equals(ActiveTicketList.ACTIVE_TASKS_NAME)) {
			
	        throw new IllegalArgumentException("Invalid name.");
	    }
				
		this.groupName = groupName;
	}
	
	/**
	 * Gets isChanged
	 * @return the isChanged boolean
	 */
	public boolean isChanged() {
		return isChanged;
	}
	
	/**
	 * Sets isChanged
	 * @param changed boolean parameter
	 */
	public void setChanged(boolean changed) {
		this.isChanged = changed;
	}
	
	/**
	 * Adds a category to the list of categories
	 * @param category a Category object
	 * @throws IllegalArgumentException If category name is ACTIVE_TASKS_NAME or a duplicate 
	 * 		of an existing Category (both case insensitive)
	 */
	public void addCategory(Category category) {
		String categoryName = category.getCategoryName();
		    
	    // Check if the name of the category is invalid
	    if (categoryName == null || categoryName.trim().equals("") || 
	        categoryName.equalsIgnoreCase(ActiveTicketList.ACTIVE_TASKS_NAME) ||
	        categories.contains(category)) {
	        
	        throw new IllegalArgumentException("Invalid name.");
	    }
	    
	    // Add the category to the sorted list of categories
	    categories.add(category);
	    // Set the current category to the new category
	    currentCategory = category;
	    
	    // Set the isChanged flag to true
	    isChanged = true;
	}
	
	/**
	 * Get the list of Category's names
	 * @return an array of the Category's names
	 */
	public String[] getCategoriesNames() {
		// Create an array
		String[] categoryNames = new String[categories.size() + 1];
		
		// Add the category names with the active category on top
	    categoryNames[0] = ActiveTicketList.ACTIVE_TASKS_NAME;
	    for (int i = 0; i < categories.size(); i++) {
	        categoryNames[i + 1] = categories.get(i).getCategoryName();
	    }
	    
	    return categoryNames;
	}
	
	/**
	 * Get the list of active tickets
	 */
	private void getActiveTicketList() {
		// Clear the tickets from activeTicketList
		activeTicketList.clearTickets();
	    
	    // Iterate through all categories and add each active ticket
		for (int i = 0; i < categories.size(); i++) {
			Category category = categories.get(i);
	    	ISwapList<Ticket> activeTickets = category.getTickets();
	        
	    	for (int j = 0; j < activeTickets.size(); j++) {
	    		if (activeTickets.size() == 0) {
	    			break;
	    		}
	    		// Check if the ticket is active
	    		if (activeTickets.get(j).isActive()) {
		    		Ticket ticket = activeTickets.get(j);
		            activeTicketList.addTicket(ticket);
	    		}
	        }
		}
	}
	
	/**
	 * Set the current category to be displayed
	 * @param categoryName the Category's name
	 */
	public void setCurrentCategory(String categoryName) {
		// Try to find the category with the given name
	    AbstractCategory foundCategory = null;
	    for (int i = 0; i < categories.size(); i++) {
	        AbstractCategory category = categories.get(i);
	        if (category.getCategoryName().equals(categoryName)) {
	            foundCategory = category;
	            break;
	        }
	    }

	    // If the category is not found, set the currentCategory to activeTicketList
	    if (foundCategory == null) {
	        getActiveTicketList();
	        currentCategory = activeTicketList;
	    } 
	    
	    else {
	        // Otherwise, set the currentCategory to the found category
	        currentCategory = foundCategory;
	    }
	}
	
	/**
	 * Get the current Category
	 * @return the Category
	 */
	public AbstractCategory getCurrentCategory() {
		return currentCategory;
	}
	
	/**
	 * Edit the current Category's name
	 * @param categoryName new Category name
	 * @throws IllegalArgumentException if currentCategory is an ActiveTicketList
	 * @throws IllegalArgumentException if the new name matches "Active Tickets"
	 * @throws IllegalArgumentException if the new name is a duplicate of another category name
	 */
	public void editCategory(String categoryName) {
		// Check if currentCategory is an ActiveTicketList
	    if (currentCategory instanceof ActiveTicketList) {
	        throw new IllegalArgumentException("The Active Tickets list may not be edited.");
	    }

	    // Check if the new name matches "Active Tickets"
	    if (categoryName != null && categoryName.equalsIgnoreCase(ActiveTicketList.ACTIVE_TASKS_NAME)) {
	        throw new IllegalArgumentException("Invalid name.");
	    }

	    // Check if the new name is a duplicate of another category name
	    for (int i = 0; i < categories.size(); i++) {
	    	Category category = categories.get(i);
	        if (category.getCategoryName().equalsIgnoreCase(categoryName)) {
	            throw new IllegalArgumentException("Invalid name.");
	        }
	    }
	    
	    // Find the index of the currentCategory
	    int currentCategoryIdx = 0;
	    for (int i = 0; i < categories.size(); i++) {
	    	if (currentCategory == categories.get(i)) {
	    		currentCategoryIdx = i;
	    		break;
	    	}
	    }

	    // Remove the current category from the list
	    Category cat = categories.remove(currentCategoryIdx);

	    // Edit the current category's name
	    cat.setCategoryName(categoryName);

	    // Add the current category back to the list
	    categories.add(cat);
	    
	    // Set the isChanged flag to true
	    isChanged = true;
	}
	
	/**
	 * Remove the current Category from the list
	 * @throws IllegalArgumentException if the currentCategory is ActiveTicketList
	 */
	public void removeCategory() {
		if (currentCategory instanceof ActiveTicketList) {
	        throw new IllegalArgumentException("The Active Tickets list may not be deleted.");
	    }
		
		// Find the index of the currentCategory
	    int currentCategoryIdx = 0;
	    for (int i = 0; i < categories.size(); i++) {
	    	if (currentCategory == categories.get(i)) {
	    		currentCategoryIdx = i;
	    		break;
	    	}
	    }
	    
	    categories.remove(currentCategoryIdx);
	    // After removing a category, the new current currentCategory is active tickets
	    currentCategory = activeTicketList;
	    isChanged = true;
	}
	
	/**
	 * Add a ticket to a category
	 * @param t the Ticket to be added
	 */
	public void addTicket(Ticket t) {
		if (currentCategory instanceof Category) {
			Category category = (Category) currentCategory;
			category.addTicket(t);
			
	        if (t.isActive()) {
	        	getActiveTicketList();
	        }
	        
	        isChanged = true;
	    }
	}
	
	/**
	 * Edit a Ticket's parameters
	 * @param idx the index of a Ticket
	 * @param ticket the name of the Ticket
	 * @param ticketDescription the description of the Ticket
	 * @param active the activity of the Ticket
	 */
	public void editTicket(int idx, String ticket, String ticketDescription,
						   boolean active) {
		
		// Check if the current category is a Category
	    if (!(currentCategory instanceof Category)) {
	        // If not, do nothing
	        return;
	    }
	    
	    // Get the list of tickets for the current category
	    ISwapList<Ticket> tickets = currentCategory.getTickets();
	    
	    // Get the ticket at the specified index
	    Ticket idxTicket = tickets.get(idx);
	    
	    // Update the fields of the ticket
	    idxTicket.setTicketName(ticket);
	    idxTicket.setTicketDescription(ticketDescription);
	    idxTicket.setActive(active);
	    
	    // Check if the ticket is active
	    if (active) {
	        // If the ticket is active, update the active ticket list
	        getActiveTicketList();
	    }
	    
	    // Set the isChanged flag to true
	    isChanged = true;
	}
}
