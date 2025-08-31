package edu.ncsu.csc326.wolfcafe.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryItemDto;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;
import edu.ncsu.csc326.wolfcafe.entity.inventory.InventoryItem;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.InventoryRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.ItemRepository;
import edu.ncsu.csc326.wolfcafe.service.InventoryService;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
import jakarta.transaction.Transactional;

/**
 * Implementation of the InventoryService interface.
 */
@Service
public class InventoryServiceImpl implements InventoryService {

    /** Autowire the inventory repository **/
    @Autowired
    private InventoryRepository  inventoryRepository;

    /** Autowire the item repository **/
    @Autowired
    private ItemRepository       itemRepository;

    /** Autowire the ingredient repository **/
    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private LocationService      locationService;

    private final ModelMapper    modelMapper = new ModelMapper();

    /**
     * Updates the contents of the inventory.
     *
     * @param inventoryDto
     *            values to update
     * @return updated inventory
     */
    @Override
    @Transactional
    public InventoryDto updateInventory ( final InventoryDto inventoryDto ) {
        // Retrieve the existing inventory entity from the repository
        Inventory existingInventory = inventoryRepository.findById( inventoryDto.getId() ).orElseThrow(
                () -> new ResourceNotFoundException( "Inventory does not exist with id of " + inventoryDto.getId() ) );

        // Map and validate ingredients from the DTO
        for ( final InventoryItemDto inventoryItemDto : inventoryDto.getItems() ) {
            // Save or update the inventory item (in case it's new)
            saveInventoryItem( existingInventory, inventoryItemDto );
        }

        existingInventory = inventoryRepository.findById( inventoryDto.getId() ).orElseThrow(
                () -> new ResourceNotFoundException( "Inventory does not exist with id of " + inventoryDto.getId() ) );

        // Find items that are in the existing inventory but not in the DTO, to
        // remove them
        final List<InventoryItem> itemsToRemove = existingInventory
                .getInventoryItems().stream().filter( item1 -> inventoryDto.getItems().stream()
                        // the next two lines serve to check if they match
                        // ingredients/item)
                        .noneMatch( item2 -> ( item2.getIngredient() != null && item1.getIngredient() != null
                                && item2.getIngredient().getId().equals( item1.getIngredient().getId() ) )
                                || ( item2.getItem() != null && item1.getItem() != null
                                        && item2.getItem().getId().equals( item1.getItem().getId() ) ) ) )
                .collect( Collectors.toList() );

        // Remove items that are not in the updated DTO
        existingInventory.getInventoryItems().removeAll( itemsToRemove );

        // Save and return the updated inventory DTO
        return modelMapper.map( inventoryRepository.save( existingInventory ), InventoryDto.class );
    }

    /**
     * Saves an InventoryItem to the repository and updates the inventory.
     *
     * @param inventory
     *            The Inventory entity to be updated.
     * @param inventoryItemDto
     *            The InventoryItemDto entity to save.
     * @return The InventoryItemDto representing the saved or updated inventory
     *         item.
     */
    @Transactional
    public InventoryItemDto saveInventoryItem ( final Inventory inventory, final InventoryItemDto inventoryItemDto ) {
        InventoryItem existingItem = null;

        // Retrieve the associated Ingredient entity by ID
        if ( inventoryItemDto.getIngredient() != null ) {
            final Ingredient ingredient = ingredientRepository.findById( inventoryItemDto.getIngredient().getId() )
                    .orElseThrow( () -> new ResourceNotFoundException(
                            "Ingredient not found with id " + inventoryItemDto.getIngredient().getId() ) );

            // Fetch and initialize the inventory items collection to prevent
            // lazy
            // loading issues
            Hibernate.initialize( inventory.getInventoryItems() );

            // Find if the inventory already has the item
            existingItem = inventory.getInventoryItems().stream().filter(
                    item -> item.getIngredient() != null && item.getIngredient().getId().equals( ingredient.getId() ) )
                    .findFirst().orElse( null );

            if ( existingItem != null ) {
                existingItem.setAmount( inventoryItemDto.getAmount() );
            }
            else {
                // If the item does not exist, create a new InventoryItem
                final InventoryItem inventoryItem = new InventoryItem( null, ingredient, null,
                        inventoryItemDto.getAmount() );
                inventory.getInventoryItems().add( inventoryItem );
                existingItem = inventoryItem;
            }
        }
        else {
            final Item item = itemRepository.findById( inventoryItemDto.getItem().getId() )
                    .orElseThrow( () -> new ResourceNotFoundException(
                            "Ingredient not found with id " + inventoryItemDto.getItem().getId() ) );

            // Fetch and initialize the inventory items collection to prevent
            // lazy
            // loading issues
            Hibernate.initialize( inventory.getInventoryItems() );

            // Find if the inventory already has the item
            existingItem = inventory.getInventoryItems().stream().filter(
                    foundItem -> foundItem.getItem() != null && foundItem.getItem().getId().equals( item.getId() ) )
                    .findFirst().orElse( null );

            if ( existingItem != null ) {
                existingItem.setAmount( inventoryItemDto.getAmount() );
            }
            else {
                // If the item does not exist, create a new InventoryItem
                final InventoryItem inventoryItem = new InventoryItem( null, null, item, inventoryItemDto.getAmount() );
                inventory.getInventoryItems().add( inventoryItem );
                existingItem = inventoryItem;
            }
        }

        // Save the updated inventory to the repository
        inventoryRepository.save( inventory );

        return modelMapper.map( existingItem, InventoryItemDto.class );
    }

    /**
     * Saves an InventoryItem to the repository and updates the inventory.
     *
     * @param inventoryDto
     *            The InventoryDto representing the inventory to be updated.
     * @param inventoryItemDto
     *            The InventoryItemDto entity to save.
     * @return The InventoryItemDto representing the saved or updated inventory
     *         item.
     */
    @Transactional
    @Override
    public InventoryItemDto saveInventoryItem ( final InventoryDto inventoryDto,
            final InventoryItemDto inventoryItemDto ) {
        final Inventory inventory = inventoryRepository.findById( inventoryDto.getId() ).orElseThrow(
                () -> new ResourceNotFoundException( "Inventory not found with id " + inventoryDto.getId() ) );
        return saveInventoryItem( inventory, inventoryItemDto );
    }

    /**
     * get the inventory with the given location id
     *
     * @param loctationId
     *            the id of the location
     * @return the The InventoryItemDto representing the inventory item.
     */
    @Override
    public InventoryDto getInventory ( final Long locationId ) {
        return modelMapper.map(
                inventoryRepository.findById( locationService.getLocation( locationId ).getInventoryId() )
                        .orElseThrow( () -> new GeneralErrorException(
                                "Had an issue finding the inventory associated with that location" ) ),
                InventoryDto.class );
    }

    /**
     * get the inventory
     *
     * @return the The InventoryItemDto representing the inventory item.
     */
    @Override
    public List<InventoryDto> getAllInventories () {
        return inventoryRepository.findAll().stream()
                .map( ( inventory ) -> modelMapper.map( inventory, InventoryDto.class ) )
                .collect( Collectors.toList() );
    }
}
