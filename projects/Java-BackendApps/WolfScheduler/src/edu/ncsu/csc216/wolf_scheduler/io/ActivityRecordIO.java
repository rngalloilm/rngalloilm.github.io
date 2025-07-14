package edu.ncsu.csc216.wolf_scheduler.io;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;

import edu.ncsu.csc216.wolf_scheduler.course.Activity;

/**
 * Writes activities to file.
 * @author Nick Gallo
 */
public class ActivityRecordIO {

    /**
     * Writes the given list of Activities to 
     * @param fileName file to save to
     * @param activities list of course to save
     * @throws IOException if the file cannot be written
     */
    public static void writeActivityRecords(String fileName, ArrayList<Activity> activities) throws IOException {
    	PrintStream fileWriter = new PrintStream(new File(fileName));
    	
    	for (Activity a : activities) {
    		fileWriter.println(a.toString());
    	}
    	
    	fileWriter.close();
    }

}