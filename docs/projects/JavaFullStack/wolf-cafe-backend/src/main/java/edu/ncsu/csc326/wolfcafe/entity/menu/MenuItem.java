package edu.ncsu.csc326.wolfcafe.entity.menu;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;
import jakarta.persistence.CascadeType;
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

/*
 * This entity determines whether a specific item is included in a menu for a
 * given location.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MenuItem {
    @GeneratedValue ( strategy = GenerationType.IDENTITY ) // Automatically
    // generate ID
    /** Unique identifier for the MenuItem association. */
    @Id
    private Long    id;
    /** *the id assoicated with an item */
    @ManyToOne ( fetch = FetchType.LAZY,
            cascade = { CascadeType.MERGE, CascadeType.REMOVE, CascadeType.REFRESH, CascadeType.DETACH } )
    // @MapsId
    @JoinColumn ( name = "item_id" )
    private Item    item;
    /** the menu object */
    @ManyToOne
    @JoinColumn ( name = "menu_id", nullable = false )
    private Menu    menu;
    /**
     * This boolean flag determines if the item is currently active and visible
     * in the menu for customers.
     */
    @Column ( nullable = false )
    private boolean included;
}
