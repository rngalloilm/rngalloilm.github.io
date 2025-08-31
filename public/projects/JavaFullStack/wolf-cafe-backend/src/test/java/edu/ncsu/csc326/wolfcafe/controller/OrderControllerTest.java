package edu.ncsu.csc326.wolfcafe.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import edu.ncsu.csc326.wolfcafe.TestUtils;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.UserDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.dto.orders.OrderDto;
import edu.ncsu.csc326.wolfcafe.dto.orders.OrderItemDto;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.service.OrderService;
//Tests for Order Controller 
@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerTest {

    @Autowired
    private MockMvc      mockMvc; // Simulates HTTP requests for the controller.

    @MockBean
    private OrderService orderService; // Mocked service layer for handling business logic.

    private OrderDto     orderDto; // Represents a test order DTO.
    /**
     * Setup method executed before each test. Initializes the mock dependencies 
     */
    @BeforeEach
    public void setUp () {
        MockitoAnnotations.openMocks( this );

        // Create a basic OrderDto
        orderDto = new OrderDto();
        orderDto.setId( 1L );
        orderDto.setUserId( null ); // Anonymous user
        orderDto.setStatus( "PENDING" );
        orderDto.setEmail( "mssuresh@ncsu.edu" );
        orderDto.setLocation( null ); // Assuming null for simplicity
        orderDto.setOrderedItems( new ArrayList<>() ); // Empty initially
    }
    /**
     * Tests the successful creation of an order.
     * @throw Exception if the order can not be created(Ex. bad format)
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testCreateOrderSuccessful () throws Exception {

        // Create UserDto representing the customer
        final UserDto userDto = new UserDto( 1L, "John Doe", "johndoe", "john.doe@example.com", "password", null, null,
                null );

        // Create ItemDto for the order
        final ItemDto itemDto = new ItemDto( 1L, "Coffee", "Delicious brewed coffee", 3.99 );

        // Create OrderItemDto for the order
        final OrderItemDto orderItemDto = new OrderItemDto( 2L, null, null, itemDto, 2 );

        // Create and configure OrderDto
        final OrderDto orderDto = new OrderDto();
        orderDto.setUserId( userDto.getId() );
        orderDto.setStatus( "PENDING" );
        orderDto.getOrderedItems().add( orderItemDto ); // Add the item to
                                                        // orderedItems list

        // Mock orderService to return the same OrderDto instance
        when( orderService.createOrder( any( OrderDto.class ) ) ).thenReturn( orderDto );

    }
    /**
     * Tests fetching all pending orders for a specific location.
     * @throws Exception if the location id is invalid or some other bad request 
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testGetPendingOrders () throws Exception {
        // Create a mock location and order list
        final LocationDto locationDto = new LocationDto();
        locationDto.setId( 1L );

        final OrderDto pendingOrder1 = new OrderDto();
        pendingOrder1.setId( 1L );
        pendingOrder1.setLocation( locationDto );
        pendingOrder1.setStatus( "PENDING" );

        final OrderDto pendingOrder2 = new OrderDto();
        pendingOrder2.setId( 2L );
        pendingOrder2.setLocation( locationDto );
        pendingOrder2.setStatus( "PENDING" );

        // Mock the OrderService to return a list of orders
        when( orderService.getAllOrders() ).thenReturn( List.of( pendingOrder1, pendingOrder2 ) );

        // Perform the request and verify the results
        mockMvc.perform( get( "/api/orders/pending/1" ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$", hasSize( 2 ) ) ).andExpect( jsonPath( "$[0].id", is( 1 ) ) )
                .andExpect( jsonPath( "$[0].status", is( "PENDING" ) ) ).andExpect( jsonPath( "$[1].id", is( 2 ) ) )
                .andExpect( jsonPath( "$[1].status", is( "PENDING" ) ) );
    }
    /**
     *  Tests creating an order with empty items, expecting a BadRequest response.
     * @throws Exception BafRequest response because the order has not items in it
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testCreateOrderFailure () throws Exception {

        // Create UserDto representing the customer
        final UserDto userDto = new UserDto( 1L, "John Doe", "johndoe", "john.doe@example.com", "password", null, null,
                null );

        // Create and configure OrderDto
        final OrderDto orderDto = new OrderDto();
        orderDto.setUserId( userDto.getId() );
        orderDto.setStatus( "PENDING" );

        // Mock orderService to return the same OrderDto instance
        when( orderService.createOrder( any( OrderDto.class ) ) ).thenReturn( orderDto );

    }
    /**
     * Tests successfully retrieving an order by its ID and email.
     * @throws Exception bad request response if the order cannot be created(Ex. bad format)
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testCreateOrder () throws Exception {
        final UserDto userDto = new UserDto( 1L, "John Doe", "johndoe", "john.doe@example.com", "password", null, null,
                null );
        final ItemDto itemDto = new ItemDto( 1L, "Coffee", "Delicious brewed coffee", 3.99 );
        final OrderItemDto orderItemDto = new OrderItemDto( 2L, null, null, itemDto, 2 );

        final OrderDto orderDto = new OrderDto();
        orderDto.setUserId( userDto.getId() );
        orderDto.setStatus( "PENDING" );
        orderDto.getOrderedItems().add( orderItemDto );

        when( orderService.createOrder( any( OrderDto.class ) ) ).thenReturn( orderDto );

        mockMvc.perform( post( "/api/orders" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( orderDto ) ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$.status", is( "PENDING" ) ) )
                .andExpect( jsonPath( "$.orderedItems", hasSize( 1 ) ) )
                .andExpect( jsonPath( "$.orderedItems[0].item.name", is( "Coffee" ) ) );
    }
    /**
     * Tests retrieving a non-existent order expecting a NotFound response.
     * @throws Exception a nonFound response since the order does not exist 
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testCreateOrderEmptyItems () throws Exception {
        // Set ordered items to empty
        orderDto.setOrderedItems( Collections.emptyList() );

        mockMvc.perform( post( "/api/orders" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( orderDto ) ) ).andExpect( status().isBadRequest() );
    }
    /**
     * Tests successfully retrieving an order by its ID and email.
     * @throws bad request or some other error if the email is invalid or some other error
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testGetOrderSuccessfulWithEmail () throws Exception {
        when( orderService.getOrder( 1L ) ).thenReturn( orderDto );

        mockMvc.perform( get( "/api/orders/1" ).param( "email", "mssuresh@ncsu.edu" ) ).andExpect( status().isOk() );
    }
    /**
     * tests retrieving a non-existent order, expecting a NotFound response.
     *
     * @throws Exception NotFound since the order does not exists
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testGetOrderNotFound () throws Exception {
        when( orderService.getOrder( 1L ) ).thenThrow( new ResourceNotFoundException( "Order not found" ) );

        mockMvc.perform( get( "/api/orders/1" ) ).andExpect( status().isNotFound() );
    }
    /**
     *  Tests successfully deleting an order.
     * @throws Exception if the order id is invalid or some other error
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testDeleteOrderSuccessful () throws Exception {
        mockMvc.perform( delete( "/api/orders/1" ) ).andExpect( status().isNoContent() );
    }
    /**
     * Tests updating an order's status to "Ready for Pickup".
     * @throws Exception if the order does not exist or some other error
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testMarkOrderReady () throws Exception {
        when( orderService.updateOrderStatus( 1L, "Ready for Pickup" ) ).thenReturn( orderDto );

        mockMvc.perform( put( "/api/orders/1/status/ready" ) ).andExpect( status().isOk() );
    } 
    /**
     * Tests updating an order's status to "Completed".
     * @throws Exception if the order does not exist or some other error
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testMarkOrderCompleted () throws Exception {
        when( orderService.updateOrderStatus( 1L, "Completed" ) ).thenReturn( orderDto );

        mockMvc.perform( put( "/api/orders/1/status/completed" ) ).andExpect( status().isOk() );
    }
    /**
     * Tests gets all completed orders for a specific location.
     * @throws Exception if the location does not exist or some other error 
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    public void testGetAllOrders () throws Exception {
        final LocationDto locationDto = new LocationDto();
        locationDto.setId( 1L );

        final OrderDto completedOrder1 = new OrderDto();
        completedOrder1.setId( 1L );
        completedOrder1.setLocation( locationDto );
        completedOrder1.setStatus( "COMPLETED" );

        final OrderDto completedOrder2 = new OrderDto();
        completedOrder2.setId( 2L );
        completedOrder2.setLocation( locationDto );
        completedOrder2.setStatus( "COMPLETED" );

        when( orderService.getAllOrders() ).thenReturn( List.of( completedOrder1, completedOrder2 ) );

        mockMvc.perform( get( "/api/orders/completed/1" ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$", hasSize( 2 ) ) ).andExpect( jsonPath( "$[0].id", is( 1 ) ) )
                .andExpect( jsonPath( "$[0].status", is( "COMPLETED" ) ) ).andExpect( jsonPath( "$[1].id", is( 2 ) ) )
                .andExpect( jsonPath( "$[1].status", is( "COMPLETED" ) ) );
    }
}
