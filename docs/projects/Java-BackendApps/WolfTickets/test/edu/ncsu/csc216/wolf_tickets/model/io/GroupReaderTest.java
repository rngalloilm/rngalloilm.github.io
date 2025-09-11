package edu.ncsu.csc216.wolf_tickets.model.io;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;

import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_tickets.model.group.Group;
import edu.ncsu.csc216.wolf_tickets.model.tickets.AbstractCategory;
import edu.ncsu.csc216.wolf_tickets.model.tickets.ActiveTicketList;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Ticket;

class GroupReaderTest {

	/** Valid Group records. Includes three categories */
	private final String validTestFile = "test-files/group1.txt";
	
	@Test
    public void testReadGroupFile() {
		Group group = GroupReader.readGroupFile(new File(validTestFile));
        
        assertNotNull(group);
        assertEquals("CSC IT", group.getGroupName());
        assertEquals(4, group.getCategoriesNames().length);
        
        group.setCurrentCategory(group.getCategoriesNames()[3]);
        AbstractCategory category = group.getCurrentCategory(); 
        assertEquals("Web", category.getCategoryName());
        assertEquals(1, category.getTickets().size());
        
        Ticket ticket = category.getTicket(0);
        assertNotNull(ticket);
        assertEquals("Dr. McLeod website pages won't update.", ticket.getTicketName());
        assertTrue(ticket.isActive());
        assertEquals("I recently uploaded new versions of pages on my website, but the changes don't show up when I go to the URL.", ticket.getTicketDescription());
        
        group.setCurrentCategory(group.getCategoriesNames()[1]);
        category = group.getCurrentCategory();
        assertNotNull(category);
        assertEquals("Classroom Tech", category.getCategoryName());
        assertEquals(4, category.getTickets().size());
        
        ticket = category.getTicket(0);
        assertNotNull(ticket);
        assertEquals("EBII 1025 Laptop display won't work", ticket.getTicketName());
        assertTrue(ticket.isActive());
        assertEquals("The projector will not show my laptop's display in EBII 1025. Using the podium computer works fine. My laptop shows the extra display, but I only see a black screen on the classroom screen.", ticket.getTicketDescription());
        
        ticket = category.getTicket(1);
        assertNotNull(ticket);
        assertEquals("EBII 1010 Podium monitor won't turn on.", ticket.getTicketName());
        assertTrue(ticket.isActive());
        assertEquals("The monitor for the podium computer in EBII won't turn on.", ticket.getTicketDescription());
        
        ticket = category.getTicket(2);
        assertNotNull(ticket);
        assertEquals("EBII 1025 Replace lights", ticket.getTicketName());
        assertFalse(ticket.isActive());
        assertEquals("Lighting panel 5 in EBII 1025 will need to be replaced soon.", ticket.getTicketDescription());
        
        ticket = category.getTicket(3);
        assertNotNull(ticket);
        assertEquals("LMP 200 update Firefox", ticket.getTicketName());
        assertFalse(ticket.isActive());
        assertEquals("The computers in LMP 200 will need Firefox to be updated over the summer.", ticket.getTicketDescription());
        
        group.setCurrentCategory(group.getCategoriesNames()[2]);
        category = group.getCurrentCategory();
        assertNotNull(category);
        assertEquals("Desktop", category.getCategoryName());
        assertEquals(2, category.getTickets().size());
        
        ticket = category.getTicket(0);
        assertNotNull(ticket);
        assertEquals("Dr. McLeod's computer won't charge.", ticket.getTicketName());
        assertTrue(ticket.isActive());
        assertEquals("The laptop provided to me won't charge when I plug in the charger. The charger works for other laptops though.", ticket.getTicketDescription());
    
//        group.setCurrentCategory(ActiveTicketList.ACTIVE_TASKS_NAME);
//        category = group.getCurrentCategory();
//        for (int i = 0; i < category.getTickets().size(); i++) {
//        	System.out.println(category.getTicket(i).getTicketName());
//        }
	}

}
