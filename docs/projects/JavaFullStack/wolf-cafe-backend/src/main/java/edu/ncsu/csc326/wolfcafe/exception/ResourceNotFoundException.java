package edu.ncsu.csc326.wolfcafe.exception;

/**
 * Exception if a resource is not found in the database.
 */
public class ResourceNotFoundException extends RuntimeException {

    /** Default serial version uid */
    private static final long serialVersionUID = 1L;

    /**
     * Constructs the exception with the given message.
     *
     * @param message
     *            exception message
     */
    public ResourceNotFoundException ( final String message ) {
        super( message );
    }

}
