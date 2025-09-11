package edu.ncsu.csc326.wolfcafe.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.ncsu.csc326.wolfcafe.dto.orders.OrderDto;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.service.OrderService;

/**
 * Controller class for Orders.
 */
@CrossOrigin ( "*" )
@RestController
@RequestMapping ( "/api/orders" )
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * return the order object given the order id
     *
     * @param id
     *            the id number of order
     * @return ResponseEntity if the application was successfully able to get
     *         the order with the given id or if the order was not found
     */
    @GetMapping ( "/{id}" )
    public ResponseEntity<OrderDto> getOrder ( @PathVariable ( "id" ) final Long id,
            @RequestParam ( value = "email", required = false ) final String email ) {
        try {
            final OrderDto orderDto = orderService.getOrder( id );

            // If the order belongs to a registered user, don't require email
            if ( orderDto.getUserId() != null ) {
                return ResponseEntity.ok( orderDto );
            }

            // If the order is anonymous, validate the provided email
            if ( orderDto.getUserId() == null ) {
                if ( email == null || !email.equals( orderDto.getEmail() ) ) {
                    return ResponseEntity.status( HttpStatus.FORBIDDEN ).body( null );
                }
            }

            return ResponseEntity.ok( orderDto );
        }
        catch ( final ResourceNotFoundException e ) {
            return ResponseEntity.status( HttpStatus.NOT_FOUND ).body( null );
        }
        catch ( final Exception e ) {
            // Handle unexpected exceptions
            return ResponseEntity.status( HttpStatus.INTERNAL_SERVER_ERROR ).body( null );
        }
    }

    /**
     * returns all the pending order in the system
     *
     * @param locationId
     *            the location of the pending orders the staff wishes to see
     * @return ResponseEntity if the application was successfully able to get
     *         all the pending order in the given location
     */
    @PreAuthorize ( "hasAnyRole('STAFF')" )
    @GetMapping ( "/pending/{locationId}" )
    public ResponseEntity<List<OrderDto>> getPendingOrders ( @PathVariable ( "locationId" ) final Long locationId ) {
        // find orders that match that location and aren't completed yet
        final List<OrderDto> orders = orderService.getAllOrders().stream().filter(
                order -> ( order.getLocation().getId() == locationId ) && !order.getStatus().equals( "COMPLETED" ) )
                .collect( Collectors.toList() );
        return ResponseEntity.ok( orders );
    }

    /**
     * returns all the completed order in the system
     *
     * @param locationId
     *            the location of the completed orders the staff wishes to see
     * @return ResponseEntity if the application was successfully able to get
     *         all the pending order in the given location
     */
    @PreAuthorize ( "hasRole('STAFF')" )
    @GetMapping ( "/completed/{locationId}" )
    public ResponseEntity<List<OrderDto>> getAllOrders ( @PathVariable ( "locationId" ) final Long locationId ) {
        // find orders that match that location and ARE completed
        final List<OrderDto> orders = orderService.getAllOrders().stream().filter(
                order -> ( order.getLocation().getId() == locationId ) && order.getStatus().equals( "COMPLETED" ) )
                .collect( Collectors.toList() );
        return ResponseEntity.ok( orders );
    }

    /**
     * creates a new order
     *
     * @param orderDto
     *            the order information
     * @return ResponseEntity if the order was successfully received
     */
    @PostMapping
    public ResponseEntity< ? > createOrder ( @RequestBody final OrderDto orderDto ) {
        System.out.println( "Received order request" );

        if ( orderDto.getOrderedItems().isEmpty() ) {
            throw new GeneralErrorException( "Order must contain at least one item." );
        }

        /**
         * if ( orderDto.getCustomerId() == null ) { throw new
         * GeneralErrorException( "Customer ID is required for placing an
         * order." ); }
         */

        if ( orderDto.getUserId() == null && orderDto.getEmail() == null ) {
            throw new GeneralErrorException( "Email is required for anonymous orders." );
        }

        try {
            final OrderDto savedOrderDto = orderService.createOrder( orderDto );
            return ResponseEntity.ok( savedOrderDto );
        }
        catch ( final GeneralErrorException e ) {
            return ResponseEntity.status( HttpStatus.BAD_REQUEST ).body( e.getMessage() );
        }
    }

    /**
     * delete the order with the given id
     *
     * @param id
     *            the id of the order
     * @return ResponseEntity if the application was successfully able to be
     *         deleted
     */
    @PreAuthorize ( "hasAnyRole('STAFF')" )
    @DeleteMapping ( "{id}" )
    public ResponseEntity<Void> deleteOrder ( @PathVariable ( "id" ) final Long id ) {
        orderService.deleteOrder( id );
        return ResponseEntity.status( HttpStatus.NO_CONTENT ).build();
    }

    /**
     * update the status of the order to ready
     *
     * @param id
     *            the id of the order
     * @return ResponseEntity if the application was successfully able mark the
     *         given order as "ready for pickup"
     */
    @PreAuthorize ( "hasAnyRole('STAFF')" )
    @PutMapping ( "{id}/status/ready" )
    public ResponseEntity<OrderDto> markOrderReady ( @PathVariable ( "id" ) final Long id ) {
        final OrderDto updatedOrder = orderService.updateOrderStatus( id, "READY_FOR_PICKUP" );
        return ResponseEntity.ok( updatedOrder );
    }

    /**
     * the order with the given id with the updated status of "completed"
     *
     * @param id
     *            the id of the order
     * @return ResponseEntity if the application was successfully able to be
     *         marked completed
     */
    @PutMapping ( "{id}/status/completed" )
    public ResponseEntity<OrderDto> markOrderCompleted ( @PathVariable ( "id" ) final Long id ) {
        final OrderDto updatedOrder = orderService.updateOrderStatus( id, "COMPLETED" );
        return ResponseEntity.ok( updatedOrder );
    }
}
