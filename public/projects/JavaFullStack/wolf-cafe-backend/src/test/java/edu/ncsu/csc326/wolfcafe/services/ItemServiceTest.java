package edu.ncsu.csc326.wolfcafe.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import edu.ncsu.csc326.wolfcafe.entity.orders.OrderItem;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.ItemRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRepository;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderRepository;
import edu.ncsu.csc326.wolfcafe.service.impl.ItemServiceImpl;
//test class for itemService 
@SpringBootTest
public class ItemServiceTest {

    @Autowired
    private ItemServiceImpl     itemService; // Inject the service being tested 

    @MockBean
    private ItemRepository      itemRepository; // Mock the ItemRepository 

    @MockBean
    private OrderRepository     orderRepository; //mock the order repository

    @MockBean
    private MenuRepository      menuRepository; // mock the menu repository

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil; // Utility to clean the database 

    private ItemDto             initialItemDto; //Dto of item used for testing 
    private Item                initialItem; // item entity
    private Menu                menu; // menu entity
    /**
     * sets up environment for test, sets up data and mock repositories
     * 
     */
    @BeforeEach
    public void setUp () {
        databaseCleanupUtil.truncateAllTables();

        initialItemDto = new ItemDto();
        initialItemDto.setName( "Coffee" );
        initialItemDto.setDescription( "Fresh coffee" );
        initialItemDto.setPrice( 2.5 );

        initialItem = new Item();
        initialItem.setId( 1L );
        initialItem.setName( "Coffee" );
        initialItem.setDescription( "Fresh coffee" );
        initialItem.setPrice( 2.5 );

        menu = new Menu();
    }
    /**
     * Test case for adding an item to the inventory.
     */
    @Test
    @Transactional
    public void testAddItem () {
        when( itemRepository.save( any( Item.class ) ) ).thenReturn( initialItem );
        when( menuRepository.findAll() ).thenReturn( List.of( menu ) );
        when( menuRepository.save( any( Menu.class ) ) ).thenReturn( menu );

        final ItemDto savedItemDto = itemService.addItemZeroQuantity( initialItemDto );

        assertNotNull( savedItemDto );
        assertEquals( "Coffee", savedItemDto.getName() );
        assertEquals( "Fresh coffee", savedItemDto.getDescription() );
        verify( itemRepository, times( 1 ) ).save( any( Item.class ) );
    }
    /**
     * Test case for retrieving an item by its ID.
     */
    @Test
    @Transactional
    public void testGetItem () {
        when( itemRepository.findById( 1L ) ).thenReturn( Optional.of( initialItem ) );

        final ItemDto foundItemDto = itemService.getItem( 1L );

        assertNotNull( foundItemDto );
        assertEquals( "Coffee", foundItemDto.getName() );
        assertEquals( "Fresh coffee", foundItemDto.getDescription() );
        verify( itemRepository, times( 1 ) ).findById( 1L );
    }
    /**
     * Test case for attempting to retrieve an item that doesn't exist.
     */
    @Test
    @Transactional
    public void testGetItem_NotFound () {
        when( itemRepository.findById( 1L ) ).thenReturn( Optional.empty() );

        assertThrows( ResourceNotFoundException.class, () -> {
            itemService.getItem( 1L );
        } );
    }
    /**
     * Test case for retrieving all items from the inventory.
     */
    @Test
    @Transactional
    public void testGetAllItems () {
        when( itemRepository.findAll() ).thenReturn( List.of( initialItem ) );

        final List<ItemDto> items = itemService.getAllItems();

        assertNotNull( items );
        assertEquals( 1, items.size() );
        verify( itemRepository, times( 1 ) ).findAll();
    }
    /**
     * Test case for updating an existing item.
     */
    @Test
    @Transactional
    public void testUpdateItem () {
        when( itemRepository.findById( 1L ) ).thenReturn( Optional.of( initialItem ) );
        when( itemRepository.save( any( Item.class ) ) ).thenReturn( initialItem );
        when( menuRepository.findAll() ).thenReturn( List.of( menu ) );
        when( menuRepository.save( any( Menu.class ) ) ).thenReturn( menu );

        final ItemDto updatedItemDto = itemService.updateItem( 1L, initialItemDto );

        assertNotNull( updatedItemDto );
        assertEquals( "Coffee", updatedItemDto.getName() );
        assertEquals( "Fresh coffee", updatedItemDto.getDescription() );
        verify( itemRepository, times( 1 ) ).save( any( Item.class ) );
    }
    /**
     * Test case for deleting an item from the inventory.
     */
    @Test
    @Transactional
    public void testDeleteItem () {
        when( itemRepository.findById( 1L ) ).thenReturn( Optional.of( initialItem ) );
        when( menuRepository.findAll() ).thenReturn( List.of( menu ) );

        itemService.deleteItem( 1L );

        verify( itemRepository, times( 1 ) ).deleteById( 1L );
    }
    /**
     * Test case for attempting to delete an item that doesn't exist.
     */
    @Test
    @Transactional
    public void testDeleteItem_NotFound () {
        when( itemRepository.findById( 1L ) ).thenReturn( Optional.empty() );

        assertThrows( ResourceNotFoundException.class, () -> {
            itemService.deleteItem( 1L );
        } );
    }

    @Test
    @Transactional
    public void testUpdateItemIllegal () {
        when( itemRepository.findById( 1L ) ).thenReturn( Optional.of( initialItem ) );

        // Mock order with associated item
        final OrderItem orderItem = new OrderItem();
        orderItem.setItem( initialItem );

        final Order order = new Order();
        order.setOrderedItems( List.of( orderItem ) );

        when( orderRepository.findAll() ).thenReturn( List.of( order ) );

        // Attempt to update the item
        assertThrows( IllegalAccessError.class, () -> {
            itemService.updateItem( 1L, initialItemDto );
        } );

        verify( itemRepository, times( 0 ) ).save( any( Item.class ) );
    }

    @Test
    @Transactional
    public void testDeleteItemIllegal () {
        // Mock existing item
        when( itemRepository.findById( 1L ) ).thenReturn( Optional.of( initialItem ) );

        final OrderItem orderItem = new OrderItem();
        orderItem.setItem( initialItem );

        final Order order = new Order();
        order.setOrderedItems( List.of( orderItem ) );

        when( orderRepository.findAll() ).thenReturn( List.of( order ) );

        // Attempt to delete the item
        assertThrows( IllegalAccessError.class, () -> {
            itemService.deleteItem( 1L );
        } );

        verify( itemRepository, times( 0 ) ).deleteById( 1L );
    }
}
