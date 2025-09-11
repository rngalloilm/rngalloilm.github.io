package edu.ncsu.csc326.wolfcafe.service;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.orders.OrderDto;

/**
 * Interface defining the order behaviors.
 */
public interface OrderService {

    /**
     * Creates a new order.
     *
     * @param dto
     *            the data transfer object containing the details of the new
     *            order.
     * @return the created order as an {@link OrderDto}.
     */
    OrderDto createOrder ( OrderDto dto );
    /**
     * Deletes an existing order by its ID.
     *
     * @param orderId
     *            the ID of the order to be deleted.
     */
    void deleteOrder ( long orderId );
    /**
     * Retrieves an order by its ID.
     *
     * @param orderId
     *            the ID of the order to retrieve.
     * @return the order details as an {@link OrderDto}.
     */
    OrderDto getOrder ( long orderId );
    /**
     * Retrieves all orders in the system.
     *
     * @return a list of all orders as {@link OrderDto}.
     */
    List<OrderDto> getAllOrders ();
    /**
     * Updates the status of an existing order.
     *
     * @param id
     *            the ID of the order to update.
     * @param status
     *            the new status for the order.
     * @return the updated order as an {@link OrderDto}.
     */
    OrderDto updateOrderStatus ( Long id, String status );
}
