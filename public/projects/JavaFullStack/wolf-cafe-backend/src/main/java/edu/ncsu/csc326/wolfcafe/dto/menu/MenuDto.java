package edu.ncsu.csc326.wolfcafe.dto.menu;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
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
public class MenuDto {
	/**
     * The location associated with the menu.
     */
    private LocationDto         location;
    /**
     * The list of recipes available on the menu.
     */
    private List<MenuRecipeDto> recipeList;
    /**
     * The list of items available on the menu.
     */
    private List<MenuItemDto>   itemList;

}
