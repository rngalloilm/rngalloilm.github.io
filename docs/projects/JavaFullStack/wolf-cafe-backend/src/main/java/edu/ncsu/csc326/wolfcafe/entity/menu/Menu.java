package edu.ncsu.csc326.wolfcafe.entity.menu;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import edu.ncsu.csc326.wolfcafe.entity.Location;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents the menu for a specific {@link Location}. The menu contains a list
 * of recipes and items available for customers at that location.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table ( name = "menus" )
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;
    /** Unique identifier for the menu. */
    @GeneratedValue ( strategy = GenerationType.IDENTITY ) // Automatically
    // generate ID
    @Id
    private Long              id;
    /** the menu will directly be linked to a location */
    @OneToOne ( mappedBy = "menu", optional = false )
    private Location          location;
    /** The list of recipes included in the menu. */
    @ManyToMany ( cascade = { CascadeType.MERGE, CascadeType.REMOVE, CascadeType.REFRESH, CascadeType.DETACH },
            fetch = FetchType.EAGER )
    @JoinTable ( name = "menus_recipe_list", joinColumns = @JoinColumn ( name = "menu_id" ),
            inverseJoinColumns = @JoinColumn ( name = "recipe_id" ) )
    private List<MenuRecipe>  recipeList       = new ArrayList<>();
    /** The list of items included in the menu. */
    @ManyToMany ( cascade = { CascadeType.MERGE, CascadeType.REMOVE, CascadeType.REFRESH, CascadeType.DETACH },
            fetch = FetchType.EAGER )
    @JoinTable ( name = "menus_item_list", joinColumns = @JoinColumn ( name = "menu_id" ),
            inverseJoinColumns = @JoinColumn ( name = "item_id" ) )
    private List<MenuItem>    itemList         = new ArrayList<>();

}
