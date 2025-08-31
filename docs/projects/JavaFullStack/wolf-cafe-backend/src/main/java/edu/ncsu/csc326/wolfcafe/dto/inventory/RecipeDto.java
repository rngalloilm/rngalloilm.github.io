package edu.ncsu.csc326.wolfcafe.dto.inventory;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Used to transfer Recipe data between the client and server. This class will
 * serve as the response in the REST API.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDto {

    /** Recipe Id */
    private Long                      id;

    /** Recipe name */
    private String                    name;

    /** Recipe price */
    private Integer                   price;

    /** The List of Recipe Ingredients */
    private List<RecipeIngredientDto> ingredients;

    /**
     * Set the amount of an ingredient in the DTO that is required in the
     * recipe.
     *
     * @param ingredient
     *            the DTO of the ingredient that is being set
     * @param amount
     *            the amount of the ingredient that is being set
     */
    public void setIngredientAmount ( final RecipeIngredientDto ingredient, final Integer amount ) {
        ingredient.setAmount( amount );
    }

    /**
     * Returns a list of ingredients
     *
     * @return The ingredients
     */
    public List<RecipeIngredientDto> getIngredients () {
        return this.ingredients;
    }

    /**
     * Removes an ingredient from the recipe's DTO.
     *
     * @param ingredient
     *            the ingredient to remove
     */
    public void removeIngredient ( final IngredientDto ingredient ) {
        this.ingredients.removeIf( ing -> ing.getIngredient().getId() == ingredient.getId() );
    }

    /**
     * Adds an ingredient to the list
     *
     * @param ingredientDto
     *            The ingredient to add
     */
    public void addIngredient ( final RecipeIngredientDto ingredientDto ) {
        this.ingredients.add( ingredientDto );
    }
}
