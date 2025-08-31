package edu.ncsu.csc326.wolfcafe.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Provides details on errors.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {
	  /** The timestamp when the error occurred. */
    private LocalDateTime timeStamp;
    /** A brief message describing the error. */
    private String message;
    /** Additional details about the error, such as the source or context. */
    private String details;
}
