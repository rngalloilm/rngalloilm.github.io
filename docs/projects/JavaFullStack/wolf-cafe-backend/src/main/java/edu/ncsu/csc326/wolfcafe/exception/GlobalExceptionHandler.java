package edu.ncsu.csc326.wolfcafe.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Handles global errors.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    //
    // @ExceptionHandler ( WolfCafeAPIException.class )
    // public ResponseEntity<ErrorDetails> handleAPIException ( final
    // WolfCafeAPIException exception,
    // final WebRequest webRequest ) {
    // final ErrorDetails errorDetails = new ErrorDetails( LocalDateTime.now(),
    // exception.getMessage(),
    // webRequest.getDescription( false ) );
    //
    // return new ResponseEntity<>( errorDetails, HttpStatus.BAD_REQUEST );
    // }

    /**
     * Handles exceptions of type {@link GeneralErrorException} and returns a
     * custom error response.
     *
     * @param ex
     *            the exception thrown that needs to be handled
     * @return a {@link ResponseEntity} containing the {@link ErrorResponse}
     *         with the exception message and an HTTP status code of
     *         {@code 400 Bad Request}
     */
    @ExceptionHandler ( { GeneralErrorException.class } )
    public ResponseEntity<ErrorResponse> handleCustomBadRequestException ( final GeneralErrorException ex ) {
        if ( ex.getErrorResponseCode() == 400 ) {
            return ResponseEntity.status( HttpStatus.BAD_REQUEST ).body( new ErrorResponse( ex.getMessage() ) );
        }
        else {
            return ResponseEntity.status( HttpStatus.CONFLICT ).body( new ErrorResponse( ex.getMessage() ) );
        }
        // else {
        // throw new RuntimeException( "Error response code not defined!" );
        // }
    }

    /**
     * Handles exceptions of type {@link WolfCafeAPIException} and returns a
     * custom error response.
     *
     * @param ex
     *            the exception thrown that needs to be handled
     * @return a {@link ResponseEntity} containing the {@link ErrorResponse}
     *         with the exception message and an HTTP status code of
     *         {@code 400 Bad Request}
     */
    @ExceptionHandler ( { WolfCafeAPIException.class } )
    public ResponseEntity<ErrorResponse> handleCustomBadRequestException ( final WolfCafeAPIException ex ) {
        return ResponseEntity.status( HttpStatus.BAD_REQUEST ).body( new ErrorResponse( ex.getMessage() ) );
    }

    /**
     * Handles exceptions of type {@link ResourceNotFoundException} and returns
     * a custom error response.
     *
     * @param ex
     *            the exception thrown that needs to be handled
     * @return a {@link ResponseEntity} containing the {@link ErrorResponse}
     *         with the exception message and an HTTP status code of
     *         {@code 400 Bad Request}
     */
    @ExceptionHandler ( ResourceNotFoundException.class )
    public ResponseEntity<ErrorResponse> handleResoruceNotFoundException ( final ResourceNotFoundException ex ) {
        return ResponseEntity.status( HttpStatus.NOT_FOUND ).body( new ErrorResponse( ex.getMessage() ) );
    }
}
