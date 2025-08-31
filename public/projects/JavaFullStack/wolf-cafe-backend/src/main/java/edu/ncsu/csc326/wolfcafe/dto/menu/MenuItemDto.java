package edu.ncsu.csc326.wolfcafe.dto.menu;

import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Item for data transfer.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDto {
	/**
    * The unique identifier for the menu item.
    */
    private Long    id;
    /**
     * The detailed information about the item as an {@link ItemDto}.
     */
    private ItemDto item;
    /**
     * The ID of the menu to which this item belongs.
     */
    private Long    menuId;
    /**
     * A flag indicating whether the item is included in the menu.
     */
    private boolean included;
}
