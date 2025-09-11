package edu.ncsu.csc326.wolfcafe.service;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateItemRequest;

/**
 * Item service
 */
public interface ItemService {

    /**
     * Adds given item with given quantity for given location (in the create
     * item request object)
     *
     * @param itemRequest
     *            item to add
     * @return added item
     */
    ItemDto addItem ( CreateItemRequest itemRequest );

    /**
     * Adds given item initializing all locations to 0 for the quantity in the
     * inventory
     *
     * @param itemRequest
     *            item to add
     * @return added item
     */
    ItemDto addItemZeroQuantity ( ItemDto itemDto );

    /**
     * Gets item by id
     *
     * @param id
     *            id of item to get
     * @return returned item
     */
    ItemDto getItem ( Long id );

    /**
     * Returns all items
     *
     * @return all items
     */
    List<ItemDto> getAllItems ();

    /**
     * Updates the item with the given id
     *
     * @param id
     *            id of item to update
     * @param itemDto
     *            information of item to update
     * @return updated item
     */
    ItemDto updateItem ( Long id, ItemDto itemDto );

    /**
     * Deletes the item with the given id
     *
     * @param id
     *            id of item to delete
     */
    void deleteItem ( Long id );
}
