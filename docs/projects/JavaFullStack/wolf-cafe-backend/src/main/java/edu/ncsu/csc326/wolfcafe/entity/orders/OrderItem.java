package edu.ncsu.csc326.wolfcafe.entity.orders;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Recipe;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * Represents an individual item in an order.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table ( name = "order_items" )
public class OrderItem {

    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long   id;
	/** Unique identifier for the order item. */
    @ManyToOne
    @JoinColumn ( name = "order_id", nullable = false )
    private Order  order;

    /**
     * we use nullable twice to denote we can pick which one we want to use here
     *
     **/
    @ManyToOne
    @JoinColumn ( name = "recipe_id", nullable = true )
    private Recipe recipe;
    /**
     * the id of the item ordered
     */
    @ManyToOne
    @JoinColumn ( name = "item_id", nullable = true )
    private Item   item;

    private int    quantity;
}
