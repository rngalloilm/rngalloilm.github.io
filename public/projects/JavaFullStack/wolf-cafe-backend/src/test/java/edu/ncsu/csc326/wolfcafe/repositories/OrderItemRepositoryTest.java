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
import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import edu.ncsu.csc326.wolfcafe.entity.orders.OrderItem;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.ItemRepository;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderItemRepository;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderRepository;
import edu.ncsu.csc326.wolfcafe.service.AuthService;
// Test class for the OrderItemRepository 
@SpringBootTest
@Transactional
class OrderItemRepositoryTest {

    @Autowired
    private OrderItemRepository orderItemRepository; // Inject the OrderItem repository 

    @Autowired
    private OrderRepository     orderRepository; // Inject the Order repository

    @Autowired
    private UserRepository      userRepository; // Inject the User repository

    @Autowired
    private LocationRepository  locationRepository;  // Inject the Location repository

    @Autowired
    private ItemRepository      itemRepository; // Inject the Item repository

    @Autowired
    private AuthService         authService;  // Inject the AuthService for user registration

    private User                user; //user entity for testing 
    private Item                item; //item entity for testing 
    private Order               order; //order entity for testing 

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil; // Utility for cleaning up the database 
    /**
     * Set up the test environment before each test case.
     */
    @Transactional
    @BeforeEach
    void setUp () {
        MockitoAnnotations.openMocks( this );

        databaseCleanupUtil.truncateAllTables();

        // Register a user
        final RegisterDto registerDto = new RegisterDto( "Test User", "testusername", "testemail@gmail.com", "password",
                null );
        authService.register( registerDto );

        // Retrieve the registered user
        user = userRepository.findByUsername( "testusername" )
                .orElseThrow( () -> new RuntimeException( "User should be created by AuthService!" ) );

        // Create Location and Menu with a bidirectional relationship
        final Location location = new Location( null, "Downtown Cafe", "123 Main St", 7.5, null, new Inventory(),
                LocalTime.of( 18, 0 ) );
        final Menu menu = new Menu();
        location.setMenu( menu );
        menu.setLocation( location );

        // Save only the location (cascading will save the menu as well)
        locationRepository.save( location );

        // Set up and save item
        item = new Item( null, "Latte", "Delicious coffee beverage", 4.5 );
        item = itemRepository.save( item );

        // Set up and save order
        order = new Order();
        order.setUser( user );
        order.setOrderedItems( null );
        order.setLocation( location );
        order.setStatus( "PENDING" );
        order = orderRepository.save( order );
    }
    /**
     * Test case to create and get an OrderItem entity.
     */
    @Test
    void testCreateAndRetrieveOrderItem () {
        // Arrange: Create and save OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder( order );
        orderItem.setItem( item );
        orderItem.setQuantity( 2 );
        orderItem = orderItemRepository.save( orderItem );

        // Act: Retrieve saved OrderItem by ID
        final Optional<OrderItem> retrievedOrderItem = orderItemRepository.findById( orderItem.getId() );

        // Assert: Verify saved OrderItem details
        assertTrue( retrievedOrderItem.isPresent() );
        assertAll( "OrderItem details",
                () -> assertEquals( order.getId(), retrievedOrderItem.get().getOrder().getId() ),
                () -> assertEquals( item.getId(), retrievedOrderItem.get().getItem().getId() ),
                () -> assertEquals( 2, retrievedOrderItem.get().getQuantity() ) );
    }
    /**
     * Test case to update an existing OrderItem.
     */
    @Test
    void testUpdateOrderItem () {
        // Arrange: Create and save OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder( order );
        orderItem.setItem( item );
        orderItem.setQuantity( 2 );
        orderItem = orderItemRepository.save( orderItem );

        // Act: Update and save OrderItem
        orderItem.setQuantity( 3 );
        orderItemRepository.save( orderItem );

        // Assert: Retrieve and verify updated OrderItem
        final Optional<OrderItem> updatedOrderItem = orderItemRepository.findById( orderItem.getId() );
        assertTrue( updatedOrderItem.isPresent() );
        assertEquals( 3, updatedOrderItem.get().getQuantity() );
    }
    /**
     * Test case to delete an OrderItem.
     */
    @Test
    void testDeleteOrderItem () {
        // Arrange: Create and save OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder( order );
        orderItem.setItem( item );
        orderItem.setQuantity( 1 );
        orderItem = orderItemRepository.save( orderItem );

        // Act: Delete the OrderItem
        orderItemRepository.deleteById( orderItem.getId() );

        // Assert: Verify deletion
        final Optional<OrderItem> deletedOrderItem = orderItemRepository.findById( orderItem.getId() );
        assertFalse( deletedOrderItem.isPresent() );
    }
}
