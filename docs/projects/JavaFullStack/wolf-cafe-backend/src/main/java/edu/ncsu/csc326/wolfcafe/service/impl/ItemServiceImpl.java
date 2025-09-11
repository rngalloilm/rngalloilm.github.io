package edu.ncsu.csc326.wolfcafe.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryItemDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateItemRequest;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import edu.ncsu.csc326.wolfcafe.entity.menu.MenuItem;
import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import edu.ncsu.csc326.wolfcafe.entity.orders.OrderItem;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.ItemRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuItemRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRepository;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderRepository;
import edu.ncsu.csc326.wolfcafe.service.InventoryService;
import edu.ncsu.csc326.wolfcafe.service.ItemService;
import lombok.AllArgsConstructor;

/**
 * Implemented item service
 */
@Service
@AllArgsConstructor
public class ItemServiceImpl implements ItemService {

    @Autowired
    private final ItemRepository     itemRepository;

    @Autowired
    private final InventoryService   inventoryService;

    @Autowired
    private final MenuRepository     menuRepository;

    @Autowired
    private final MenuItemRepository menuItemRepository;

    @Autowired
    private final OrderRepository    orderRepository;

    private final ModelMapper        modelMapper = new ModelMapper();

    // javadoc defined in interface
    @Override
    public ItemDto addItem ( final CreateItemRequest itemRequest ) {
        final ItemDto itemDto = itemRequest.getItemDto();

        final Item item = modelMapper.map( itemDto, Item.class );
        if ( item.getName().trim().isEmpty() || item.getDescription().trim().isEmpty() || item.getPrice() < 0 ) {
            throw new IllegalArgumentException( "Invalid item." );
        }
        final Item savedItem = itemRepository.save( item );

        if ( itemRequest.getLocationId() != -1 ) {
            final InventoryDto inventoryDto = inventoryService.getInventory( itemRequest.getLocationId() );
            inventoryService.saveInventoryItem( inventoryDto, new InventoryItemDto( null, null,
                    modelMapper.map( savedItem, ItemDto.class ), itemRequest.getInitialAmount() ) );
        }

        final List<InventoryDto> listOfInventories = inventoryService.getAllInventories();
        for ( final InventoryDto otherInventory : listOfInventories ) {
            if ( otherInventory.getId() != itemRequest.getLocationId() ) {
                inventoryService.saveInventoryItem( otherInventory,
                        new InventoryItemDto( null, null, modelMapper.map( savedItem, ItemDto.class ), 0 ) );
            }
        }

        return modelMapper.map( savedItem, ItemDto.class );
    }

    // javadoc defined in interface
    @Override
    public ItemDto addItemZeroQuantity ( final ItemDto itemDto ) {
        return addItem( new CreateItemRequest( itemDto, 0, -1 ) );
    }

    /**
     * Gets item by id
     *
     * @param id
     *            id of item to get
     * @return returned item
     */
    @Override
    public ItemDto getItem ( final Long id ) {
        final Item item = itemRepository.findById( id )
                .orElseThrow( () -> new ResourceNotFoundException( "Item not found with id " + id ) );
        return modelMapper.map( item, ItemDto.class );
    }

    /**
     * Returns all items
     *
     * @return all items
     */
    @Override
    public List<ItemDto> getAllItems () {
        final List<Item> items = itemRepository.findAll();
        return items.stream().map( ( item ) -> modelMapper.map( item, ItemDto.class ) ).collect( Collectors.toList() );
    }

    /**
     * Updates the item with the given id
     *
     * @param id
     *            id of item to update
     * @param itemDto
     *            information of item to update
     * @return updated item
     */
    @Override
    public ItemDto updateItem ( final Long id, final ItemDto itemDto ) {
        final Item item = itemRepository.findById( id )
                .orElseThrow( () -> new ResourceNotFoundException( "Item not found with id " + id ) );
        for ( final Order order : orderRepository.findAll() ) {
            for ( final OrderItem oi : order.getOrderedItems() ) {
                if ( oi.getItem() != null && oi.getItem().getName().equals( item.getName() ) ) {
                    throw new IllegalAccessError();
                }
            }
        }
        if ( itemDto.getName().trim().isEmpty() || itemDto.getDescription().trim().isEmpty()
                || itemDto.getPrice() < 0 ) {
            throw new IllegalArgumentException( "Invalid item." );
        }
        item.setName( itemDto.getName() );
        item.setDescription( itemDto.getDescription() );
        item.setPrice( itemDto.getPrice() );
        final Item updatedItem = itemRepository.save( ( item ) );
        return modelMapper.map( updatedItem, ItemDto.class );
    }

    /**
     * Deletes the item with the given id
     *
     * @param id
     *            id of item to delete
     */
    @Override
    public void deleteItem ( final Long id ) {
        final Item item = itemRepository.findById( id )
                .orElseThrow( () -> new ResourceNotFoundException( "Item not found with id " + id ) );
        for ( final Order order : orderRepository.findAll() ) {
            for ( final OrderItem oi : order.getOrderedItems() ) {
                if ( oi.getItem() != null && oi.getItem().getName().equals( item.getName() ) ) {
                    throw new IllegalAccessError();
                }
            }
        }

        for ( final InventoryDto inventory : inventoryService.getAllInventories() ) {
            final List<InventoryItemDto> iis = inventory.getItems();
            for ( int i = 0; i < iis.size(); i++ ) {
                final InventoryItemDto ii = iis.get( i );
                if ( ii.getItem() != null && ii.getItem().getName().equals( item.getName() ) ) {
                    iis.remove( i );
                    i--;
                }
            }
            inventoryService.updateInventory( inventory );
        }
        for ( final Menu menu : menuRepository.findAll() ) {
            final List<MenuItem> mis = menu.getItemList();
            for ( int i = 0; i < mis.size(); i++ ) {
                final MenuItem mi = mis.get( i );
                if ( mi.getItem() != null && mi.getItem().getName().equals( item.getName() ) ) {
                    mis.remove( i );
                    i--;
                    menuItemRepository.deleteById( mi.getId() );
                }
            }
            menu.setItemList( mis );
            menuRepository.save( menu );

        }

        itemRepository.deleteById( id );

    }
}
