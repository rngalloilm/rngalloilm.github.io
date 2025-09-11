package edu.ncsu.csc326.wolfcafe.repositories;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
//test class for Location Repository 
@DataJpaTest
@AutoConfigureTestDatabase ( replace = Replace.NONE )
class LocationRepositoryTest {

    /** Reference to the location repository **/
    @Autowired
    private LocationRepository locationRepository;

    @BeforeEach
    public void setUp () {
        // Clear repositories in the correct order to avoid foreign key
        // constraints

    }

    /**
     * Tests the creation and retrieval of a location.
     *
     * Verifies that a location can be created and retrieved by its ID, with the
     * correct details such as name, address, and tax rate.
     */
    @Test
    public void testCreateAndRetrieveLocation () {

        final Location location = new Location( null, "Test Cafe", "123 Test St", 0.05, new Menu(), new Inventory(),
                LocalTime.of( 18, 0 ) );
        final Location savedLocation = locationRepository.save( location );

        final Optional<Location> retrievedLocation = locationRepository.findById( savedLocation.getId() );

        assertTrue( retrievedLocation.isPresent() );
        assertAll( "Location contents", () -> assertEquals( savedLocation.getId(), retrievedLocation.get().getId() ),
                () -> assertEquals( "Test Cafe", retrievedLocation.get().getName() ),
                () -> assertEquals( "123 Test St", retrievedLocation.get().getAddress() ),
                () -> assertEquals( 0.05, retrievedLocation.get().getTaxRate() ) );
    }

    /**
     * Tests updating a location's details.
     *
     * Verifies that a location's details, such as name and tax rate, can be
     * updated and saved correctly.
     */
    @Test
    public void testUpdateLocation () {
        final Menu menu = new Menu();
        final Location location = new Location( null, "Old Cafe", "456 Old St", 0.04, menu, new Inventory(),
                LocalTime.of( 18, 0 ) );
        final Location savedLocation = locationRepository.save( location );

        // Update details
        savedLocation.setName( "Updated Cafe" );
        savedLocation.setTaxRate( 0.06 );
        locationRepository.save( savedLocation );

        final Optional<Location> updatedLocation = locationRepository.findById( savedLocation.getId() );

        assertTrue( updatedLocation.isPresent() );
        assertAll( "Updated location contents", () -> assertEquals( "Updated Cafe", updatedLocation.get().getName() ),
                () -> assertEquals( 0.06, updatedLocation.get().getTaxRate() ) );
    }

    /**
     * Tests deleting a location by ID.
     *
     * Verifies that a location can be deleted and is no longer retrievable.
     */
    @Test
    public void testDeleteLocation () {
        final Menu menu = new Menu();
        final Location location = new Location( null, "Delete Cafe", "789 Delete St", 0.03, menu, new Inventory(),
                LocalTime.of( 18, 0 ) );
        final Location savedLocation = locationRepository.save( location );

        // Delete the location
        locationRepository.deleteById( savedLocation.getId() );

        final Optional<Location> deletedLocation = locationRepository.findById( savedLocation.getId() );

        assertFalse( deletedLocation.isPresent() );
    }
}
