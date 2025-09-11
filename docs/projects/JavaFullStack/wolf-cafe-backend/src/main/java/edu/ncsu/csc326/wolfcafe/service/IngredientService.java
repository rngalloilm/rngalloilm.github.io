package edu.ncsu.csc326.wolfcafe.service;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateIngredientRequest;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;

/**
 * Service interface for managing Ingredient entities and operations. Provides
 * methods to create, retrieve, update, and delete ingredients in the system.
 */
public interface IngredientService {

    /**
     * Creates a new ingredient in the system with a specified amount of
     * ingredients at a given location
     *
     * @param createIngredientRequest
     *            The DTO containing the details of the ingredient to create and
     *            the amount to add to a location
     * @return The created IngredientDto with its ID and other attributes.
     */
    IngredientDto createIngredient ( CreateIngredientRequest createIngredientRequest );

    /**
     * Creates a new ingredient in the system with all locations initializing to
     * 0 amounts for the inventory
     *
     * @param ingredient
     *            The DTO containing the details of the ingredient to create.
     * @return The created IngredientDto with its ID and other attributes.
     */
    IngredientDto createIngredientZeroQuantity ( IngredientDto ingredient );

    /**
     * Retrieves an ingredient by its ID.
     *
     * @param ingredientId
     *            The ID of the ingredient to retrieve.
     * @return The IngredientDto corresponding to the specified ID.
     * @throws ResourceNotFoundException
     *             if no ingredient is found with the specified ID.
     */
    IngredientDto getIngredientById ( Long ingredientId );

    /**
     * Retrieves all ingredients in the system.
     *
     * @return A list of IngredientDto objects representing all ingredients.
     */
    List<IngredientDto> getAllIngredients ();

    /**
     * Deletes an ingredient by its ID.
     *
     * @param ingredientId
     *            The ID of the ingredient to delete.
     * @throws ResourceNotFoundException
     *             if no ingredient is found with the specified ID.
     */
    void deleteIngredient ( Long ingredientId );

    /**
     * Deletes all ingredients in the system. Use with caution as this operation
     * removes all ingredient records.
     */
    void deleteAllIngredients ();
}
