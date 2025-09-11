package edu.ncsu.csc326.wolfcafe.services;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.RegisterDto;
import edu.ncsu.csc326.wolfcafe.dto.UserDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.dto.orders.OrderDto;
import edu.ncsu.csc326.wolfcafe.dto.orders.OrderItemDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateItemRequest;
import edu.ncsu.csc326.wolfcafe.entity.Role;
import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.RoleRepository;
import edu.ncsu.csc326.wolfcafe.repositories.UserRepository;
import edu.ncsu.csc326.wolfcafe.service.AuthService;
import edu.ncsu.csc326.wolfcafe.service.ItemService;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
import edu.ncsu.csc326.wolfcafe.service.OrderService;
import edu.ncsu.csc326.wolfcafe.service.impl.OrderServiceImpl;
//unit test for the OrderService class 
@SpringBootTest
class OrderServiceTest {
	//inject dependencies 
    @Autowired
    private OrderService                orderService;

    @Autowired
    private UserRepository              userRepository;

    @Autowired
    private RoleRepository              roleRepository;

    @Autowired
    private AuthService                 authService;

    @Autowired
    private LocationService             locationService;

    @Autowired
    private ItemService                 itemService;

    @Autowired
    private DatabaseCleanupUtil         databaseCleanupUtil;

    private final ByteArrayOutputStream outContent  = new ByteArrayOutputStream();

    private final ModelMapper           modelMapper = new ModelMapper();

    // @Mock
    // private SendGrid sendGrid;
    private User                        user; //user entity for testing
    private OrderDto                    orderDto; //order Dto object for testing
    private Role                        customerRole; //customer role for testing

      /**
     * sets up the environment for test
     */
    @BeforeEach
    void setUp () {
        MockitoAnnotations.openMocks( this );
        databaseCleanupUtil.truncateAllTables();

        // Create the "ROLE_CUSTOMER" role if it doesn't exist
        customerRole = roleRepository.findByName( "ROLE_CUSTOMER" );
        if ( customerRole == null ) {
            customerRole = new Role();
            customerRole.setName( "ROLE_CUSTOMER" );
            roleRepository.save( customerRole );
        }

        // Set up and save location
        LocationDto location = new LocationDto();
        location.setName( "Downtown Cafe" );
        location.setAddress( "123 Main St" );
        location.setTaxRate( 7.5 );
        location.setEndOfDayTime( LocalTime.of( 18, 0 ) );
        location = locationService.createLocation( location );

        final RegisterDto registerDto = new RegisterDto( "Test User", "testusername", "testemail@gmail.com", "password",
                location.getId() );

        authService.registerStaff( registerDto );

        final RegisterDto registerDto2 = new RegisterDto( "Test User2", "customer", "testemail2@gmail.com", "password2",
                null );

        authService.register( registerDto2 );

        // Assign ROLE_CUSTOMER to all registered users
        final List<User> allUsers = userRepository.findAll();
        for ( final User user : allUsers ) {
            user.getRoles().add( customerRole );
            userRepository.save( user );
        }

        // Retrieve the registered user
        user = userRepository.findByUsername( "testusername" )
                .orElseThrow( () -> new RuntimeException( "User should be created by AuthService!" ) );

        final UserDto userDto = modelMapper.map( user, UserDto.class );

        // Set up and save item
        ItemDto item = new ItemDto();
        item.setName( "Latte" );
        item.setDescription( "Delicious coffee beverage" );
        item.setPrice( 4.5 );

        item = itemService.addItem( new CreateItemRequest( item, 5, location.getId() ) );

        final OrderItemDto orderItem = new OrderItemDto();
        orderItem.setItem( item );
        orderItem.setQuantity( 2 );

        orderDto = new OrderDto();
        orderDto.setId( 1L );
        orderDto.setUserId( userDto.getId() );
        orderDto.setStatus( "PENDING" );
        orderDto.setLocation( location );
        orderItem.setOrderId( orderDto );
        orderDto.setOrderedItems( List.of( orderItem ) );

        System.setOut( new PrintStream( outContent ) );
    }
    /**
     * Test the creation of an order
     */
    @Test
    @WithMockUser ( username = "testusername", roles = { "CUSTOMER" } )
    @Transactional
    void testCreateOrder () {
        final OrderDto createdOrder = orderService.createOrder( orderDto );

        assertAll( "Order creation", () -> assertNotNull( createdOrder.getId() ),
                () -> assertEquals( orderDto.getUserId(), createdOrder.getUserId() ),
                () -> assertEquals( "PENDING", createdOrder.getStatus() ),
                () -> assertEquals( orderDto.getLocation().getAddress(), createdOrder.getLocation().getAddress() ),
                () -> assertEquals( orderDto.getLocation().getName(), createdOrder.getLocation().getName() ),
                () -> assertEquals( orderDto.getLocation().getTaxRate(), createdOrder.getLocation().getTaxRate() ),
                () -> assertEquals( orderDto.getOrderedItems().size(), createdOrder.getOrderedItems().size() ),
                () -> assertEquals( orderDto.getOrderedItems().get( 0 ).getItem().getName(),
                        createdOrder.getOrderedItems().get( 0 ).getItem().getName() ),
                () -> assertEquals( orderDto.getOrderedItems().get( 0 ).getQuantity(),
                        createdOrder.getOrderedItems().get( 0 ).getQuantity() ) );

        final OrderDto retrievedOrder = orderService.getOrder( createdOrder.getId() );
        assertAll( "Order retrieval", () -> assertEquals( createdOrder.getId(), retrievedOrder.getId() ),
                () -> assertEquals( createdOrder.getUserId(), retrievedOrder.getUserId() ),
                () -> assertEquals( "PENDING", retrievedOrder.getStatus() ),
                () -> assertEquals( orderDto.getLocation().getName(), retrievedOrder.getLocation().getName() ),
                () -> assertEquals( orderDto.getOrderedItems().get( 0 ).getItem().getName(),
                        retrievedOrder.getOrderedItems().get( 0 ).getItem().getName() ),
                () -> assertEquals( 2, retrievedOrder.getOrderedItems().get( 0 ).getQuantity() ) );
    }
    /**
     * tests the delete order function for an existing order
     * @throws ResourceNotFoundException if the order with the given id does not exists
     */
    @Test
    @WithMockUser ( username = "testusername", roles = { "CUSTOMER" } )
    @Transactional
    void testDeleteOrder () {
        final OrderDto createdOrder = orderService.createOrder( orderDto );
        final long orderId = createdOrder.getId();

        // Delete the order
        orderService.deleteOrder( orderId );

        // Try to retrieve the deleted order
        try {
            orderService.getOrder( orderId );
        }
        catch ( final ResourceNotFoundException e ) {
            assertEquals( "Order does not exist with id " + orderId, e.getMessage() );
        }
    }
    /**
     * tests updating the order to the completed status 
     */
    @Test
    @WithMockUser ( username = "testusername", roles = { "STAFF", "ADMIN" } )
    @Transactional
    void testUpdateOrderStatus () {
        final OrderDto createdOrder = orderService.createOrder( orderDto );
        final long orderId = createdOrder.getId();

        // Update status to "COMPLETED"
        OrderDto updatedOrder = orderService.updateOrderStatus( orderId, "COMPLETED" );

        assertEquals( "COMPLETED", updatedOrder.getStatus() ); // still will be
                                                               // pending bc
                                                               // does
                                                               // not meet all
                                                               // the
                                                               // conditions

        // Update status to "COMPLETED"
        updatedOrder = orderService.updateOrderStatus( orderId, "READY_FOR_PICKUP" );

        assertEquals( "READY_FOR_PICKUP", updatedOrder.getStatus() ); // still
        // will be
        // pending bc does
        // not meet all the
        // conditions
    }
    /**
     * testing updating the order with an invalid status  
     * @throws GeneralErrorException the status an user is updating to is invalid 
     */
    @Test
    @WithMockUser ( username = "customer", roles = { "CUSTOMER" } )
    @Transactional
    void testUpdateOrderStatusInvalid () {
        final OrderDto createdOrder = orderService.createOrder( orderDto );
        final long orderId = createdOrder.getId();

        // Try updating to an invalid status
        try {
            orderService.updateOrderStatus( orderId, "INVALID_STATUS" );
        }
        catch ( final GeneralErrorException e ) {
            assertEquals( "Invalid status update.", e.getMessage() );
        }
    }
    /**
     * returns all the order in the system 
     */
    @Test
    @WithMockUser ( username = "customer", roles = { "CUSTOMER" } )
    @Transactional
    void testGetAllOrders () {
        // Create two orders
        orderService.createOrder( orderDto );

        final List<OrderDto> allOrders = orderService.getAllOrders();

        assertEquals( 1, allOrders.size() );

        // Initialize the service with the "DEFAULT_API_KEY"
        new OrderServiceImpl( "DEFAULT_API_KEY" );

        // Verify the warning message is printed
        assertTrue( outContent.toString().contains(
                "WARNING: API Key from SendGrid was not provided in applications.properties. Please define as sendgrid.api-key" ) );
    }

    @Test
    @WithMockUser ( username = "customer", roles = { "CUSTOMER" } )
    @Transactional
    void testCreateOrderEmailAlreadyRegistered () {
        final User existingUser = new User();
        existingUser.setId( 1L );
        existingUser.setUsername( "customer2" );
        existingUser.setEmail( "testemail4@gmail.com" );
        existingUser.setPassword( "password" );
        existingUser.setRoles( List.of( customerRole ) );
        existingUser.setOrders( new ArrayList<>() );

        userRepository.save( existingUser );

        orderDto.setUserId( null );
        orderDto.setEmail( existingUser.getEmail() );

        // Assert exception is thrown when creating order
        final GeneralErrorException exception = assertThrows( GeneralErrorException.class, () -> {
            orderService.createOrder( orderDto );
        } );

        assertEquals( "The provided email already belongs to a registered user. Please log in to place an order.",
                exception.getMessage() );
    }

    @Test
    @WithMockUser ( username = "customer", roles = { "CUSTOMER" } )
    @Transactional
    void testCreateOrderLocationNotProvided () {
        orderDto.setLocation( null );

        // Assert exception is thrown when creating order
        final GeneralErrorException exception = assertThrows( GeneralErrorException.class, () -> {
            orderService.createOrder( orderDto );
        } );

        assertEquals( "Location must be provided!", exception.getMessage() );
    }

    @Test
    @WithMockUser ( username = "customer", roles = { "CUSTOMER" } )
    @Transactional
    void testCreateOrderNegativeTipRate () {
        orderDto.setTipRate( -5.0 );

        // Assert exception is thrown when creating order
        final GeneralErrorException exception = assertThrows( GeneralErrorException.class, () -> {
            orderService.createOrder( orderDto );
        } );

        assertEquals( "Tip rate must be at least 0.", exception.getMessage() );
    }

}
