package edu.ncsu.csc326.wolfcafe.service;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryItemDto;

/**
 * Interface defining the inventory behaviors.
 */
public interface InventoryService {

    /**
     * Returns the single inventory.
     *
     * @return the single inventory
     */
    InventoryDto getInventory ( Long locationId );

    /**
     * Updates the contents of the inventory.
     *
     * @param inventoryDto
     *            values to update
     * @return updated inventory
     */
    InventoryDto updateInventory ( InventoryDto inventoryDto );

    /**
     * Updates the contents of the inventory for a singular inventory item
     *
     * @param inventoryDto
     *            inventory to update
     *
     * @param existingItem
     *            item to update
     * @return updated inventory
     */
    InventoryItemDto saveInventoryItem ( InventoryDto inventoryDto, InventoryItemDto existingItem );

    /**
     * Updates the status of an existing order.
     *
     * @param id
     *            the ID of the order to update.
     * @param status
     *            the new status for the order.
     * @return the updated order as an {@link OrderDto}.
     */
    List<InventoryDto> getAllInventories ();
}
