package edu.ncsu.csc326.wolfcafe.controller;

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

import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeIngredientDto;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.service.RecipeService;
import jakarta.persistence.EntityManager;

/**
 * Controller for Recipes.
 */
@CrossOrigin ( "*" )
@RestController
@RequestMapping ( "/api/recipes" )
public class RecipeController {

    /** Connection to RecipeService */
    @Autowired
    private RecipeService recipeService;

    @Autowired
    private EntityManager entityManager;

    /**
     * REST API method to provide GET access to all recipes in the system
     *
     * @return JSON representation of all recipes
     */
    @GetMapping
    @PreAuthorize ( "hasAnyRole('STAFF', 'CUSTOMER')" )
    public List<RecipeDto> getRecipes () {
        return recipeService.getAllRecipes();
    }

    /**
     * REST API method to provide GET access to a specific recipe, as indicated
     * by the path variable provided (the name of the recipe desired)
     *
     * @param name
     *            recipe name
     * @return response to the request
     */
    @GetMapping ( "{name}" )
    @PreAuthorize ( "hasAnyRole('STAFF', 'CUSTOMER')" )
    public ResponseEntity<RecipeDto> getRecipe ( @PathVariable ( "name" ) final String name ) {
        System.out.println( "Getting recipes" );
        final RecipeDto recipeDto = recipeService.getRecipeByName( name );
        System.out.println( "Returning " + recipeDto );
        return ResponseEntity.ok( recipeDto );
    }

    /**
     * REST API method to provide POST access to the Recipe model.
     *
     * @param recipeDto
     *            The valid Recipe to be saved.
     * @return ResponseEntity indicating success if the Recipe could be saved to
     *         the inventory, or an error if it could not be
     */
    @PostMapping
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity<RecipeDto> createRecipe ( @RequestBody final RecipeDto recipeDto ) {
        if ( recipeDto.getPrice() <= 0 ) {
            throw new GeneralErrorException( "Price must be >= 1" );
        }

        if ( recipeService.isDuplicateName( recipeDto.getName(), -1 ) ) {
            throw new GeneralErrorException( 407, "Duplicate recipe name" );
        }

        int validAmount = 0;
        for ( final RecipeIngredientDto ingredient : recipeDto.getIngredients() ) {
            if ( ingredient.getAmount() <= 0 ) {
                throw new GeneralErrorException( "Ingredient amounts must be >= 1" );
            }
            else {
                validAmount++;
            }
        }

        if ( validAmount == 0 ) {
            throw new GeneralErrorException( "No ingredients were specified" );
        }

        if ( recipeService.getAllRecipes().size() < 3 ) {
            final RecipeDto savedRecipeDto = recipeService.createRecipe( recipeDto );
            return ResponseEntity.ok( savedRecipeDto );
        }
        else {
            return ResponseEntity.status( HttpStatus.INSUFFICIENT_STORAGE ).body( null );
        }
    }

    /**
     * REST API method to allow updating the ingredients list, name or price of
     * an existing recipe with a PUT call to the API endpoint.
     *
     * @param recipeDto
     * @return ResponseEntity indicating success if the Recipe could be updated,
     *         or an error if the recipe can not be found.
     */
    @PutMapping
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity< ? > updateRecipe ( @RequestBody final RecipeDto recipeDto ) {
        try {
            if ( recipeService.isDuplicateName( recipeDto.getName(), recipeDto.getId() ) ) {
                throw new GeneralErrorException( 407, "Duplicate recipe name" );
            }

            recipeService.updateRecipe( recipeDto );
            final RecipeDto retrievedDto = recipeService.getRecipeById( recipeDto.getId() );
            return ResponseEntity.ok( retrievedDto );
        }
        catch ( final ResourceNotFoundException e ) {
            return ResponseEntity.badRequest().body( "Recipe not found: " + recipeDto.getId() );
        }
        catch ( final IllegalAccessError e ) {
            return ResponseEntity.status( 405 ).body( "Recipe cannot be changed after existing in an order" );
        }
    }

    /**
     * REST API method to allow deleting a Recipe from the CoffeeMaker's
     * Inventory, by making a DELETE request to the API endpoint and indicating
     * the recipe to delete (as a path variable)
     *
     * @param name
     *            The name of the Recipe to delete
     * @return Success if the recipe could be deleted; an error if the recipe
     *         does not exist
     */
    @DeleteMapping ( "{id}" )
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity<String> deleteRecipe ( @PathVariable ( "id" ) final Long recipeId ) {
        try {
            recipeService.deleteRecipe( recipeId );
        }
        catch ( final IllegalAccessError e ) {
            return ResponseEntity.status( 405 ).body( "Recipe cannot be changed after existing in an order" );
        }
        return ResponseEntity.ok( "Recipe deleted successfully." );
    }
}
