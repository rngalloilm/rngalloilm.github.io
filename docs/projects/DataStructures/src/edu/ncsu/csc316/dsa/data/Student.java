package edu.ncsu.csc316.dsa.data;

/**
 * A student is comparable and identifiable.
 * Students have a first name, last name, id number, 
 * number of credit hours, gpa, and unityID.
 * 
 * @author Dr. King
 * @author Nick Gallo
 */
public class Student implements Comparable<Student>, Identifiable {
    
    private String first;
    private String last;
    private int id;
    private int creditHours;
    private double gpa;
    private String unityID;

    public Student(String first, String last, int id, int creditHours, double gpa, String unityID) {
        this.first = first;
        this.last = last;
        this.id = id;
        this.creditHours = creditHours;
        this.gpa = gpa;
        this.unityID = unityID;
    }

    public String getFirst() {
        return first;
    }

    public void setFirst(String first) {
        this.first = first;
    }

    public String getLast() {
        return last;
    }

    public void setLast(String last) {
        this.last = last;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCreditHours() {
        return creditHours;
    }

    public void setCreditHours(int creditHours) {
        this.creditHours = creditHours;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        this.gpa = gpa;
    }

    public String getUnityID() {
        return unityID;
    }

    public void setUnityID(String unityID) {
        this.unityID = unityID;
    }

    @Override
    // Compares last names, then first names, then IDs.
    public int compareTo(Student s) {
        // Compare last names.
        int lastCmp = this.last.compareTo(s.last);
        if (lastCmp != 0) {
            return lastCmp;
        }
        
        // If last names are identical, compare first names.
        int firstCmp = this.first.compareTo(s.first);
        if (firstCmp != 0) {
            return firstCmp;
        }
        
        // If both first and last names are identical, compare the unique ID numbers.
        return Integer.compare(this.id, s.id);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        
        Student other = (Student) obj;
        
        if (this.id != other.id) {
            return false;
        }
        
        if (first == null) {
            if (other.first != null) {
                return false;
            }
        } 
        else if (!first.equals(other.first)) {
            return false;
        }
        
        if (last == null) {
            if (other.last != null) {
                return false;
            }
        } 
        else if (!last.equals(other.last)) {
            return false;
        }
        
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        
        result = prime * result + ((first == null) ? 0 : first.hashCode());
        result = prime * result + ((last == null) ? 0 : last.hashCode());
        result = prime * result + id;
        
        return result;
    }
    
    @Override
    public String toString() {
        return "Student [First Name=" + first + ", Last Name=" + last + 
               ", ID=" + id + ", Credit Hours=" + creditHours + 
               ", GPA=" + gpa + ", UnityID=" + unityID + "]";
    }
}
