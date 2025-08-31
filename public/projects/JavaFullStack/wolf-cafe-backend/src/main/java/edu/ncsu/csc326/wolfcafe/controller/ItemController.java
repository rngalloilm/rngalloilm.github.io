package edu.ncsu.csc326.wolfcafe.controller;

import java.util.List;

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

import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateItemRequest;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.service.ItemService;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
import lombok.AllArgsConstructor;

/**
 * Controller for API endpoints for an Item
 */
@RestController
@RequestMapping ( "/api/items" )
@AllArgsConstructor
@CrossOrigin ( "*" )
public class ItemController {

    /** Link to ItemService */
    private final ItemService     itemService;

    private final LocationService locationService;

    /**
     * Adds an item to the list of items. Requires the STAFF role.
     *
     * @param itemDto
     *            item to add
     * @return added item
     */
    @PreAuthorize ( "hasRole('STAFF')" )
    @PostMapping
    public ResponseEntity<ItemDto> addItem ( @RequestBody final CreateItemRequest itemRequest ) {
        // make sure the item dto was provided
        if ( itemRequest.getItemDto() == null ) {
            throw new GeneralErrorException( "No item was specified" );
        }

        locationService.getLocation( itemRequest.getLocationId() ); // automatic
                                                                    // error
                                                                    // checking

        if ( itemRequest.getItemDto().getName() == null || itemRequest.getItemDto().getName().isEmpty() ) {
            throw new GeneralErrorException( "Cannot have null item name / empty item name" );
        }

        if ( itemRequest.getItemDto().getDescription() == null
                || itemRequest.getItemDto().getDescription().isEmpty() ) {
            throw new GeneralErrorException( "Cannot have null item description / empty item description" );
        }

        if ( itemRequest.getItemDto().getPrice() == 0 ) {
            throw new GeneralErrorException( "Cannot have price as $0 for an item" );
        }

        final List<ItemDto> items = itemService.getAllItems();
        for ( final ItemDto item : items ) {
            if ( item.getName().equalsIgnoreCase( itemRequest.getItemDto().getName() ) ) {
                throw new GeneralErrorException( "Found matching item name; cannot have 2 items with same name" );
            }
        }

        final ItemDto savedItem = itemService.addItem( itemRequest );

        return new ResponseEntity<>( savedItem, HttpStatus.CREATED );
    }

    /**
     * Gets an item by id. Requires the STAFF or CUSTOMER role.
     *
     * @param id
     *            item id
     * @return item with the id
     */
    @PreAuthorize ( "hasAnyRole('STAFF', 'CUSTOMER')" )
    @GetMapping ( "{id}" )
    public ResponseEntity<ItemDto> getItem ( @PathVariable ( "id" ) final Long id ) {
        final ItemDto item = itemService.getItem( id );
        return ResponseEntity.ok( item );
    }

    /**
     * Returns all items. Requires the STAFF or CUSTOMER role.
     *
     * @return a list of all items
     */
    @PreAuthorize ( "hasAnyRole('STAFF', 'CUSTOMER')" )
    @GetMapping
    public ResponseEntity<List<ItemDto>> getAllItems () {
        final List<ItemDto> items = itemService.getAllItems();
        return ResponseEntity.ok( items );
    }

    /**
     * Updates the item with the given id. Requires STAFF role.
     *
     * @param id
     *            item to update
     * @param itemDto
     *            information about the item to update
     * @return updated item
     */
    @PreAuthorize ( "hasRole('STAFF')" )
    @PutMapping ( "{id}" )
    public ResponseEntity< ? > updateItem ( @PathVariable ( "id" ) final Long id, @RequestBody final ItemDto itemDto ) {
        ItemDto updatedItem;
        try {
            updatedItem = itemService.updateItem( id, itemDto );
        }
        catch ( final IllegalAccessError e ) {
            return ResponseEntity.status( 405 ).body( "Item cannot be changed after existing in an order" );
        }
        return ResponseEntity.ok( updatedItem );
    }

    /**
     * Deletes the item with the given id. Requires the STAFF role.
     *
     * @param id
     *            item to delete
     * @return response indicating success or failure
     */
    @PreAuthorize ( "hasRole('STAFF')" )
    @DeleteMapping ( "{id}" )
    public ResponseEntity<String> deleteItem ( @PathVariable ( "id" ) final Long id ) {
        try {
            itemService.deleteItem( id );
        }
        catch ( final IllegalAccessError e ) {
            return ResponseEntity.status( 405 ).body( "Recipe cannot be changed after existing in an order" );
        }
        return ResponseEntity.ok( "Item deleted successfully" );
    }
}
