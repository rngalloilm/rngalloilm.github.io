package edu.ncsu.csc326.wolfcafe.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Exception for WolfCafe API calls.
 */
@Getter
@AllArgsConstructor
public class WolfCafeAPIException extends RuntimeException {
	 /** A unique identifier for serialization. */
	private static final long serialVersionUID = 1L;
	 /** The HTTP status associated with this exception. */
	private HttpStatus status;
	/** A descriptive message providing details about the exception. */
    private String message;
}
