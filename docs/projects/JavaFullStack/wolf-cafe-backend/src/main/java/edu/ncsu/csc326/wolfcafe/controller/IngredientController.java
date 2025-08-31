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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateIngredientRequest;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.service.IngredientService;
import edu.ncsu.csc326.wolfcafe.service.InventoryService;

/**
 * controller class for Ingredient
 */
@CrossOrigin ( "*" )
@RestController
@RequestMapping ( "/api/ingredients" )
public class IngredientController {

    /**
     * default constructor
     */
    public IngredientController () {
        // default constructor
    }

    /**
     * Autowire the Ingredient Service for us to utilize throughout the class
     **/
    @Autowired
    private IngredientService ingredientService;

    /**
     * Autowire the Inventory Service for usage in our create method to
     * instantiate a # of the created ingredient
     **/
    @Autowired
    private InventoryService  inventoryService;

    /**
     * GET a single ingredient by ID
     *
     * @param id
     *            the id of the ingredient
     * @return the response entity of the action
     */
    @GetMapping ( "{id}" )
    public ResponseEntity<IngredientDto> getIngredient ( @PathVariable ( "id" ) final Long id ) {
        System.out.println( "Get ingredient called: " + id );
        try {
            final IngredientDto ingredientDto = ingredientService.getIngredientById( id );
            return ResponseEntity.ok( ingredientDto );
        }
        catch ( final Exception e ) {
            return ResponseEntity.status( HttpStatus.NOT_FOUND ).body( null );
        }
    }

    /**
     * GET all ingredients
     *
     * @return the response entity of action
     */
    @GetMapping
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity<List<IngredientDto>> getAllIngredients () {
        final List<IngredientDto> ingredients = ingredientService.getAllIngredients();
        return ResponseEntity.ok( ingredients );
    }

    /**
     * POST/CREATE the new ingredient
     *
     * @param createIngredientRequest
     *            the ingredeintDto and initial inventory amount
     * @return the response entity of the POST action
     */
    @PostMapping
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity< ? > createIngredient ( @RequestBody final CreateIngredientRequest createIngredientRequest ) {
        System.out.println( "Received ingredient create request" );

        if ( createIngredientRequest.getIngredientDto().getName().length() == 0 ) {
            throw new GeneralErrorException( "Ingredient name is required." );
        }

        final int initialAmount = createIngredientRequest.getInitialAmount();
        if ( initialAmount < 0 ) {
            throw new GeneralErrorException( "Initial amount must be non-negative." );
        }

        final List<IngredientDto> dtos = ingredientService.getAllIngredients();
        for ( final IngredientDto dto : dtos ) {
            if ( dto.getName().equalsIgnoreCase( createIngredientRequest.getIngredientDto().getName() ) ) {
                throw new GeneralErrorException( "Ingredient name already exists" );
            }
        }

        final IngredientDto savedIngredientDto = ingredientService.createIngredient( createIngredientRequest );

        return ResponseEntity.ok( savedIngredientDto );
    }

    /**
     * DELETE a single ingredient by ID
     *
     * @param id
     *            the id of the ingredient
     * @return the response entity of the delete action
     */
    @DeleteMapping ( "{id}" )
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity<Void> deleteIngredient ( @PathVariable ( "id" ) final Long id ) {
        System.out.println( "Attempting to delete " + id );
        ingredientService.deleteIngredient( id );
        return ResponseEntity.status( HttpStatus.NO_CONTENT ).build();
    }

    /**
     * DELETE all ingredients
     *
     * @return the response entity of the delete operaiton
     */
    @DeleteMapping
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity<Void> deleteAllIngredients () {
        ingredientService.deleteAllIngredients();
        return ResponseEntity.status( HttpStatus.NO_CONTENT ).build();
    }
}
