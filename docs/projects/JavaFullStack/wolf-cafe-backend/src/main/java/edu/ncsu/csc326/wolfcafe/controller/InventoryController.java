package edu.ncsu.csc326.wolfcafe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryItemDto;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.service.InventoryService;

/**
 * Controller for CoffeeMaker's inventory. The inventory is a singleton; there's
 * only one row in the database that contains the current inventory for the
 * system.
 */
@CrossOrigin ( "*" )
@RestController
@RequestMapping ( "/api/inventory" )
public class InventoryController {
    /**
     * default constructor
     */
    public InventoryController () {
        // default constructor
    }

    @Autowired
    private InventoryService inventoryService;

    /**
     * REST API endpoint to provide GET access to the CoffeeMaker's singleton
     * Inventory.
     *
     * @return response to the request
     */
    @GetMapping ( "{id}" )
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity<InventoryDto> getInventory ( @PathVariable ( "id" ) final Long locationIid ) {
        final InventoryDto inventoryDto = inventoryService.getInventory( locationIid );
        return ResponseEntity.ok( inventoryDto );
    }

    /**
     * REST API endpoint to update arbitrary ingredients in the inventory.
     *
     * @param inventoryDto
     *            List of ingredients with updated amounts
     * @return response to the request
     */
    @PutMapping ( "{id}" )
    @PreAuthorize ( "hasRole('STAFF')" )
    public ResponseEntity< ? > updateInventory ( @PathVariable ( "id" ) final Long locationId,
            @RequestBody final InventoryDto inventoryDto ) {
        for ( final InventoryItemDto itemDto : inventoryDto.getItems() ) {
            System.out.println( "Checking item: " + itemDto );

            if ( itemDto.getAmount() < 0 ) {
                throw new GeneralErrorException( "Invalid Unit: All item amounts must be positive integers." );
            }
        }

        // Update and get the updated inventory
        final InventoryDto updatedInventory = inventoryService.updateInventory( inventoryDto );

        return ResponseEntity.ok( updatedInventory );
    }

}
