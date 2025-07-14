package edu.ncsu.csc216.wolf_tickets.model.io;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import edu.ncsu.csc216.wolf_tickets.model.tickets.Category;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Ticket;
import edu.ncsu.csc216.wolf_tickets.model.util.ISortedList;

/**
 * Writes a stylized text file for Groups and Tickets
 * 
 * @author Nick Gallo
 */
public class GroupWriter {

	/**
	 * Writes a file with the Group, Category, and Ticket data in format
	 * 
	 * @param groupFile the file's name
	 * @param groupName the group's name
	 * @param categories the category
	 */
	public static void writeGroupFile(File groupFile, String groupName, 
							   ISortedList<Category> categories) {
		
		try (FileWriter fileWriter = new FileWriter(groupFile)) {
            // Write the group name
            fileWriter.write("! " + groupName + "\n");

            // Write each category and its completed ticket count
            for (int i = 0; i < categories.size(); i++) {
                Category category = categories.get(i);
                fileWriter.write("# " + category.getCategoryName() + "," + category.getCompletedCount() + "\n");

                // Write each ticket in the category
                for (int j = 0; j < category.getTickets().size(); j++) {
                    Ticket ticket = category.getTickets().get(j);
                    fileWriter.write("* " + ticket.getTicketName());
                    if (ticket.isActive()) {
                        fileWriter.write(",active");
                    }
                    fileWriter.write("\n");

                    // Write ticket description if exists
                    if (ticket.getTicketDescription() != null) {
                        String description = ticket.getTicketDescription().trim().replaceAll("\n", "\n\t");
                        fileWriter.write(description + "\n");
                    }
                }
            }

        } catch (IOException e) {
            throw new IllegalArgumentException("Unable to save file.");
        }
    }
}
