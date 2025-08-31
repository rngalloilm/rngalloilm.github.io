package edu.ncsu.csc326.wolfcafe.controller;

import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.UserRepository;
import edu.ncsu.csc326.wolfcafe.service.LocationService;

/**
 * controller class for Ingredient
 */
@CrossOrigin ( "*" )
@RestController
@RequestMapping ( "/api/locations" )
public class LocationController {

    /**
     * default constructor
     */
    public LocationController () {

    }

    /**
     * Autowire the Location Service for us to utilize throughout the class
     **/
    @Autowired
    private LocationService locationService;

    /**
     * Autowire the User Repository for us to utilize throughout the class
     **/
    @Autowired
    private UserRepository  userRepository;

    @PreAuthorize ( "hasAnyRole('STAFF', 'ADMIN')" )
    @GetMapping ( "{id}" )
    public ResponseEntity<LocationDto> getLocation ( @PathVariable ( "id" ) final Long id ) {

        try {
            final LocationDto ingredientDto = locationService.getLocation( id );
            return ResponseEntity.ok( ingredientDto );
        }
        catch ( final Exception e ) {
            return ResponseEntity.status( HttpStatus.NOT_FOUND ).body( null );
        }
    }

    /**
     * Get all the locations
     *
     * @return all the locations in the system
     */
    @GetMapping
    public ResponseEntity<List<LocationDto>> getAllLocations () {
        final List<LocationDto> locations = locationService.getAllLocations();
        return ResponseEntity.ok( locations );
    }

    /**
     * Creates a new location.
     *
     * Only accessible by users with the ADMIN role.
     *
     * @param locationDto
     *            the LocationDto containing the details of the new location.
     * @return ResponseEntity containing the created LocationDto object.
     * @throws GeneralErrorException
     *             if required fields are missing or validation fails.
     */
    @PreAuthorize ( "hasRole('ADMIN')" )
    @PostMapping
    public ResponseEntity< ? > createLocation ( @RequestBody final LocationDto locationDto ) {
        if ( locationDto.getAddress() == null || locationDto.getAddress().length() == 0 ) {
            throw new GeneralErrorException( "Address for the location is required." );
        }

        final double taxRate = locationDto.getTaxRate();
        if ( taxRate < 0.02 ) {
            throw new GeneralErrorException( "Tax rate must be at least 2%" );
        }

        if ( locationDto.getEndOfDayTime() == null ) {
            throw new GeneralErrorException( "End of day time must exist." );
        }

        if ( locationDto.getEndOfDayTime().isBefore( LocalTime.of( 0, 0 ) )
                || locationDto.getEndOfDayTime().isAfter( LocalTime.of( 23, 59 ) ) ) {
            throw new GeneralErrorException( "End of day time must be within 00:00 and 23:59." );
        }

        final List<LocationDto> dtos = locationService.getAllLocations();
        for ( final LocationDto dto : dtos ) {
            if ( dto.getId() == locationDto.getId() || dto.getName().equalsIgnoreCase( locationDto.getName() )
                    || dto.getAddress().equalsIgnoreCase( locationDto.getAddress() ) ) {
                throw new GeneralErrorException( "Location already exists" );
            }
        }

        final LocationDto savedLocationDto = locationService.createLocation( locationDto );
        return ResponseEntity.ok( savedLocationDto );
    }

    /**
     * Delete the location with the given id
     *
     * @param id
     *            the id of the location
     * @return ResponseEntity if the deletion was successful
     */
    @PreAuthorize ( "hasRole('ADMIN')" )
    @DeleteMapping ( "{id}" )
    public ResponseEntity<Void> deleteLocation ( @PathVariable ( "id" ) final Long id ) {
        for ( final User user : userRepository.findAll() ) {
            if ( user.getLocation() != null && user.getLocation().getId() == id ) {
                throw new GeneralErrorException( "Cannot delete a location with staff members associated to it" );
            }
        }

        locationService.deleteLocation( id );
        return ResponseEntity.status( HttpStatus.NO_CONTENT ).build();
    }

    /**
     * Updates the tax rate of a location.
     *
     * @param id
     *            the id of the location
     * @param locationDto
     * @return the response entity if the tax rate for the given location was
     *         successfully updated
     * @throw ResourceNotFoundException if the location with the given id can
     *        not be found GeneralErrorException if the tax rate is not at least
     *        2% GeneralErrorException if there is a bad request
     *        GeneralErrorException if there is internal server_error
     */
    @PreAuthorize ( "hasRole('ADMIN')" )
    @PutMapping ( "{id}/taxrate" )
    public ResponseEntity< ? > setLocationTax ( @PathVariable ( "id" ) final Long id,
            @RequestBody final LocationDto locationDto ) {
        try {
            final Double taxRate = locationDto.getTaxRate();

            if ( taxRate < 0.02 ) {
                throw new GeneralErrorException( "Tax rate must be at least 2%" );
            }

            locationService.setLocationTax( id, taxRate );
            return ResponseEntity.ok().build();
        }
        catch ( final ResourceNotFoundException e ) {
            return ResponseEntity.status( HttpStatus.NOT_FOUND ).body( e.getMessage() );
        }
        catch ( final GeneralErrorException e ) {
            return ResponseEntity.status( HttpStatus.BAD_REQUEST ).body( e.getMessage() );
        }
        catch ( final Exception e ) {
            return ResponseEntity.status( HttpStatus.INTERNAL_SERVER_ERROR ).body( "An unexpected error occurred." );
        }
    }

}
