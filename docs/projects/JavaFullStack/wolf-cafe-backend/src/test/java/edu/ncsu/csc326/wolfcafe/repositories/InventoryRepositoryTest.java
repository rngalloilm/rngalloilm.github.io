
package edu.ncsu.csc326.wolfcafe.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;
import edu.ncsu.csc326.wolfcafe.entity.inventory.InventoryItem;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.InventoryRepository;

@DataJpaTest
@AutoConfigureTestDatabase ( replace = Replace.NONE )
public class InventoryRepositoryTest {

    /** Autowire the inventory repository for usage in our tests **/
    @Autowired
    private InventoryRepository  inventoryRepository;

    /** Autowire the ingredient repository for usage in our tests **/
    @Autowired
    private IngredientRepository ingredientRepository;

    private final ModelMapper    modelMapper = new ModelMapper();

    /**
     * Private variable instantiated in the setup method for usage in the tests
     **/
    private Inventory            inventory;

    /**
     * Sets up the initial test data for each test.
     *
     * Clears the inventory and ingredient tables, creates individual
     * ingredients (COFFEE, MILK, SUGAR, CHOCOLATE), and saves them to the
     * repository. Creates an inventory with these ingredients and specified
     * quantities, then saves the inventory to the repository.
     */
    @BeforeEach
    public void setUp () {
        // Create individual ingredients
        final Ingredient coffee = new Ingredient( "COFFEE" );
        final Ingredient milk = new Ingredient( "MILK" );
        final Ingredient sugar = new Ingredient( "SUGAR" );
        final Ingredient chocolate = new Ingredient( "CHOCOLATE" );

        // Save ingredients to the repository
        ingredientRepository.saveAll( Arrays.asList( coffee, milk, sugar, chocolate ) );

        // Create the inventory and associate it with the inventory items
        inventory = new Inventory();

        // Create inventory items with quantities and set the composite key
        final List<InventoryItem> inventoryItems = Arrays.asList( new InventoryItem( null, coffee, null, 20 ),
                new InventoryItem( null, milk, null, 14 ), new InventoryItem( null, sugar, null, 32 ),
                new InventoryItem( null, chocolate, null, 10 ) );

        inventory.setInventoryItems( inventoryItems );

        // Save the inventory
        inventoryRepository.save( inventory );
    }

    /**
     * Tests the saving and retrieval of an inventory.
     *
     * Verifies that the saved inventory can be successfully fetched and mapped
     * to an InventoryDto. Asserts that the fetched inventory matches the
     * expected values, including the ID and the quantities of ingredients
     * (COFFEE: 20, MILK: 14, SUGAR: 32, CHOCOLATE: 10).
     */
    @Test
    public void testSaveAndGetInventory () {
        // Fetch the saved inventory and map to DTO
        final Inventory fetchedInventory = inventoryRepository.findById( inventory.getId() ).orElse( null );

        // Assert that the fetched inventory is not null
        assertNotNull( fetchedInventory, "Inventory should be found" );

        final InventoryDto fetchedInventoryDto = modelMapper.map( fetchedInventory, InventoryDto.class );
        assertEquals( inventory.getId(), fetchedInventoryDto.getId() );

        // Validate the quantities of the ingredients
        assertEquals( 20, fetchedInventoryDto.getItems().stream()
                .filter( item -> item.getIngredient().getName().equals( "COFFEE" ) ).findFirst().get().getAmount() );

        assertEquals( 14, fetchedInventoryDto.getItems().stream()
                .filter( item -> item.getIngredient().getName().equals( "MILK" ) ).findFirst().get().getAmount() );

        assertEquals( 32, fetchedInventoryDto.getItems().stream()
                .filter( item -> item.getIngredient().getName().equals( "SUGAR" ) ).findFirst().get().getAmount() );

        assertEquals( 10, fetchedInventoryDto.getItems().stream()
                .filter( item -> item.getIngredient().getName().equals( "CHOCOLATE" ) ).findFirst().get().getAmount() );
    }

}
