package edu.ncsu.csc326.wolfcafe.dto.orders;

import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
	/**
     * The unique identifier for the order item.
     */
    private Long      id;
    /**
     * The associated order to which this item belongs.
     */
    private OrderDto  orderId;
    /**
    * The recipe included in the order, if applicable.
    */
    private RecipeDto recipe;
    /**
     * The individual item included in the order, if applicable.
     */
    private ItemDto   item;
    /**
     * The quantity of the recipe or item included in the order.
     */
    private int       quantity;
}
