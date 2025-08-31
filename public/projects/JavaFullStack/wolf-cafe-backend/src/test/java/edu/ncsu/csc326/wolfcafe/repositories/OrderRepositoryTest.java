package edu.ncsu.csc326.wolfcafe.repositories;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.RegisterDto;
import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderRepository;
import edu.ncsu.csc326.wolfcafe.service.AuthService;
//Test class for the OrderRepository
@SpringBootTest
@Transactional
class OrderRepositoryTest {

    @Autowired
    private OrderRepository     orderRepository; // Inject the Order repository for CRUD operations

    @Autowired
    private UserRepository      userRepository; // Inject the User repository

    @Autowired
    private LocationRepository  locationRepository; // Inject the Location repository

    @Autowired
    private AuthService         authService; // Inject the AuthService for user registration

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil; // Utility for cleaning up the database 

    private User                user; //user entity for testing 
    private Location            location; //location entity for testing
    /**
     * Set up the test environment before each test case.
     */
    @BeforeEach
    void setUp () {
        MockitoAnnotations.openMocks( this );

        databaseCleanupUtil.truncateAllTables();

        // Register user
        final RegisterDto registerDto = new RegisterDto( "Test User", "testusername", "testemail@gmail.com", "password",
                null );
        authService.register( registerDto );

        // Retrieve the registered user
        user = userRepository.findByUsername( "testusername" )
                .orElseThrow( () -> new RuntimeException( "User should be created by AuthService!" ) );

        // Set up and save location
        location = new Location( null, "Downtown Cafe", "123 Main St", 7.5, new Menu(), new Inventory(),
                LocalTime.of( 18, 0 ) );
        location = locationRepository.save( location );
    }
    /**
     * Test case to create and retrieve an Order entity.
     */
    @Test
    void testCreateAndRetrieveOrder () {
        // Arrange: Create and save Order
        Order order = new Order();
        order.setUser( user );
        order.setLocation( location );
        order.setStatus( "PENDING" );
        order = orderRepository.save( order );

        // Act: Retrieve saved Order by ID
        final Optional<Order> retrievedOrder = orderRepository.findById( order.getId() );

        // Assert: Verify saved Order details
        assertTrue( retrievedOrder.isPresent() );
        assertAll( "Order details", () -> assertEquals( user.getId(), retrievedOrder.get().getUser().getId() ),
                () -> assertEquals( location.getId(), retrievedOrder.get().getLocation().getId() ),
                () -> assertEquals( "PENDING", retrievedOrder.get().getStatus() ) );
    }
    /**
     * Test case to update an existing Order
     */
    @Test
    void testUpdateOrder () {
        // Arrange: Create and save Order
        Order order = new Order();
        order.setUser( user );
        order.setLocation( location );
        order.setStatus( "PENDING" );
        order = orderRepository.save( order );

        // Act: Update and save Order
        order.setStatus( "COMPLETED" );
        orderRepository.save( order );

        // Assert: Retrieve and verify updated Order
        final Optional<Order> updatedOrder = orderRepository.findById( order.getId() );
        assertTrue( updatedOrder.isPresent() );
        assertEquals( "COMPLETED", updatedOrder.get().getStatus() );
    }
    /**
     * Test case to delete an Order. 
     */
    @Test
    void testDeleteOrder () {
        // Arrange: Create and save Order
        Order order = new Order();
        order.setUser( user );
        order.setLocation( location );
        order.setStatus( "PENDING" );
        order = orderRepository.save( order );

        // Act: Delete the Order
        orderRepository.deleteById( order.getId() );

        // Assert: Verify deletion
        final Optional<Order> deletedOrder = orderRepository.findById( order.getId() );
        assertFalse( deletedOrder.isPresent() );
    }
}
