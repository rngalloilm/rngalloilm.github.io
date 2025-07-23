package edu.ncsu.csc216.wolf_tickets.model.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Scanner;

import edu.ncsu.csc216.wolf_tickets.model.group.Group;
import edu.ncsu.csc216.wolf_tickets.model.tickets.AbstractCategory;
import edu.ncsu.csc216.wolf_tickets.model.tickets.ActiveTicketList;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Category;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Ticket;

/**
 * Reads a stylized text file for Groups and Tickets
 * 
 * @author Nick Gallo
 */
public class GroupReader {

	/**
	 * Interprets the text file
	 * @param groupFile the text file to be read
	 * @return the Group
	 */
	public static Group readGroupFile(File groupFile) {
		String text = "";
		Scanner scanner = null;
		
		try {
			scanner = new Scanner(new FileInputStream(groupFile));
			while (scanner.hasNextLine()) {
				text += scanner.nextLine() + "\n";
			}
			if ("".equals(text) || text.charAt(0) != '!') {
				throw new IOException();
			}
			
		}
		
		catch (IOException e) {
			throw new IllegalArgumentException("Unable to load file.");
		}
		
		finally {
			if (scanner != null) {
				scanner.close();
			}
		}
		
		Scanner reader = new Scanner(text);
		reader.useDelimiter("\\r?\\n?[#]");
		String groupLine = reader.next();
		groupLine = groupLine.substring(1).trim();
		Group group = new Group(groupLine);
		
		while (reader.hasNext()) {
			group.addCategory(processCategory(reader.next()));
		}
		reader.close();
		
		group.setCurrentCategory(ActiveTicketList.ACTIVE_TASKS_NAME);
		group.setChanged(false);
		return group;
	}
	
	/**
	 * Processes the line of text with the Category
	 * @param categoryText text with the Category
	 * @return The Type
	 */
	private static Category processCategory(String categoryText) {
		Scanner scanner = new Scanner(categoryText);
		scanner.useDelimiter("\\r?\\n?[*]");
		
		// Get the category data
		String categoryInfo = scanner.next().trim();
		Scanner categoryScanner = new Scanner(categoryInfo);
		categoryScanner.useDelimiter(",");
		
		// Get the name and completed count
		String categoryName = categoryScanner.next().trim();
		int completedCount = categoryScanner.nextInt();
		categoryScanner.close();
		
		// Construct the category and add the associated tickets
		Category category = new Category(categoryName, completedCount);
		while (scanner.hasNext()) {
			category.addTicket(processTicket(category, scanner.next()));
		}
		
		scanner.close();
		return category;
	}
	
	/**
	 * Processes the line of text with the Ticket
	 * @param category associated Category
	 * @param ticketText text with the Ticket
	 * @return the Ticket found in the text
	 */
	private static Ticket processTicket(AbstractCategory category, String ticketText) {
		Scanner scanner = new Scanner(ticketText);
		scanner.useDelimiter("\\r?\\n?[*]");
		
		String ticketInfo = scanner.nextLine().substring(1).trim();
		Scanner ticketScanner = new Scanner(ticketText);
		ticketScanner.useDelimiter(",|\\r?\\n");
		
		String ticketName = ticketScanner.next();
		
		ticketScanner.close();
		
		boolean active = false;
		int index = ticketInfo.indexOf(",");
        if (index != -1 && "active".equals(ticketInfo.substring(index + 1))) {
            active = true;
        }
		
		String ticketDesc = "";
		while (scanner.hasNextLine()) {
			ticketDesc += scanner.nextLine().trim() + "\n";
		}
		
		scanner.close();
		
		Ticket ticket = null;
		try {
			ticket = new Ticket(ticketName, ticketDesc, active);
		} catch (IllegalArgumentException e) {
			// Ignore invalid tickets
		}
		
		return ticket;
	}
}
