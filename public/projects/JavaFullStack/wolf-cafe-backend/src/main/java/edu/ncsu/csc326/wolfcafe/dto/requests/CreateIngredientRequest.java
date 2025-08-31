package edu.ncsu.csc326.wolfcafe.dto.requests;

import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateIngredientRequest {
    /** The ingredient DTO associated with this request. **/
    private IngredientDto ingredientDto;

    /**
     * The initial amount of the ingredient to be associated with this
     * ingredient in the inventory
     **/
    private int           initialAmount;
    /**
     * the if of the location
     */
    private long          locationId;
}
