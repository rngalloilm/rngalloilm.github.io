package edu.ncsu.csc326.wolfcafe.entity.inventory;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Recipe for the coffee maker. Recipe is a Data Access Object (DAO) is tied to
 * the database using Hibernate libraries. RecipeRepository provides the methods
 * for database CRUD operations.
 */
@Entity
@Table ( name = "recipes" )
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recipe implements Serializable {

    /** Serialization version UID for ensuring compatibility. */
    private static final long      serialVersionUID = 1L;

    /** Recipe id */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long                   id;

    /** Recipe name */
    private String                 name;

    /** Recipe price */
    private Integer                price;

    /** List of Ingredients **/

    @OneToMany ( mappedBy = "recipe", cascade = { CascadeType.MERGE, CascadeType.PERSIST }, fetch = FetchType.EAGER,
            orphanRemoval = true )
    private List<RecipeIngredient> ingredients      = new ArrayList<>();

    /**
     * Adds an ingredient to the list
     *
     * @param ingredient
     *            The ingredient to add
     */
    public void addIngredient ( final Ingredient ingredient, final Integer amount ) {
        for ( final RecipeIngredient recipeIngredient : this.ingredients ) {
            if ( recipeIngredient.getIngredient().equals( ingredient ) ) {
                recipeIngredient.setAmount( recipeIngredient.getAmount() + amount );
                return;
            }
        }
        this.ingredients.add( new RecipeIngredient( null, this, ingredient, amount ) ); // Add
        // ingredient
        // if
        // not
        // present
    }

    /**
     * Removes an ingredient from the recipe.
     *
     * @param ingredient
     *            The ingredient to remove.
     */
    public void removeIngredient ( final Ingredient ingredient ) {
        this.ingredients.removeIf( recipeIngredient -> recipeIngredient.getIngredient().equals( ingredient ) );
    }

    /**
     * Sets the amount of an ingredient in the recipe. If the ingredient is not
     * already present, it is added to the recipe.
     *
     * @param ingredient
     *            The ingredient for which the amount should be set.
     * @param amount
     *            The amount to set for the ingredient.
     */
    public void setIngredientAmount ( final Ingredient ingredient, final Integer amount ) {
        for ( final RecipeIngredient recipeIngredient : this.ingredients ) {
            if ( recipeIngredient.getIngredient().equals( ingredient ) ) {
                recipeIngredient.setAmount( amount );
                return;
            }
        }
        addIngredient( ingredient, amount ); // Add ingredient if not present
    }

    /**
     * Add an ingredient to the recipe.
     *
     * @param recipeIngredient
     *            the ingredient to add
     */
    public void addIngredient ( final RecipeIngredient recipeIngredient ) {
        this.ingredients.add( recipeIngredient );
    }
}
