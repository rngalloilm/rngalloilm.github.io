package edu.ncsu.csc316.dsa.sorter;

import java.util.Comparator;

/**
 * AbstractComparisonSorter supplies the general code used between sorters.
 * @author Dr. King
 * @author Nick Gallo
 * 
 * @param <E> the generic type of data to sort.
 */
public abstract class AbstractComparisonSorter<E extends Comparable<E>> implements Sorter<E> {

    private Comparator<E> comparator;
    
    public AbstractComparisonSorter(Comparator<E> comparator) {
        setComparator(comparator);
    }
    
    private void setComparator(Comparator<E> comparator) {
        if(comparator == null) {
            this.comparator = new NaturalOrder();
        } else {
            this.comparator = comparator;
        }
    } 
    
    // --From the online instructions in CSC 316:
    // -To create a new Comparator:
    // StudentIDComparator sample = new StudentIDComparator();
    
    // -Now, when creating a new sorter that uses that custom comparator:
    // Sorter<Student> s = new InsertionSorter<Student>(sample);
    
    // -or, on a single line of code:
    // Sorter<Student> s = new InsertionSorter<Student>(new StudentIDComparator());

    // -For example, if you want to sort students by GPA:
    // Comparator<Student> sortByGpa = new Comparator<Student>() {
    //     @Override
    //     public int compare(Student s1, Student s2) {
    //         return Double.compare(s1.getGpa(), s2.getGpa());
    //     }
    // };
    
    private class NaturalOrder implements Comparator<E> {
        public int compare(E first, E second) {
            return ((Comparable<E>) first).compareTo(second);
        }
    }
    
    public int compare(E first, E second) {
        return comparator.compare(first,  second);
    }
}