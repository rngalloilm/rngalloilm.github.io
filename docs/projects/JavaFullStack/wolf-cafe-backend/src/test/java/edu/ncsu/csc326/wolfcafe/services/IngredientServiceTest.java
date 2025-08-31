
package edu.ncsu.csc326.wolfcafe.services;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.service.IngredientService;
import jakarta.transaction.Transactional;

/**
 * This test class is responsible for testing the functionality of the
 * `IngredientService`. It covers all CRUD operations including creating,
 * retrieving, updating, and deleting ingredients. It ensures that the service
 * methods work as expected and interact properly with the data layer. 
 */
@SpringBootTest
public class IngredientServiceTest {

    @Autowired
    private IngredientService   ingredientService;

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil;

    /**
     * Sets up the test environment by deleting all existing ingredients in the
     * service. This method is executed before each test to ensure a consistent
     * state for testing.
     *
     * @throws Exception
     *             if any error occurs during setup.
     */
    @BeforeEach
    public void setUp () throws Exception {
        databaseCleanupUtil.truncateAllTables();

    }

    /**
     * Tests the creation of ingredients using the
     * `createIngredientZeroQuantity` method in the service. It verifies that
     * the ingredients are correctly created and their names match the expected
     * values.
     */
    @Test
    @Transactional
    public void testCreateIngredient () {
        // Attempt to create an ingredient twice and double check its name to
        // verify creation

        final IngredientDto ingredient1 = new IngredientDto( "Coffee" );

        final IngredientDto createdIngredient1 = ingredientService.createIngredientZeroQuantity( ingredient1 );
        assertAll( "Ingredient contents", () -> assertEquals( "Coffee", createdIngredient1.getName() ) );

        final IngredientDto ingredient2 = new IngredientDto( "Pumpkin Spice" );
        final IngredientDto createdIngredient2 = ingredientService.createIngredientZeroQuantity( ingredient2 );
        assertAll( "Ingredient contents", () -> assertEquals( "Pumpkin Spice", createdIngredient2.getName() ) );
    }

    /**
     * Tests the retrieval of an ingredient by its ID using the
     * `getIngredientById` method. It verifies that the ingredient can be
     * fetched by its ID and that the fetched ingredient's name matches the
     * expected name.
     */
    @Test
    @Transactional
    public void testGetIngredientById () {
        // Verify that ingredients can be fetched by their created ID

        final IngredientDto ingredient1 = new IngredientDto( "Coffee" );
        final IngredientDto createdIngredient1 = ingredientService.createIngredientZeroQuantity( ingredient1 );
        final IngredientDto fetchedIngredient1 = ingredientService.getIngredientById( createdIngredient1.getId() );
        assertAll( "Ingredient contents", () -> assertEquals( "Coffee", fetchedIngredient1.getName() ) );

        final IngredientDto ingredient2 = new IngredientDto( "Pumpkin Spice" );
        final IngredientDto createdIngredient2 = ingredientService.createIngredientZeroQuantity( ingredient2 );
        final IngredientDto fetchedIngredient2 = ingredientService.getIngredientById( createdIngredient2.getId() );
        assertAll( "Ingredient contents", () -> assertEquals( "Pumpkin Spice", fetchedIngredient2.getName() ) );
    }

    /**
     * Tests the deletion of an ingredient using the `deleteIngredient` method.
     * It verifies that the ingredient is successfully deleted and cannot be
     * retrieved afterwards, ensuring that a `ResourceNotFoundException` is
     * thrown when trying to fetch the deleted ingredient.
     */
    @Test
    @Transactional
    public void testDeleteIngredient () {
        // Create and add an ingredient
        final IngredientDto ingredientDto = new IngredientDto( "Honey" );
        final IngredientDto createdIngredient = ingredientService.createIngredientZeroQuantity( ingredientDto );
        final Long id = createdIngredient.getId();

        // Delete the ingredient
        ingredientService.deleteIngredient( id );

        // Verify the ingredient is deleted
        assertThrows( ResourceNotFoundException.class, () -> {
            ingredientService.getIngredientById( id );
        } );
    }

    /**
     * Tests the retrieval of all ingredients using the `getAllIngredients`
     * method. It verifies that the correct number of ingredients are returned
     * and matches the expected count.
     */
    @Test
    @Transactional
    public void testGetAllIngredients () {
        // Create and add multiple ingredients
        ingredientService.createIngredientZeroQuantity( new IngredientDto( "Salt" ) );
        ingredientService.createIngredientZeroQuantity( new IngredientDto( "Pepper" ) );
        ingredientService.createIngredientZeroQuantity( new IngredientDto( "Sugar" ) );

        // Retrieve all ingredients
        final List<IngredientDto> ingredients = ingredientService.getAllIngredients();

        // Verify that the ingredients count matches the expected count
        assertEquals( 3, ingredients.size(), "The number of ingredients should be 3" );
    }

    /**
     * Tests the updating of an ingredient's name using the
     * `createIngredientZeroQuantity` method. It verifies that the ingredient's
     * name is successfully updated and reflects the new name.
     */
    @Test
    @Transactional
    public void testUpdateIngredient () {
        // Create and add an ingredient
        final IngredientDto ingredientDto = new IngredientDto( "Pepper" );
        final IngredientDto createdIngredient = ingredientService.createIngredientZeroQuantity( ingredientDto );
        final Long id = createdIngredient.getId();

        // Update the ingredient name
        final IngredientDto updatedIngredientDto = new IngredientDto( id, "Black Pepper" );
        final IngredientDto updatedIngredient = ingredientService.createIngredientZeroQuantity( updatedIngredientDto );

        // Verify the update
        assertAll( "Updated Ingredient contents",
                () -> assertEquals( id, updatedIngredient.getId(), "ID should match" ),
                () -> assertEquals( "Black Pepper", updatedIngredient.getName(), "Name should be updated" ) );
    }

    /**
     * Tests the retrieval of a non-existent ingredient by ID using the
     * `getIngredientById` method. It verifies that a
     * `ResourceNotFoundException` is thrown with the expected message when
     * attempting to fetch an ingredient that does not exist.
     */
    @Test
    @Transactional
    public void testGetNonExistentIngredient () {
        // Attempt to retrieve a non-existent ingredient by ID
        final Long nonExistentId = 999L;

        // Verify that retrieving non-existent ingredient throws an exception
        final Exception exception = assertThrows( ResourceNotFoundException.class, () -> {
            ingredientService.getIngredientById( nonExistentId );
        } );

        // Verify the exception message
        final String expectedMessage = "Ingredient does not exist with id " + nonExistentId;
        final String actualMessage = exception.getMessage();
        assertTrue( actualMessage.contains( expectedMessage ),
                "Exception message should contain the expected message" );
    }

}
