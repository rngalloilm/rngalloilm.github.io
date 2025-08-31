package edu.ncsu.csc326.wolfcafe.dto.inventory;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) for RecipeIngredient. This class is used to
 * transfer data between the client and server in the context of recipe
 * ingredients.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeIngredientDto implements Serializable {

    private static final long serialVersionUID = 1L;
    /**
     * The unique identifier for the RecipeIngredient relationship.
     */
    private Long              id;
    /** Recipe DTO **/
    private Long              recipeId;

    /** Ingredient DTO */
    private IngredientDto     ingredient;

    /** Amount of the ingredient required in the recipe */
    private Integer           amount;

}
