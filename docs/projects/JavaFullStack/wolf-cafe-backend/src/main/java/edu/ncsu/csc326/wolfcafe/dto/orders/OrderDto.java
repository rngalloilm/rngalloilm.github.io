package edu.ncsu.csc326.wolfcafe.dto.orders;

import java.util.ArrayList;
import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Information to login a user.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
	/**
     * The unique identifier for the item.
     */
    private Long               id;
    /**
     * The ID of the user who placed the order. A value of {@code null}
     * indicates the order was placed anonymously.
     */
    private Long               userId;                          // null ==
    // anonymous
    /**
     * The current status of the order (e.g., "Pending", "Completed", "Ready for
     * Pickup").
     */
    private String             status;
    /**
     * The location where the order was placed or is being fulfilled.
     */
    private LocationDto        location;

    /**
     * A list of items included in the order.
     */
    private List<OrderItemDto> orderedItems = new ArrayList<>();
    /** 
     * The tip rate that will be applied to the order 
     */
    private double             tipRate;
    private String             email;
}
