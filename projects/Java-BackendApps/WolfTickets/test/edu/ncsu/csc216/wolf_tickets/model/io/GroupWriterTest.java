package edu.ncsu.csc216.wolf_tickets.model.io;

import static org.junit.jupiter.api.Assertions.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_tickets.model.group.Group;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Category;
import edu.ncsu.csc216.wolf_tickets.model.tickets.Ticket;
import edu.ncsu.csc216.wolf_tickets.model.util.SortedList;

class GroupWriterTest {

	/** A category name */
	private static final String CATEGORY_NAME = "Test Category";
	/** A group name */
    private static final String GROUP_NAME = "Test Group";
    /** A valid test file */
    private static final String FILE_NAME = "test-files/testOutput.txt";
    
    /** A category object */
    private Category testCategory;
    /** A group object */
    private Group testGroup;
    /** A SortedList of type String */
	private SortedList<Category> list;
    
    @Test
    public void testWriteGroupFile() throws IOException {
    	testCategory = new Category(CATEGORY_NAME, 0);
        testGroup = new Group(GROUP_NAME);
        
        testGroup.addCategory(testCategory);
        testGroup.addTicket(new Ticket("Test Ticket", "Test description.", true));
        
    	list = new SortedList<Category>();
    	list.add(testCategory);
    	
    	File file = new File(FILE_NAME);
    	
        GroupWriter.writeGroupFile(file, GROUP_NAME, list);
        
        assertTrue(areFilesEqual(FILE_NAME, "test-files/testoutput_expected.txt"));
    }
    
    public static boolean areFilesEqual(String file1, String file2) throws IOException {
        BufferedReader reader1 = new BufferedReader(new FileReader(file1));
        BufferedReader reader2 = new BufferedReader(new FileReader(file2));
        String line1 = reader1.readLine();
        String line2 = reader2.readLine();
        while (line1 != null && line2 != null) {
            if (!line1.equals(line2)) {
                reader1.close();
                reader2.close();
                return false;
            }
            line1 = reader1.readLine();
            line2 = reader2.readLine();
        }
        reader1.close();
        reader2.close();
        return true;
    }

}
