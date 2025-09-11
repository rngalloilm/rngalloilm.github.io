package edu.ncsu.csc326.wolfcafe.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
//units test for LocationService 
@SpringBootTest
public class LocationServiceTest {

    @Autowired
    private LocationService     locationService; // Inject the LocationService 

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil; // Utility to clean the database 

    private LocationDto         initialLocation; // DTO for the initial location
    /**
     * setting up the enviroment for test cases 
     */
    @BeforeEach
    public void setUp () {
        databaseCleanupUtil.truncateAllTables();
        initialLocation = locationService.createLocation(
                new LocationDto( 0L, "Test Cafe", "789 Initial St", 0.06, null, null, LocalTime.of( 18, 0 ) ) );
    }
    /**
     * Test case for creating a new location.
     */
    @Test
    @Transactional
    public void testCreateLocation () {
        final LocationDto newLocation = new LocationDto( 0L, "Another Cafe", "123 New St", 0.07, null, null,
                LocalTime.of( 18, 0 ) );
        final LocationDto savedLocation = locationService.createLocation( newLocation );

        assertNotNull( savedLocation );
        assertEquals( "Another Cafe", savedLocation.getName() );
        assertEquals( "123 New St", savedLocation.getAddress() );
    }
    /**
     * Test case for retrieving a location by its ID. 
     */
    @Test
    @Transactional
    public void testGetLocation () {
        final LocationDto foundLocation = locationService.getLocation( initialLocation.getId() );

        assertNotNull( foundLocation );
        assertEquals( initialLocation.getName(), foundLocation.getName() );
        assertEquals( initialLocation.getAddress(), foundLocation.getAddress() );
    }
    /**
     * Test case for retrieving all locations.
     */
    @Test
    @Transactional
    public void testGetAllLocations () {
        final List<LocationDto> locations = locationService.getAllLocations();

        assertNotNull( locations );
        assertEquals( 1, locations.size() ); // Assuming only the initial
                                             // location exists
    }
    /**
     * Test case for deleting a location.
     */
    @Test
    @Transactional
    public void testDeleteLocation () {
        locationService.deleteLocation( initialLocation.getId() );

        assertThrows( ResourceNotFoundException.class, () -> {
            locationService.getLocation( initialLocation.getId() );
        } );
    }
}
