
package edu.ncsu.csc326.wolfcafe.entity.inventory;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

/**
 * Inventory for the coffee maker. Inventory is a Data Access Object (DAO) tied
 * to the database using Hibernate libraries. InventoryRepository provides the
 * methods for database CRUD operations.
 */
@Entity
public class Inventory {

    /** id for inventory entry */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long                id;

    @OneToMany ( cascade = CascadeType.ALL, orphanRemoval = true )
    private List<InventoryItem> items;

    /**
     * Empty constructor for Hibernate
     */
    public Inventory () {
        // Intentionally empty so that Hibernate can instantiate
        // Inventory object.
    }

    /**
     * Returns the ID of the entry in the DB.
     *
     * @return id
     */

    public Long getId () {
        return id;
    }

    /**
     * Sets the ID of the Inventory (used by Hibernate).
     *
     * @param id
     *            the ID to set
     */
    public void setId ( final Long id ) {
        this.id = id;
    }

    /**
     * Returns the list of ingredients in the inventory.
     *
     * @return list of ingredients
     */
    public List<InventoryItem> getInventoryItems () {
        return items;
    }

    /**
     * Sets the list of ingredients in the inventory.
     *
     * @param inventoryItems
     *            the ingredients to set
     */
    public void setInventoryItems ( final List<InventoryItem> inventoryItems ) {
        this.items = inventoryItems;
    }

}
