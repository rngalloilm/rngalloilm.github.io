package edu.ncsu.csc216.wolf_hire.model.command;

/**
 * Command class
 * 
 * @author Nick Gallo
 */
public class Command {

	/** main command value */
	private CommandValue command;
	/** attached command information */
	private String commandInformation;
	
	/**
	 * Available commands to edit the Application's state
	 * @see ASSIGN changes state to reviewing
	 * @see REJECT changes state to rejected
	 * @see RESUBMIT changes state to submitted
	 * @see RETURN changes state to submitted
	 * @see SCHEDULE changes state to interviewing
	 * @see PROCESS changes state to processing
	 * @see HIRE changes state to hired
	 * @see TERMINATE changes state to inactive 
	 */
	public enum CommandValue { ASSIGN, REJECT, RESUBMIT, RETURN, SCHEDULE, PROCESS, HIRE, TERMINATE }
	
	/**
	 * Constructs an Command object with values for all fields
	 * @param command main command value
	 * @param commandInformation attached command information
	 */
	public Command(CommandValue command, String commandInformation) throws IllegalArgumentException {
        if (command == null) {
            throw new IllegalArgumentException("Invalid information.");
        }
        if ((command == CommandValue.ASSIGN || command == CommandValue.REJECT || 
        	command == CommandValue.TERMINATE) && (commandInformation == null || 
        	commandInformation.isEmpty())) {
        	
            throw new IllegalArgumentException("Invalid information.");
        }
        if ((command == CommandValue.RESUBMIT || command == CommandValue.RETURN || 
        	command == CommandValue.SCHEDULE || command == CommandValue.PROCESS || 
        	command == CommandValue.HIRE) && commandInformation != null) {
        	
            throw new IllegalArgumentException("Invalid information.");
        }
        
        this.command = command;
        this.commandInformation = commandInformation;
    }
	
	/**
	 * Gets command
	 * @return the command
	 */
	public CommandValue getCommand() {
		return command;
	}
	
	/**
	 * Gets commandInformation
	 * @return the commandInformation
	 */
	public String getCommandInformation() {
		return commandInformation;
	}
}
