package edu.ncsu.csc326.wolfcafe.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryItemDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateIngredientRequest;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.entity.inventory.InventoryItem;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.InventoryItemRepository;
import edu.ncsu.csc326.wolfcafe.service.IngredientService;
import edu.ncsu.csc326.wolfcafe.service.InventoryService;
import edu.ncsu.csc326.wolfcafe.service.RecipeService;

/**
 * Implementation of the IngredientService interface.
 */
@Service
public class IngredientServiceImpl implements IngredientService {
    /**
     * default constructor
     */
    public IngredientServiceImpl () {
        // default constructor
    }

    /** Autowire the ingredient repository **/
    @Autowired
    private IngredientRepository    ingredientRepository;

    /** Autowire the recipe service **/
    @Autowired
    private RecipeService           recipeService;

    /** Autowire the inventory service **/
    @Autowired
    private InventoryService        inventoryService;

    /** Autowire the inventory item repository **/
    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    private final ModelMapper       modelMapper = new ModelMapper();

    // The javadoc is in the interface for this class
    @Override
    public IngredientDto createIngredient ( final CreateIngredientRequest createIngredientRequest ) {
        final IngredientDto ingredientDto = createIngredientRequest.getIngredientDto();
        final int initialAmount = createIngredientRequest.getInitialAmount();

        final Ingredient ingredient = modelMapper.map( ingredientDto, Ingredient.class );
        final Ingredient savedIngredient = ingredientRepository.save( ingredient );

        final IngredientDto savedIngredientDto = modelMapper.map( savedIngredient, IngredientDto.class );

        if ( createIngredientRequest.getLocationId() != -1 ) {
            final InventoryDto inventoryDto = inventoryService.getInventory( createIngredientRequest.getLocationId() );
            inventoryService.saveInventoryItem( inventoryDto,
                    new InventoryItemDto( null, savedIngredientDto, null, initialAmount ) );
        }

        final List<InventoryDto> listOfInventories = inventoryService.getAllInventories();
        for ( final InventoryDto otherInventory : listOfInventories ) {
            if ( otherInventory.getId() != createIngredientRequest.getLocationId() ) {
                inventoryService.saveInventoryItem( otherInventory,
                        new InventoryItemDto( null, savedIngredientDto, null, 0 ) );
            }
        }

        return modelMapper.map( savedIngredient, IngredientDto.class );
    }

    // The javadoc is in the interface for this class
    @Override
    public IngredientDto createIngredientZeroQuantity ( final IngredientDto ingredientDto ) {
        return createIngredient( new CreateIngredientRequest( ingredientDto, 0, -1 ) );
    }

    /**
     * Retrieves an ingredient by its ID.
     *
     * @param ingredientId
     *            The ID of the ingredient to retrieve.
     * @return The IngredientDto corresponding to the specified ID.
     * @throws ResourceNotFoundException
     *             if no ingredient is found with the specified ID.
     */
    @Override
    public IngredientDto getIngredientById ( final Long ingredientId ) {
        final Ingredient ingredient = ingredientRepository.findById( ingredientId ).orElseThrow(
                () -> new ResourceNotFoundException( "Ingredient does not exist with id " + ingredientId ) );
        return modelMapper.map( ingredient, IngredientDto.class );
    }

    /**
     * Retrieves all ingredients in the system.
     *
     * @return A list of IngredientDto objects representing all ingredients.
     */
    @Override
    public List<IngredientDto> getAllIngredients () {
        final List<Ingredient> ingredients = ingredientRepository.findAll();
        return ingredients.stream().map( ( ingredient ) -> modelMapper.map( ingredient, IngredientDto.class ) )
                .collect( Collectors.toList() );
    }

    /**
     * Deletes an ingredient by its ID.
     *
     * @param ingredientId
     *            The ID of the ingredient to delete.
     * @throws ResourceNotFoundException
     *             if no ingredient is found with the specified ID.
     */
    @Override
    public void deleteIngredient ( final Long ingredientId ) {
        final Ingredient ingredient = ingredientRepository.findById( ingredientId ).orElseThrow(
                () -> new ResourceNotFoundException( "Ingredient does not exist with id " + ingredientId ) );

        long recipeConflict = -1;
        for ( final RecipeDto existingRecipe : recipeService.getAllRecipes() ) {
            final boolean includesIngredient = existingRecipe.getIngredients().stream()
                    .anyMatch( ( includedIngredient ) -> ingredientId == includedIngredient.getIngredient().getId() );

            if ( includesIngredient ) {
                recipeConflict = existingRecipe.getId();
            }
        }

        if ( recipeConflict != -1 ) {
            throw new GeneralErrorException( "This ingredient is used in Recipe " + recipeConflict
                    + ", please modify the recipe first before deleting." );
        }

        final List<InventoryDto> inventories = inventoryService.getAllInventories();

        for ( final InventoryDto inventory : inventories ) {
            final List<InventoryItemDto> itemsList = new ArrayList<>( inventory.getItems() );
            final Iterator<InventoryItemDto> items = itemsList.iterator();
            InventoryItemDto toBeDeleted = null;
            while ( items.hasNext() ) {
                final InventoryItemDto item = items.next();
                if ( item.getIngredient() != null && item.getIngredient().getId() == ingredientId ) {
                    items.remove();
                    toBeDeleted = item;
                    System.out.println( "Found inventory item. Deleting" );
                }
            }
            inventory.setItems( itemsList );

            inventoryService.updateInventory( inventory );
            if ( toBeDeleted != null ) {
                inventoryItemRepository.delete( modelMapper.map( toBeDeleted, InventoryItem.class ) );
                System.out.println( "deleting inventory item" );
            }
        }

        System.out.println( "deleting from ingredient repository" );
        ingredientRepository.delete( ingredient );
    }

    /**
     * Deletes all ingredients in the system. This operation removes all
     * ingredient records. Use with caution.
     */
    @Override
    public void deleteAllIngredients () {
        for ( final IngredientDto ingredient : getAllIngredients() ) {
            deleteIngredient( ingredient.getId() );
        }
    }

}
