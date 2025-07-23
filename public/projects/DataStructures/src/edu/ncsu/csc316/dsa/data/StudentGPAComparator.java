package edu.ncsu.csc316.dsa.data;

import java.util.Comparator;

/**
 * Comparator for comparing Students based on GPA.
 * @author Dr. King
 *
 */
public class StudentGPAComparator implements Comparator<Student>{

	/**
	 * Compares students based on GPA in descending order.
	 */
	@Override
	public int compare(Student one, Student two) {
	    int gpaComparison = Double.compare(two.getGpa(), one.getGpa());
	    
        if (gpaComparison == 0) {
            // Use natural ordering as secondary criteria.
            return one.compareTo(two);
        }
        
        return gpaComparison;
	}

}
