package edu.ncsu.csc216.wolf_tickets.model.tickets;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TicketTest {

	/** A ticket */
	private Ticket t;
    
    @BeforeEach
    public void setUp() throws Exception {
        t = new Ticket("Concert Ticket", "A ticket for a concert", true);
    }
    
    @Test
    public void testGetTicketName() {
        assertEquals("Concert Ticket", t.getTicketName());
    }
    
    @Test
    public void testSetTicketName() {
        t.setTicketName("Sports Ticket");
        assertEquals("Sports Ticket", t.getTicketName());
        
        try {
            t.setTicketName("");
            fail();
        } catch (IllegalArgumentException e) {
            assertEquals("Incomplete ticket information.", e.getMessage());
        }
        
        try {
            t.setTicketName(null);
            fail();
        } catch (IllegalArgumentException e) {
            assertEquals("Incomplete ticket information.", e.getMessage());
        }
        
        try {
            t.setTicketName("Concert,Ticket");
            fail();
        } catch (IllegalArgumentException e) {
            assertEquals("Incomplete ticket information.", e.getMessage());
        }
    }
    
    @Test
    public void testGetTicketDescription() {
        assertEquals("A ticket for a concert", t.getTicketDescription());
    }
    
    @Test
    public void testSetTicketDescription() {
        t.setTicketDescription("A ticket for a sports game");
        assertEquals("A ticket for a sports game", t.getTicketDescription());
        
        try {
            t.setTicketDescription("");
            fail();
        } catch (IllegalArgumentException e) {
            assertEquals("Incomplete ticket information.", e.getMessage());
        }
        
        try {
            t.setTicketDescription(null);
            fail();
        } catch (IllegalArgumentException e) {
            assertEquals("Incomplete ticket information.", e.getMessage());
        }
    }
    
    @Test
    public void testIsActive() {
        assertTrue(t.isActive());
    }
    
    @Test
    public void testSetActive() {
        t.setActive(false);
        assertFalse(t.isActive());
        t.setActive(true);
        assertTrue(t.isActive());
    }
    
    @Test
    public void testGetCategoryName() {
        assertEquals("", t.getCategoryName());
        
        AbstractCategory c = new Category("Music", 0);
        t.addCategory(c);
        
        assertEquals("Music", t.getCategoryName());
    }
    
    @Test
    public void testAddCategory() {
        AbstractCategory c1 = new Category("Music", 0);
        AbstractCategory c2 = new Category("Sports", 0);
        
        t.addCategory(c1);
        t.addCategory(c2);
        
        assertEquals("Music", t.getCategoryName());
    }
    
    @Test
    public void testCompleteTicket() {
        AbstractCategory c1 = new Category("Music", 0);
        AbstractCategory c2 = new Category("Sports", 0);
        
        t.addCategory(c1);
        t.addCategory(c2);
        
        assertTrue(t.isActive());
        t.completeTicket();
        assertFalse(t.isActive());
    }
    
    @Test
    public void testToString() {
        assertEquals("* Concert Ticket,active\nA ticket for a concert", t.toString());
    }

}
