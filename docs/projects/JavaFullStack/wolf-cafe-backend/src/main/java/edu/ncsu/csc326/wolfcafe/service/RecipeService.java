package edu.ncsu.csc326.wolfcafe.service;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;

/**
 * Interface defining the recipe behaviors.
 */
public interface RecipeService {

    /**
     * Creates a recipe with the given information.
     *
     * @param recipeDto
     *            recipe to create
     * @return created recipe
     */
    RecipeDto createRecipe ( RecipeDto recipeDto );

    /**
     * Returns the recipe with the given id.
     *
     * @param recipeId
     *            recipe's id
     * @return the recipe with the given id
     * @throws ResourceNotFoundException
     *             if the recipe doesn't exist
     */
    RecipeDto getRecipeById ( Long recipeId );

    /**
     * Returns the recipe with the given name
     *
     * @param recipeName
     *            recipe's name
     * @return the recipe with the given name.
     * @throws ResourceNotFoundException
     *             if the recipe doesn't exist
     */
    RecipeDto getRecipeByName ( String recipeName );

    /**
     * Returns true if the recipe already exists in the database.
     *
     * @param recipeName
     *            recipe's name to check
     * @param existingId
     *            if the recipe already exists, double check with the ID to
     *            ensure same recipe. Else, pass -1
     * @return true if already in the database
     */
    boolean isDuplicateName ( String recipeName, long existingId );

    /**
     * Returns a list of all the recipes
     *
     * @return all the recipes
     */
    List<RecipeDto> getAllRecipes ();

    /**
     * Updates the recipe with the given id with the given name and price
     *
     * @param recipeDto
     *            values to update
     * @return updated recipe
     * @throws ResourceNotFoundException
     *             if the recipe doesn't exist
     */
    RecipeDto updateRecipe ( RecipeDto recipeDto );

    /**
     * RecipeDto addIngredient ( long recipeId, IngredientDto ingredientDto );
     *
     * RecipeDto editIngredient ( long recipeId, IngredientDto ingredientDto );
     *
     * RecipeDto deleteIngredient ( long recipeId, IngredientDto ingredientDto
     * );
     */

    /**
     * Deletes the recipe with the given id
     *
     * @param recipeId
     *            recipe's id
     * @throws ResourceNotFoundException
     *             if the recipe doesn't exist
     */
    void deleteRecipe ( Long recipeId );

}
