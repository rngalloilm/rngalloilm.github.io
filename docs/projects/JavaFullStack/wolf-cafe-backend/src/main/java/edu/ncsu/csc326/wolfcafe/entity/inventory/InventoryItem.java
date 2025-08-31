package edu.ncsu.csc326.wolfcafe.entity.inventory;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents an item in the inventory, linking an ingredient to a specific
 * inventory with a certain amount. This entity is used as a join table in the
 * database to manage the many-to-many relationship between Inventory and
 * Ingredient.
 */

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class InventoryItem {

    /**
     * The ID associated with this inventory item
     */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long       id;

    /**
     * The ingredient associated with this inventory item. Mapped by the
     * 'ingredientId' part of the composite key. Not used if item is used (one
     * or other)
     */
    @ManyToOne ( fetch = FetchType.LAZY, cascade = { CascadeType.REMOVE, CascadeType.PERSIST, CascadeType.REFRESH } )
    @JoinColumn ( nullable = true )
    private Ingredient ingredient;

    /**
     * The item associated with this inventory item. Mapped by the 'itemId' part
     * of the composite key. Not used if ingredient is used (one or other)
     */
    @ManyToOne ( fetch = FetchType.LAZY, cascade = CascadeType.MERGE )
    @JoinColumn ( nullable = true )
    private Item       item;

    /**
     * The amount of the ingredient held in this inventory item.
     */
    private int        amount;

}
