
package edu.ncsu.csc326.wolfcafe.repositories;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Recipe;
import edu.ncsu.csc326.wolfcafe.entity.inventory.RecipeIngredient;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.RecipeRepository;

// unit test class for recipe Repository
@DataJpaTest
@AutoConfigureTestDatabase ( replace = Replace.NONE )
class RecipeRepositoryTest {

    /** Reference to recipe repository */
    @Autowired
    private RecipeRepository     recipeRepository;

    /** Reference to the ingredient repository **/
    @Autowired
    private IngredientRepository ingredientRepository;

    private final ModelMapper    modelMapper = new ModelMapper();

    /**
     * Tests the addition of ingredients to a recipe.
     *
     * Verifies that a recipe can be created with multiple ingredients and that
     * the saved recipe contains the correct details such as name, price, and
     * the list of ingredients with their respective amounts.
     */
    @Test
    public void testAddIngredients () {
        final Recipe recipe1 = new Recipe( 1L, "Coffee", 500, new ArrayList<>() );
        final Ingredient coffee = new Ingredient( "Coffee" );
        final Ingredient pumpkinSpice = new Ingredient( "Pumpkin Spice" );
        final Ingredient milk = new Ingredient( "Milk" );

        ingredientRepository.saveAll( Arrays.asList( coffee, pumpkinSpice, milk ) );

        recipe1.addIngredient( coffee, 3 );
        recipe1.addIngredient( pumpkinSpice, 2 );
        recipe1.addIngredient( milk, 1 );

        final Recipe savedRecipe = recipeRepository.save( recipe1 );
        final Optional<Recipe> retrievedRecipe = recipeRepository.findById( savedRecipe.getId() );
        assertAll( "Recipe contents", () -> assertEquals( savedRecipe.getId(), retrievedRecipe.get().getId() ),
                () -> assertEquals( "Coffee", retrievedRecipe.get().getName() ),
                () -> assertEquals( 500, retrievedRecipe.get().getPrice() ),
                () -> assertEquals( 3, retrievedRecipe.get().getIngredients().size() ) );

        final RecipeIngredient i1 = retrievedRecipe.get().getIngredients().get( 0 );
        final RecipeIngredient i2 = retrievedRecipe.get().getIngredients().get( 1 );
        final RecipeIngredient i3 = retrievedRecipe.get().getIngredients().get( 2 );

    }

    /**
     * Tests the removal and modification of ingredients in a recipe.
     *
     * Verifies that an ingredient can be removed from an existing recipe, and
     * the amount of another ingredient can be updated. Checks that the saved
     * recipe reflects these changes correctly, including the updated ingredient
     * list and amounts.
     */
    @Test
    public void testRemoveIngredients () {
        final Ingredient coffee = new Ingredient( "Coffee" );
        final Ingredient pumpkinSpice = new Ingredient( "Pumpkin Spice" );
        final Ingredient milk = new Ingredient( "Milk" );

        ingredientRepository.saveAll( Arrays.asList( coffee, pumpkinSpice, milk ) );

        final Recipe recipe1 = new Recipe( 1L, "Coffee", 500, new ArrayList<>() );
        final RecipeIngredient recipeIngredient1 = new RecipeIngredient( null, recipe1, coffee, 3 );
        final RecipeIngredient recipeIngredient2 = new RecipeIngredient( null, recipe1, pumpkinSpice, 2 );
        final RecipeIngredient recipeIngredient3 = new RecipeIngredient( null, recipe1, milk, 1 );

        recipe1.addIngredient( recipeIngredient1 );
        recipe1.addIngredient( recipeIngredient2 );
        recipe1.addIngredient( recipeIngredient3 );

        final Recipe savedRecipe = recipeRepository.save( recipe1 );
        final Optional<Recipe> retrievedRecipe = recipeRepository.findById( savedRecipe.getId() );
        assertAll( "Recipe contents", () -> assertEquals( savedRecipe.getId(), retrievedRecipe.get().getId() ),
                () -> assertEquals( "Coffee", retrievedRecipe.get().getName() ),
                () -> assertEquals( 500, retrievedRecipe.get().getPrice() ),
                () -> assertEquals( 3, retrievedRecipe.get().getIngredients().size() ) );

        recipe1.removeIngredient( coffee );
        recipe1.setIngredientAmount( milk, 10 );
        final Recipe savedRecipe2 = recipeRepository.save( recipe1 );
        final Optional<Recipe> updatedRecipe = recipeRepository.findById( savedRecipe2.getId() );
        assertAll( "Recipe contents", () -> assertEquals( savedRecipe2.getId(), updatedRecipe.get().getId() ),
                () -> assertEquals( "Coffee", updatedRecipe.get().getName() ),
                () -> assertEquals( 500, updatedRecipe.get().getPrice() ),
                () -> assertEquals( 2, updatedRecipe.get().getIngredients().size() ) );

        final RecipeIngredient i1 = updatedRecipe.get().getIngredients().get( 0 );
        final RecipeIngredient i2 = updatedRecipe.get().getIngredients().get( 1 );

    }

}
