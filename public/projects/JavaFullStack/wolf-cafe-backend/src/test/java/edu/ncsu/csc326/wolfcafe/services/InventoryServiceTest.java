package edu.ncsu.csc326.wolfcafe.services;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryItemDto;
import edu.ncsu.csc326.wolfcafe.service.IngredientService;
import edu.ncsu.csc326.wolfcafe.service.InventoryService;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
import jakarta.transaction.Transactional;

/**
 * Tests InventoryServiceImpl.
 */
@SpringBootTest
public class InventoryServiceTest {

    /** Reference to InventoryService (and InventoryServiceImpl). */
    @Autowired
    private InventoryService    inventoryService;

    /** Reference to the Ingredient service **/
    @Autowired
    private IngredientService   ingredientService;

    /** Reference to the Location service **/
    @Autowired
    private LocationService     locationService;

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil;

    private Long                testLocationId;

    /**
     * Sets up the test case.
     */
    @BeforeEach
    public void setUp () throws Exception {
        databaseCleanupUtil.truncateAllTables();

        // Create a test location, which automatically creates an inventory
        final LocationDto locationDto = new LocationDto( null, "Test Location", "123 Test St", 0.08, null, null,
                LocalTime.of( 18, 0 ) );
        final LocationDto createdLocation = locationService.createLocation( locationDto );
        testLocationId = createdLocation.getId();

    }

    /**
     * Tests InventoryService.getInventory() for an empty inventory.
     */
    @Test
    @Transactional
    public void testGetInventoryWhenEmpty () {
        // Call the service method to get the inventory for the test location
        final InventoryDto inventoryDto = inventoryService.getInventory( testLocationId );

        // Verify the contents of the retrieved inventory through the location
        // ID
        final LocationDto location = locationService.getLocation( testLocationId );
        assertAll( "Retrieved InventoryDto contents",
                () -> assertEquals( location.getInventoryId(), inventoryDto.getId() ),
                () -> assertEquals( 0, inventoryDto.getItems().size() ) );
    }

    /**
     * Tests InventoryService.updateInventory(). 
     */
    @Test
    @Transactional
    public void testUpdateInventory () {
        // Retrieve the automatically created inventory for the location
        final InventoryDto initialInventoryDto = inventoryService.getInventory( testLocationId );

        // Create a new IngredientDto
        final IngredientDto coffeeDto = new IngredientDto();
        coffeeDto.setName( "COFFEE" );

        final IngredientDto createdIngredient = ingredientService.createIngredientZeroQuantity( coffeeDto );

        // Create InventoryItemDto with the ingredient and amount
        final InventoryItemDto inventoryItemDto = new InventoryItemDto( null, createdIngredient, null, 35 );
        // Set the items in the inventory DTO
        initialInventoryDto.setItems( List.of( inventoryItemDto ) );

        // Call the service method to update the inventory
        final InventoryDto updatedInventoryDto = inventoryService.updateInventory( initialInventoryDto );

        // Retrieve location to confirm association with updated inventory
        final LocationDto location = locationService.getLocation( testLocationId );

        // Verify the updated inventory through location ID
        assertAll( "Updated InventoryDto contents",
                () -> assertEquals( location.getInventoryId(), updatedInventoryDto.getId() ),
                () -> assertEquals( 1, updatedInventoryDto.getItems().size() ),
                () -> assertEquals( "COFFEE", updatedInventoryDto.getItems().get( 0 ).getIngredient().getName() ),
                () -> assertEquals( 35, updatedInventoryDto.getItems().get( 0 ).getAmount() ) );
    }
}
