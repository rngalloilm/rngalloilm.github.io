package edu.ncsu.csc326.wolfcafe.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import edu.ncsu.csc326.wolfcafe.repositories.LocationRepository;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderRepository;
/**
 * units test for the SetupDataLoader class
 */
class SetupDataLoaderTest {
	// Mock dependencies
    @Mock
    private LocationRepository  locationRepository;

    @Mock
    private OrderRepository     orderRepository;
    //// Inject mocks dependencies
    @InjectMocks
    private SetupDataLoader     setupDataLoader;

    //Test objects 
    private Location            location;
    private List<Order>         orders;
    
    // Fixed ZoneId for testing purposes
    private static final ZoneId TEST_ZONE_ID = ZoneId.of( "America/New_York" );

    /**
     * Sets up test data and mock behavior for the test cases
     */
    @BeforeEach
    public void setUp () {
        MockitoAnnotations.openMocks( this );

        // Create a mock location
        location = new Location();
        location.setId( 1L );
        location.setName( "Test Cafe" );
        location.setAddress( "123 Test St" );
        location.setTaxRate( 0.07 );
        location.setEndOfDayTime( LocalTime.of( 18, 0 ) ); // 6:00 PM

        // Create mock orders
        final Order pendingOrder = new Order();
        pendingOrder.setId( 1L );
        pendingOrder.setStatus( "Pending" );
        pendingOrder.setLocation( location );

        final Order completedOrder = new Order();
        completedOrder.setId( 2L );
        completedOrder.setStatus( "COMPLETED" );
        completedOrder.setLocation( location );

        orders = new ArrayList<>();
        orders.add( pendingOrder );
        orders.add( completedOrder );

        // Mock repository behavior
        when( locationRepository.findAll() ).thenReturn( Collections.singletonList( location ) );
        when( orderRepository.findAll() ).thenReturn( orders );

        // Simulate deletion behavior for the repository
        doAnswer( invocation -> {
            final Order orderToDelete = invocation.getArgument( 0 );
            orders.remove( orderToDelete );
            return null;
        } ).when( orderRepository ).delete( org.mockito.Mockito.any( Order.class ) );

        // Set up a fixed clock time
        final LocalDateTime fixedDateTime = LocalDateTime.of( 2024, 11, 23, 19, 0 );
        final Clock fixedClock = Clock.fixed( fixedDateTime.atZone( TEST_ZONE_ID ).toInstant(), TEST_ZONE_ID );
        setupDataLoader.setClock( fixedClock );
    }
    /**
     * Test the orders with "Pending status that are deleted at the end of the day
     */
    @Test
    void testCheckEndOfDayDeletesPendingOrders () {
        // Call the method to test
        setupDataLoader.checkEndOfDay();

        // Verify that pending order was deleted, and completed order was not
        assertThat( orders ).hasSize( 1 ); // Only one order should remain
        assertThat( orders ).anyMatch( order -> "COMPLETED".equalsIgnoreCase( order.getStatus() ) );
    }
    /**
     * Test that no orders are deleted when the current time is before the end-of-day time.
     */
    @Test
    void testCheckEndOfDayNoDeletionBeforeEndTime () {
        // Adjust location end time to ensure current time is before it
        location.setEndOfDayTime( LocalTime.of( 20, 0 ) );

        // Set up a fixed clock time before 8 PM (e.g., 7 PM)
        final LocalDateTime fixedDateTime = LocalDateTime.of( 2024, 11, 1, 19, 0 );
        final Clock fixedClock = Clock.fixed( fixedDateTime.atZone( TEST_ZONE_ID ).toInstant(), TEST_ZONE_ID );
        setupDataLoader.setClock( fixedClock );

        // Call the method to test
        setupDataLoader.checkEndOfDay();

        // Verify no orders were deleted
        assertThat( orders ).hasSize( 2 ); // Both orders should remain
    }
}
