package edu.ncsu.csc326.wolfcafe.dto.menu;

import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
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
public class MenuRecipeDto {
	/**
     * The unique identifier for the menu recipe.
     */
    private Long      id;
    /**
     * The detailed information about the recipe as a {@link RecipeDto}.
     */
    private RecipeDto recipe;
    /**
     * The ID of the menu to which this recipe belongs.
     */
    private Long      menuId;
    /**
     * A flag indicating whether the recipe is included in the menu.
     */
    private boolean   included;
}
