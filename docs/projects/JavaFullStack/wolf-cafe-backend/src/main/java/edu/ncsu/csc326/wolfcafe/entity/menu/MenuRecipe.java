package edu.ncsu.csc326.wolfcafe.entity.menu;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Recipe;
import jakarta.persistence.Column;
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

/** the recipes on the menu */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MenuRecipe {
    @GeneratedValue ( strategy = GenerationType.IDENTITY ) // Automatically
    // generate ID
    /** Unique identifier for the MenuRecipe association. */
    @Id
    private Long    id;
    /** a recipe object on the menu */
    @ManyToOne ( fetch = FetchType.LAZY )
    // @MapsId
    @JoinColumn ( name = "recipe_id" )
    private Recipe  recipe;
    /** the id of the menu */
    @ManyToOne
    @JoinColumn ( name = "menu_id", nullable = false )
    private Menu    menu;
    /** Indicates whether the recipe is included in the menu. */
    @Column ( nullable = false )
    private boolean included;
}
