package edu.ncsu.csc326.wolfcafe.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) for InventoryItem. This class is used to transfer
 * data between the client and server in the context of inventory items.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItemDto {

    /** id for inventory entry */
    private Long          id;
    /** Ingredient associated with the InventoryItem */
    private IngredientDto ingredient;

    /** Item associated with the InventoryItem */
    private ItemDto       item;

    /** Amount of the ingredient available in the inventory */
    private int           amount;

}
