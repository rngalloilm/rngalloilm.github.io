package edu.ncsu.csc216.wolf_hire.model.command;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import edu.ncsu.csc216.wolf_hire.model.command.Command.CommandValue;

class CommandTest {

	@Test
	public void testConstructorAssign() {
		Command command = new Command(CommandValue.ASSIGN, "assign information");
		assertEquals(CommandValue.ASSIGN, command.getCommand());
		assertEquals("assign information", command.getCommandInformation());
	}
	
	@Test
	public void testConstructorReject() {
		Command command = new Command(CommandValue.REJECT, "reject information");
		assertEquals(CommandValue.REJECT, command.getCommand());
		assertEquals("reject information", command.getCommandInformation());
	}
	
	@Test
	public void testConstructorResubmit() {
		Command command = new Command(CommandValue.RESUBMIT, null);
		assertEquals(CommandValue.RESUBMIT, command.getCommand());
		assertNull(command.getCommandInformation());
	}
	
	@Test
	public void testConstructorResubmitWithInfo() {
		try {
			new Command(CommandValue.RESUBMIT, "resubmit information");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorReturn() {
		Command command = new Command(CommandValue.RETURN, null);
		assertEquals(CommandValue.RETURN, command.getCommand());
		assertNull(command.getCommandInformation());
	}
	
	@Test
	public void testConstructorReturnWithInfo() {
		try {
			new Command(CommandValue.RETURN, "return information");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorSchedule() {
		Command command = new Command(CommandValue.SCHEDULE, null);
		assertEquals(CommandValue.SCHEDULE, command.getCommand());
		assertNull(command.getCommandInformation());
	}
	
	@Test
	public void testConstructorScheduleWithInfo() {
		try {
			new Command(CommandValue.SCHEDULE, "schedule information");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorProcess() {
		Command command = new Command(CommandValue.PROCESS, null);
		assertEquals(CommandValue.PROCESS, command.getCommand());
		assertNull(command.getCommandInformation());
	}
	
	@Test
	public void testConstructorProcessWithInfo() {
		try {
			new Command(CommandValue.PROCESS, "process information");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorHire() {
		Command command = new Command(CommandValue.HIRE, null);
		assertEquals(CommandValue.HIRE, command.getCommand());
		assertNull(command.getCommandInformation());
	}
	
	@Test
	public void testConstructorHireWithInfo() {
		try {
			new Command(CommandValue.HIRE, "hire information");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorTerminate() {
		Command command = new Command(CommandValue.TERMINATE, "terminate information");
		assertEquals(CommandValue.TERMINATE, command.getCommand());
		assertEquals("terminate information", command.getCommandInformation());
	}
	
	@Test
	public void testConstructorTerminateWithEmptyInfo() {
		try {
			new Command(CommandValue.TERMINATE, "");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorTerminateWithNullInfo() {
		try {
			new Command(CommandValue.TERMINATE, null);
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorInvalidCommand() {
		try {
			new Command(null, "invalid information");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorInvalidAssignInfo() {
		try {
			new Command(CommandValue.ASSIGN, null);
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorInvalidRejectInfo() {
		try {
			new Command(CommandValue.REJECT, "");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}
	
	@Test
	public void testConstructorInvalidTerminateInfo() {
		try {
			new Command(CommandValue.TERMINATE, "");
			fail("IllegalArgumentException should have been thrown.");
		} catch (IllegalArgumentException e) {
			assertEquals("Invalid information.", e.getMessage());
		}
	}

}
