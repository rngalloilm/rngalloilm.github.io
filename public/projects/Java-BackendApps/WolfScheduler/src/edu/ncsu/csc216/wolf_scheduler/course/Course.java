package edu.ncsu.csc216.wolf_scheduler.course;

/**
 * This class will create the courses for the scheduler,
 * using Activity as a superclass
 * @author Nick Gallo
 */
public class Course extends Activity {
	
	/** Course's name. */
	private String name;
	/** Course's section. */
	private String section;
	/** Course's credit hours */
	private int credits;
	/** Course's instructor */
	private String instructorId;
	/** Course's minimum full ID length */
	private static final int MIN_NAME_LENGTH = 5;
	/** Course's maximum full ID length */
	private static final int MAX_NAME_LENGTH = 8;
	/** Course's minimum ID letter portion length */
	private static final int MIN_LETTER_COUNT = 1;
	/** Course's maximum ID letter portion length */
	private static final int MAX_LETTER_COUNT = 4;
	/** Course's ID digit portion length */
	private static final int DIGIT_COUNT = 3;
	/** Course's minimum credit count */
	private static final int MIN_CREDITS = 1;
	/** Course's maximum credit count */
	private static final int MAX_CREDITS = 5;
	/** GUI short display array length */
	private static final int SHORT_DISPLAY = 4;
	/** GUI long display array length */
	private static final int LONG_DISPLAY = 7;
	/** Activity's upper hour limit */
	private static final int UPPER_HOUR = 23;
	/** Activity's upper minute limit */
	private static final int UPPER_MINUTE = 59;
	
	/**
	 * Constructs a Course object with values for all related fields.
	 * @param name name of Course
	 * @param title title of Course
	 * @param section section of Course
	 * @param credits credit hours for Course
	 * @param instructorId instructor's unity id
	 * @param meetingDays meeting days for Course as series of chars
	 * @param startTime start time for Course
	 * @param endTime end time for Course
	 */
	public Course(String name, String title, String section, int credits, String instructorId, String meetingDays,
            int startTime, int endTime) {
        super(title, meetingDays, startTime, endTime);
        setName(name);
        //setTitle called in super
        setSection(section);
        setCredits(credits);
        setInstructorId(instructorId);
        //setMeetingDaysAndTime called in super
    }

	/**
	 * Creates a Course with the given name, title, section, credits, instructorId, and meetingDays for 
	 * courses that are arranged.
	 * @param name name of Course
	 * @param title title of Course
	 * @param section section of Course
	 * @param credits credit hours for Course
	 * @param instructorId instructor's unity id
	 * @param meetingDays meeting days for Course as series of chars
	 */
	public Course(String name, String title, String section, int credits, String instructorId, String meetingDays) {
	    this(name, title, section, credits, instructorId, meetingDays, 0, 0);
	}
	
	/**
	 * Returns the Course's name.
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * Sets the Course's name.  If the name is null, has a length less than 5 or more than 8,
	 * does not contain a space between letter characters and number characters, has less than 1
	 * or more than 4 letter characters, and not exactly three trailing digit characters, an
	 * IllegalArgumentException is thrown.
	 * @param name the name to set
	 * @throws IllegalArgumentException if the name parameter is invalid
	 */
	private void setName(String name) {
	    //Throw exception if the name is null
	    if (name == null) {
	        throw new IllegalArgumentException("Invalid course name.");
	    }

	    //Throw exception if the name is an empty string
	    //Throw exception if the name contains less than 5 character or greater than 8 characters
	    if (name.length() < MIN_NAME_LENGTH || name.length() > MAX_NAME_LENGTH) {
	        throw new IllegalArgumentException("Invalid course name.");
	    }

	    //Check for pattern of L[LLL] NNN
	    int numLetters = 0;
	    int numDigits = 0;
	    boolean spaceFound = false;
	    for (int i = 0; i < name.length(); i++) {
	    	char currentChar = name.charAt(i);
	    	
	    	//if a space has not yet been found
	        if (!spaceFound) {
	            //if the character at i is a letter
	        	if (Character.isLetter(currentChar)) {
	                //increment the letter counter
	        		numLetters++;
	        	}
	            //else if the character at i is a space
	        	else if (currentChar == ' ') {
	                //space flag should be set to true
	        		spaceFound = true;
	        	}
	        	else {
	                throw new IllegalArgumentException("Invalid course name.");
	        	}
	        }
	        //else if a space is found
	        else if (spaceFound) {
	            //if the character is a digit
	        	if (Character.isDigit(currentChar)) {
	                //increment the digit counter
	        		numDigits++;
	        	}
	        	else {
	                throw new IllegalArgumentException("Invalid course name.");
	        	}
	        }
	    }

	    //Check that the number of letters is correct
	    //if letter counter is less than one or more than 4
	    if (numLetters < MIN_LETTER_COUNT || numLetters > MAX_LETTER_COUNT) {
	        throw new IllegalArgumentException("Invalid course name.");
		}

	    //Check that the number of digits is correct
	    //if digit counter is not 3
	    if (numDigits != DIGIT_COUNT) {
	        throw new IllegalArgumentException("Invalid course name.");
	    }
	    
	    //set this.name (field) to name (parameter)
	    this.name = name;
	}

	/**
	 * Returns the Course's section.
	 * @return the section
	 */
	public String getSection() {
		return section;
	}

	/**
	 * Sets the Course's section. if the section parameter is null, not 3 in length,
	 * or all digits an IllegalArgumentException is thrown
	 * @param section the section to set
	 * @throws IllegalArgumentException if the section parameter is null or not 3 digits
	 */
	public void setSection(String section) {
		//Throw exception if section is null or not 3 digits
		if (section == null || section.length() != DIGIT_COUNT) {
			throw new IllegalArgumentException("Invalid section.");
		}
		
		//Throw exception if not all terms are digits
		int numDigits = 0;
		for (int i = 0; i < section.length(); i++) {
			char currentChar = section.charAt(i);
			
			if (Character.isDigit(currentChar)) {
                //increment the digit counter
        		numDigits++;
        	}
		}
		if (numDigits != DIGIT_COUNT) {
			throw new IllegalArgumentException("Invalid section.");
		}
		
		this.section = section;
	}

	/**
	 * Returns the Course's number of credits.
	 * @return the credits
	 */
	public int getCredits() {
		return credits;
	}

	/**
	 * Sets the Course's number of credits. If the credits parameter length isn't within the
	 * bounds an IllegalArgumentException is thrown
	 * @param credits the credits to set
	 * @throws IllegalArgumentException if the credits parameter isn't
	 * between 1 and 5 digits, inclusive
	 */
	public void setCredits(int credits) {
		//Throw exception if the number of digits is outside 1 and 5
		if (credits < MIN_CREDITS || credits > MAX_CREDITS) {
			throw new IllegalArgumentException("Invalid credits.");
		}
		
		this.credits = credits;
	}

	/**
	 * Returns the Course's instructor ID.
	 * @return the instructorId
	 */
	public String getInstructorId() {
		return instructorId;
	}

	/**
	 * Sets the Course's instructor ID.
	 * @param instructorId the instructorId to set
	 * @throws IllegalArgumentException if the instructorId parameter is null or empty
	 */
	public void setInstructorId(String instructorId) {
		//Throw if instructorId is null or the string literal is null
		if (instructorId == null || "".equals(instructorId)) {
			throw new IllegalArgumentException("Invalid instructor id.");
		}
		
		this.instructorId = instructorId;
	}
	
	@Override
    public boolean isDuplicate(Activity activity) {
        if (!(activity instanceof Course)) {
            return false;
        }
        Course other = (Course) activity;
        return this.getName().equals(other.getName());
    }
	
	/**
	 * Checks meeting days, start time, and end time for Activity to set them
	 * Throws IllegalArgumentException if the meetingDays parameter is null or empty, if meetingDays
	 * are arranged, startTime and endTime must be non-zero, if meetingDays has an invalid character, if
	 * there are duplicates in meetingDays, or if startTime or endTime are outside the bounds of military
	 * time (0000 to 2359)
	 */
	@Override
	public void setMeetingDaysAndTime(String meetingDays, int startTime, int endTime) {
		//if meetingDays is null or empty string
		if (meetingDays == null || "".equals(meetingDays)) {
		    //throw IAE("Invalid meeting days and times.") // IAE = IllegalArgumentException
		    throw new IllegalArgumentException("Invalid meeting days and times.");
		}
	
	    //if meetingDays is "A" // Arranged
		else if ("A".equals(meetingDays)) {
			//if startTime is NOT 0 OR endTime is NOT 0
			if (startTime != 0 || endTime != 0) {
		    	//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
			
		    //set meetingDays to the parameter; startTime and endTime to 0
			super.setMeetingDaysAndTime(meetingDays, 0, 0);
		}
	    //otherwise //not arranged
		else {
			//create local variables to hold the counts for each weekday letter
			int monCount = 0;
			int tueCount = 0;
			int wedCount = 0;
			int thuCount = 0;
			int friCount = 0;
			
			//for all characters in meetingDays
			for (int i = 0; i < meetingDays.length(); i++) {
				char currentChar = meetingDays.charAt(i);
				
				//increment weekday letter counter if you find the letter // this will take several lines of code
				if (currentChar == 'M' || currentChar == 'T' || currentChar == 'W' || currentChar == 'H' || 
					currentChar == 'F') {
					
					switch (currentChar) {
						case 'M':
							monCount++;
							break;
						case 'T':
							tueCount++;
							break;
						case 'W':
							wedCount++;
							break;
						case 'H':
							thuCount++;
							break;
						case 'F':
							friCount++;
							break;
						default:
							throw new IllegalArgumentException("Invalid meeting days and times.");
					}
				}
				//if any invalid letters
				else {
					throw new IllegalArgumentException("Invalid meeting days and times.");
				}
			}
			
			//if any weekday letter counts are more than one // checks for duplicates
			if (monCount > 1 || tueCount > 1 || wedCount > 1 || thuCount > 1 || friCount > 1) {
				//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
		 
			//break apart startTime and endTime into hours and minutes //several lines of code
			int startHour = startTime / 100;
			int startMin = startTime % 100;
			int endHour = endTime / 100;
			int endMin = endTime % 100;
			
			if (startTime >= endTime) {
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
	
			//if startHour is invalid // not between 0 and 23, inclusive
			if (startHour < 0 || startHour >= UPPER_HOUR) {
				//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
			
			//if startMin is invalid // not between 0 and 59, inclusive
			if (startMin < 0 || startMin >= UPPER_MINUTE) {
				//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
	
			//if endHour is invalid // not between 0 and 23, inclusive
			if (endHour < 0 || endHour >= UPPER_HOUR) {
				//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
	
			//if endMin is invalid // not between 0 and 59, inclusive
			if (endMin < 0 || endMin >= UPPER_MINUTE) {
				//throw IAE("Invalid meeting days and times.")\
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
	
			//set fields for meetingDays, startTime, and endTime
			super.setMeetingDaysAndTime(meetingDays, startTime, endTime);
		}
	}

	/**
	 * A shorter version of the array to hold Course name, section,
	 * title and meeting string.
	 */
	@Override
	public String[] getShortDisplayArray() {
		//Initialize the array to hold Course name, section, title, and meeting string
		String[] shortArray = new String[SHORT_DISPLAY];
		//Fill with items
		shortArray[0] = getName();
		shortArray[1] = getSection();
		shortArray[2] = getTitle();
		shortArray[3] = getMeetingString();
		
		return shortArray;
	}

	/**
	 * An array to hold Course name, section, title, credits, 
	 * instructor id, meeting string, and an empty string.
	 */
	@Override
	public String[] getLongDisplayArray() {
		//Initialize the array to hold Course name, section, 
		//title, credits, instructorId, meeting string, empty string
		String[] longArray = new String[LONG_DISPLAY];
		
		//Fill with items
		longArray[0] = getName();
		longArray[1] = getSection();
		longArray[2] = getTitle();
		longArray[3] = Integer.toString(getCredits());
		longArray[4] = getInstructorId();
		longArray[5] = getMeetingString();
		longArray[6] = "";
		
		return longArray;
	}
	
	/**
	 * Returns a comma separated value String of all Course fields.
	 * Course makes use of all fields. If meeting is arranged, no start or end time required.
	 * @return String representation of Course
	 */
	@Override
	public String toString() {
	    if ("A".equals(getMeetingDays())) {
	        return name + "," + getTitle() + "," + section + "," + credits + "," + instructorId + "," + getMeetingDays();
	    }
	    return name + "," + getTitle() + "," + section + "," + credits + "," + 
	    			instructorId + "," + getMeetingDays() + "," + getStartTime() + "," + getEndTime(); 
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + credits;
		result = prime * result + ((instructorId == null) ? 0 : instructorId.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((section == null) ? 0 : section.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		Course other = (Course) obj;
		if (credits != other.credits)
			return false;
		if (instructorId == null) {
			if (other.instructorId != null)
				return false;
		} else if (!instructorId.equals(other.instructorId))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (section == null) {
			if (other.section != null)
				return false;
		} else if (!section.equals(other.section))
			return false;
		return true;
	}
}
