package edu.ncsu.csc326.wolfcafe.entity.orders;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 *  Represents an order placed in the WolfCafe system.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table ( name = "orders" )
public class Order {
	/** 
	 * /** Unique identifier for the order. 
	 */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
	    private Long            id;
    /**
     * The current status of the order.
     * Examples: "Pending", "Completed", "Ready for Pickup"
     * 
     */
    @Column ( nullable = false, unique = false )
    private String          status;

    // null == anonymous order
    /**
     * the if of the customer placing the order 
     *  If null, the order was created anonymously.
     * 
     */
    @ManyToOne
    @JoinColumn ( name = "customer_id", nullable = true ) // Join column with
                                                          // User's ID
    private User            user;
    /**
     * the location of the order
     */
    @ManyToOne
    @JoinColumn ( name = "location_id", nullable = false )
    private Location        location;
    /**
     *  The list of items included in this order
     */
    @OneToMany ( mappedBy = "order", cascade = { CascadeType.ALL }, orphanRemoval = true, fetch = FetchType.EAGER )
    private List<OrderItem> orderedItems;
    /**
     * the tip the customer placing with the order
     */
    @Column ( nullable = false )
    private double          tipRate;

    @Column ( nullable = true )
    private String          email;

}
