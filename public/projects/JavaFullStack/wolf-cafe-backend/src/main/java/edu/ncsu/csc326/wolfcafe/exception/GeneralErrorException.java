package edu.ncsu.csc326.wolfcafe.exception;

/**
 * Exception if we encounter any other error
 */
public class GeneralErrorException extends RuntimeException {

    /** Default serial version uid */
    private static final long serialVersionUID = 1L;

    /**
     * The error code for what the response should be when this exception is
     * thrown
     **/
    private final int         errorResponseCode;

    /**
     * Constructs the exception with the given message.
     *
     * @param errorResponseCode
     *            error response code
     * @param message
     *            exception message
     */
    public GeneralErrorException ( final int errorResponseCode, final String message ) {
        super( message );

        this.errorResponseCode = errorResponseCode;
    }

    /**
     * Constructs the exception with the given message.
     *
     * @param message
     *            exception message
     */
    public GeneralErrorException ( final String message ) {
        super( message );

        this.errorResponseCode = 400;
    }

    /**
     * Returns the error response code correlating with this exception
     *
     * @return the error response code
     */
    public int getErrorResponseCode () {
        return errorResponseCode;
    }
}
