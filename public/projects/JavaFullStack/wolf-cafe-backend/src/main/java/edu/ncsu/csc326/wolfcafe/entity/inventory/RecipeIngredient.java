package edu.ncsu.csc326.wolfcafe.entity.inventory;

import java.io.Serializable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
 * Represents the association between a Recipe and an Ingredient, including the
 * amount of the ingredient required in the recipe. This entity is used in a
 * many-to-one relationship between Recipe and Ingredient.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeIngredient implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    /** Unique identifier for each RecipeIngredient entry */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long              id;

    /** The recipe to which this ingredient belongs */
    @ManyToOne
    @JoinColumn ( nullable = false )
    private Recipe            recipe;

    /** The ingredient in the recipe */
    @ManyToOne ( cascade = CascadeType.MERGE )
    @JoinColumn ( name = "ingredient_id", nullable = false )
    private Ingredient        ingredient;

    /** The amount of the ingredient required in the recipe */
    @Column ( nullable = false )
    private Integer           amount;

}
