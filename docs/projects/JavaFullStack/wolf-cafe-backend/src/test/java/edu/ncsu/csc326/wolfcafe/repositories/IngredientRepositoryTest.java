package edu.ncsu.csc326.wolfcafe.repositories;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.InventoryRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.RecipeRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRepository;
import jakarta.transaction.Transactional;

/**
 * This test class is responsible for testing the functionality of the
 * IngredientRepository, which includes creating, retrieving, updating, and
 * deleting ingredients. It ensures that the repository methods work as expected
 * and interact properly with the database. 
 */
@DataJpaTest
@AutoConfigureTestDatabase ( replace = Replace.NONE )
class IngredientRepositoryTest {

    /** Autowire all 3 repositories for usage later in **/

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private RecipeRepository     recipeRepository;

    @Autowired
    private InventoryRepository  inventoryRepository;

    @Autowired
    private MenuRepository       menuRepository;

    /**
     * Store the ingredients up here for usage in all the tests from the setup
     * method
     **/
    private Long                 ingredient1Id;
    private Long                 ingredient2Id;
    private Long                 ingredient3Id;

    /**
     * Sets up the test environment by deleting all existing ingredients in the
     * repository and adding three new ingredients (Coffee, Pumpkin Spice, Hot
     * Peppers). This method is executed before each test to ensure a consistent
     * state for testing.
     *
     * @throws Exception
     *             if any error occurs during setup.
     */
    @BeforeEach
    public void setUp () throws Exception {

        // Go ahead and add two ingredients to test each service method with

        final Ingredient ingredient1 = new Ingredient( "Coffee" );
        final Ingredient ingredient2 = new Ingredient( "Pumpkin Spice" );
        final Ingredient ingredient3 = new Ingredient( "Hot Peppers" );

        ingredient1Id = ingredientRepository.save( ingredient1 ).getId();
        ingredient2Id = ingredientRepository.save( ingredient2 ).getId();
        ingredient3Id = ingredientRepository.save( ingredient3 ).getId();
    }

    /**
     * Tests the addition of ingredients to the repository. It verifies that the
     * IDs and names of the ingredients match the expected values that were set
     * up in the repository.
     */
    @Test
    @Transactional
    public void testAddIngredients () {
        // Check the ID of each ingredient against the repository from the setup
        // method
        final Ingredient i1 = ingredientRepository.findById( ingredient1Id ).get();
        assertAll( "Ingredient contents", () -> assertEquals( ingredient1Id, i1.getId() ),
                () -> assertEquals( "Coffee", i1.getName() ) );

        final Ingredient i2 = ingredientRepository.findById( ingredient2Id ).get();
        assertAll( "Ingredient contents", () -> assertEquals( ingredient2Id, i2.getId() ),
                () -> assertEquals( "Pumpkin Spice", i2.getName() ) );

        final Ingredient i3 = ingredientRepository.findById( ingredient3Id ).get();
        assertAll( "Ingredient contents", () -> assertEquals( ingredient3Id, i3.getId() ),
                () -> assertEquals( "Hot Peppers", i3.getName() ) );
    }

    /**
     * Tests the retrieval of all ingredients from the repository. It verifies
     * that the repository contains the expected number of ingredients.
     */
    @Test
    @Transactional
    public void testGetAllIngredients () {
        // Ensure the repository is tracking the right amount of ingredients
        assertEquals( 3, ingredientRepository.count() );
    }

    /**
     * Tests updating the name of an existing ingredient in the repository. It
     * changes the name of the first ingredient from "Coffee" to "Espresso" and
     * verifies that the change has been correctly saved in the repository.
     */
    @Transactional
    public void testUpdateIngredientName () {
        // Fetch the existing ingredient
        final Ingredient ingredient = ingredientRepository.findById( ingredient1Id ).get();

        // Update the name of the ingredient
        ingredient.setName( "Espresso" );
        ingredientRepository.save( ingredient );

        // Verify that the name has been updated
        final Ingredient updatedIngredient = ingredientRepository.findById( ingredient1Id ).get();
        assertAll( "Updated Ingredient contents", () -> assertEquals( ingredient1Id, updatedIngredient.getId() ),
                () -> assertEquals( "Espresso", updatedIngredient.getName() ) );
    }

    /**
     * Tests the deletion of an ingredient from the repository. It deletes the
     * third ingredient (Hot Peppers) and verifies that the repository count has
     * been reduced and that the deleted ingredient is no longer present in the
     * repository.
     */
    @Test
    @Transactional
    public void testDeleteIngredient () {
        // Delete the third ingredient

        ingredientRepository.deleteById( ingredient3Id );

        // Verify that the ingredient count is now 2
        assertEquals( 2, ingredientRepository.count() );

        // Check that the ingredient has been removed
        assertFalse( ingredientRepository.findById( ingredient3Id ).isPresent() );
    }

}
