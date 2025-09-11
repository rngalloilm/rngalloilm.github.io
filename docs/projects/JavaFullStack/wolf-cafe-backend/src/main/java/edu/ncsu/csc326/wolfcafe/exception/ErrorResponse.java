package edu.ncsu.csc326.wolfcafe.exception;

/**
 * A simple DTO representing an error response. This class is used to
 * encapsulate error messages in a consistent format when exceptions occur in
 * CoffeeMaker.
 */
public class ErrorResponse {

    /** The error message to be returned in the response. */
    private final String error;

    /**
     * Constructs an {@code ErrorResponse} with the specified error message.
     *
     * @param error
     *            the error message to be set
     */
    public ErrorResponse ( final String error ) {
        this.error = error;
    }

    /**
     * Returns the current error message.
     *
     * @return the error message
     */
    public String getError () {
        return error;
    }

    /**
     * Sets a new error message.
     *
     * @param error
     *            the error message to set
     */
    // public void setError ( final String error ) {
    // this.error = error;
    // }
}
