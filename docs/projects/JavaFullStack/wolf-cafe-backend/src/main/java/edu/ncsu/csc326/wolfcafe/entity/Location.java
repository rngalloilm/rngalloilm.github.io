package edu.ncsu.csc326.wolfcafe.entity;

import java.time.LocalTime;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents an item for sale in the WolfCafe.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table ( name = "locations" )
public class Location {
    /**
     * The unique identifier for the location.
     */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long      id;
    /**
     * The name of the location.
     */
    @Column ( nullable = false, unique = true )
    private String    name;
    /**
     * /* The physical address of the location.
     */
    @Column ( nullable = false, unique = true )
    private String    address;

    /**
     * The tax rate applied to sales at the location.
     */
    @Column ( nullable = false )
    private double    taxRate;
    /**
     * The menu associated with this location.
     */

    @OneToOne ( cascade = CascadeType.ALL, optional = false )
    @JoinColumn ( name = "menu_id", nullable = false ) // Keep as non-nullable
    private Menu      menu;

    /**
     * The inventory associated with this location.
     */
    @OneToOne ( cascade = CascadeType.PERSIST, optional = false )
    @JoinColumn ( name = "inventory__id", nullable = false ) // Keep as
                                                             // non-nullable
    private Inventory inventory;

    /**
     * The time at which the location's day ends (used for business logic like
     * end-of-day processing).
     */
    @Column ( name = "end_of_day_time", nullable = false )
    private LocalTime endOfDayTime;

    /**
     * Sets the menu for the location and updates the reverse relationship.
     *
     * @param menu
     *            the menu to associate with this location
     */
    public void setMenu ( final Menu menu ) {
        this.menu = menu;
        if ( menu != null ) {
            menu.setLocation( this ); // Only set reverse relationship if menu
                                      // is not null
        }
    }
}
