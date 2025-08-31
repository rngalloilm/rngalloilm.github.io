
package edu.ncsu.csc326.wolfcafe.dto.inventory;

import java.util.ArrayList;
import java.util.List;

/**
 * Used to transfer Inventory data between the client and server. This class
 * will serve as the response in the REST API.
 */
public class InventoryDto {

    /** id for inventory entry */
    private Long                   id;

    /** List of arbitrary items */
    private List<InventoryItemDto> items;

    /**
     * Default InventoryDto constructor.
     */
    public InventoryDto () {
        this.items = new ArrayList<>();
    }

    /**
     * Gets the inventory id.
     *
     * @return the id
     */
    public Long getId () {
        return id;
    }

    /**
     * Inventory id to set.
     *
     * @param id
     *            the id to set
     */
    public void setId ( final Long id ) {
        this.id = id;
    }

    /**
     * Gets the list of items.
     *
     * @return the items
     */
    public List<InventoryItemDto> getItems () {
        return items;
    }

    /**
     * Set the list of items.
     *
     * @param items
     *            the items to set
     */
    public void setItems ( final List<InventoryItemDto> items ) {
        this.items = items;
    }

}
