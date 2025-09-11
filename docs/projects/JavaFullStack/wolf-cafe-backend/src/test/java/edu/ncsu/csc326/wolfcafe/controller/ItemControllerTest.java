package edu.ncsu.csc326.wolfcafe.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateItemRequest;
import edu.ncsu.csc326.wolfcafe.service.ItemService;
import edu.ncsu.csc326.wolfcafe.service.LocationService;

// test class for item controller
@SpringBootTest
@AutoConfigureMockMvc
public class ItemControllerTest {

    @Autowired
    private MockMvc                   mvc;

    @MockBean
    private ItemService               itemService;

    @MockBean
    private LocationService           locationService;

    private static final ObjectMapper mapper           = new ObjectMapper();
    private static final String       API_PATH         = "/api/items";
    private static final String       ENCODING         = "utf-8";
    private static final String       ITEM_NAME        = "Coffee";
    private static final String       ITEM_DESCRIPTION = "Coffee is life";
    private static final double       ITEM_PRICE       = 3.25;

    /**
     * Test case for creating an item as a staff user
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testCreateItem () throws Exception {
        final LocationDto locationDto = new LocationDto();
        locationDto.setAddress( "address" );
        locationDto.setId( 1L );

        final ItemDto itemDto = new ItemDto();
        itemDto.setId( 1L );
        itemDto.setName( ITEM_NAME );
        itemDto.setDescription( ITEM_DESCRIPTION );
        itemDto.setPrice( ITEM_PRICE );

        Mockito.when( itemService.addItem( ArgumentMatchers.any() ) ).thenReturn( itemDto );
        Mockito.when( locationService.getLocation( 1L ) ).thenReturn( locationDto );

        final CreateItemRequest request = new CreateItemRequest( itemDto, 1, 1 );

        final String json = mapper.writeValueAsString( request );

        mvc.perform( post( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isCreated() )
                .andExpect( jsonPath( "$.id", Matchers.equalTo( 1 ) ) )
                .andExpect( jsonPath( "$.name", Matchers.equalTo( ITEM_NAME ) ) )
                .andExpect( jsonPath( "$.description", Matchers.equalTo( ITEM_DESCRIPTION ) ) )
                .andExpect( jsonPath( "$.price", Matchers.equalTo( ITEM_PRICE ) ) );
    }

    /**
     * Test case for attempting to create an item without authorization.
     *
     * @throws Exception
     *             an unauthorized error message is thrown when attempting to
     *             create an item without staff authorization
     */
    @Test
    public void testCreateItemUnauthorized () throws Exception {
        final ItemDto itemDto = new ItemDto();
        itemDto.setName( ITEM_NAME );
        itemDto.setDescription( ITEM_DESCRIPTION );
        itemDto.setPrice( ITEM_PRICE );

        final String json = mapper.writeValueAsString( itemDto );

        mvc.perform( post( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isUnauthorized() );
    }

    /**
     * Test case for retrieving an item by its ID as a staff user
     */

    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testGetItemById () throws Exception {
        final ItemDto itemDto = new ItemDto( 27L, ITEM_NAME, ITEM_DESCRIPTION, ITEM_PRICE );
        Mockito.when( itemService.getItem( ArgumentMatchers.anyLong() ) ).thenReturn( itemDto );

        mvc.perform( get( API_PATH + "/27" ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.id", Matchers.equalTo( 27 ) ) )
                .andExpect( jsonPath( "$.name", Matchers.equalTo( ITEM_NAME ) ) )
                .andExpect( jsonPath( "$.description", Matchers.equalTo( ITEM_DESCRIPTION ) ) )
                .andExpect( jsonPath( "$.price", Matchers.equalTo( ITEM_PRICE ) ) );
    }

    /**
     * Test case for retrieving an item by its ID as a customer
     *
     * @throws Exception
     */
    @Test
    @WithMockUser ( username = "customer", roles = "CUSTOMER" )
    public void testGetItemByIdCustomerAccess () throws Exception {
        final ItemDto itemDto = new ItemDto( 27L, ITEM_NAME, ITEM_DESCRIPTION, ITEM_PRICE );
        Mockito.when( itemService.getItem( ArgumentMatchers.anyLong() ) ).thenReturn( itemDto );

        mvc.perform( get( API_PATH + "/27" ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.id", Matchers.equalTo( 27 ) ) )
                .andExpect( jsonPath( "$.name", Matchers.equalTo( ITEM_NAME ) ) )
                .andExpect( jsonPath( "$.description", Matchers.equalTo( ITEM_DESCRIPTION ) ) )
                .andExpect( jsonPath( "$.price", Matchers.equalTo( ITEM_PRICE ) ) );
    }

    /**
     * Test case for retrieving all items as a staff user
     *
     * @throws Exception
     *             if the items can not be retrieved
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testGetAllItems () throws Exception {
        final List<ItemDto> items = Arrays.asList( new ItemDto( 1L, "Coffee", "Fresh coffee", 3.0 ),
                new ItemDto( 2L, "Tea", "Green tea", 2.5 ) );

        Mockito.when( itemService.getAllItems() ).thenReturn( items );

        mvc.perform( get( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$", Matchers.hasSize( 2 ) ) )
                .andExpect( jsonPath( "$[0].name", Matchers.equalTo( "Coffee" ) ) )
                .andExpect( jsonPath( "$[1].name", Matchers.equalTo( "Tea" ) ) );
    }

    /**
     * Test case for updating an item as a staff user.
     *
     * @throws Exception
     *             if the request item is not in the system
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testUpdateItem () throws Exception {
        final ItemDto itemDto = new ItemDto( 27L, ITEM_NAME, ITEM_DESCRIPTION, ITEM_PRICE );
        Mockito.when( itemService.updateItem( ArgumentMatchers.anyLong(), ArgumentMatchers.any() ) )
                .thenReturn( itemDto );

        final String json = mapper.writeValueAsString( itemDto );

        mvc.perform( put( API_PATH + "/27" ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ) ).andExpect( status().isOk() ).andExpect( jsonPath( "$.id", Matchers.equalTo( 27 ) ) )
                .andExpect( jsonPath( "$.name", Matchers.equalTo( ITEM_NAME ) ) )
                .andExpect( jsonPath( "$.description", Matchers.equalTo( ITEM_DESCRIPTION ) ) )
                .andExpect( jsonPath( "$.price", Matchers.equalTo( ITEM_PRICE ) ) );
    }

    /**
     * Test case for deleting an item as a staff user.
     *
     * @throws Exception
     *             if the requested item does not exist
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testDeleteItem () throws Exception {
        Mockito.doNothing().when( itemService ).deleteItem( ArgumentMatchers.anyLong() );

        mvc.perform(
                delete( API_PATH + "/27" ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$" ).value( "Item deleted successfully" ) );
    }

    /**
     * Test case for attempting to delete an item as a customer
     *
     * @throws Exception
     *             an exception should be throw when a customer attempts to
     *             delete an authorized item
     */
    @Test
    @WithMockUser ( username = "customer", roles = "CUSTOMER" )
    public void testDeleteItemUnauthorized () throws Exception {
        mvc.perform(
                delete( API_PATH + "/27" ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING ) )
                .andExpect( status().isForbidden() );
    }

    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testCreateItemNullName () throws Exception {
        final CreateItemRequest request = new CreateItemRequest();
        request.setItemDto( new ItemDto( null, null, ITEM_DESCRIPTION, ITEM_PRICE ) );
        request.setInitialAmount( 1 );
        request.setLocationId( 1L );

        final String json = mapper.writeValueAsString( request );

        mvc.perform( post( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isBadRequest() )
                .andExpect( jsonPath( "$.error", Matchers.equalTo( "Cannot have null item name / empty item name" ) ) );
    }

    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testCreateItemEmptyName () throws Exception {
        final CreateItemRequest request = new CreateItemRequest();
        request.setItemDto( new ItemDto( null, "", ITEM_DESCRIPTION, ITEM_PRICE ) );
        request.setInitialAmount( 1 );
        request.setLocationId( 1L );

        final String json = mapper.writeValueAsString( request );

        mvc.perform( post( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isBadRequest() )
                .andExpect( jsonPath( "$.error", Matchers.equalTo( "Cannot have null item name / empty item name" ) ) );
    }

    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testCreateItemNullDescription () throws Exception {
        final CreateItemRequest request = new CreateItemRequest();
        request.setItemDto( new ItemDto( null, ITEM_NAME, null, ITEM_PRICE ) );
        request.setInitialAmount( 1 );
        request.setLocationId( 1L );

        final String json = mapper.writeValueAsString( request );

        mvc.perform( post( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isBadRequest() )
                .andExpect( jsonPath( "$.error",
                        Matchers.equalTo( "Cannot have null item description / empty item description" ) ) );
    }

    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testCreateItemEmptyDescription () throws Exception {
        final CreateItemRequest request = new CreateItemRequest();
        request.setItemDto( new ItemDto( null, ITEM_NAME, "", ITEM_PRICE ) );
        request.setInitialAmount( 1 );
        request.setLocationId( 1L );

        final String json = mapper.writeValueAsString( request );

        mvc.perform( post( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isBadRequest() )
                .andExpect( jsonPath( "$.error",
                        Matchers.equalTo( "Cannot have null item description / empty item description" ) ) );
    }

    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testCreateItemZeroPrice () throws Exception {
        final CreateItemRequest request = new CreateItemRequest();
        request.setItemDto( new ItemDto( null, ITEM_NAME, ITEM_DESCRIPTION, 0.0 ) );
        request.setInitialAmount( 1 );
        request.setLocationId( 1L );

        final String json = mapper.writeValueAsString( request );

        mvc.perform( post( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isBadRequest() )
                .andExpect( jsonPath( "$.error", Matchers.equalTo( "Cannot have price as $0 for an item" ) ) );
    }

    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testCreateItemDuplicateName () throws Exception {
        final ItemDto existingItem = new ItemDto( 1L, ITEM_NAME, "Another description", 2.5 );

        Mockito.when( itemService.getAllItems() ).thenReturn( Arrays.asList( existingItem ) );

        final CreateItemRequest request = new CreateItemRequest();
        request.setItemDto( new ItemDto( null, ITEM_NAME, ITEM_DESCRIPTION, ITEM_PRICE ) );
        request.setInitialAmount( 5 );
        request.setLocationId( 1L );

        final String json = mapper.writeValueAsString( request );

        mvc.perform( post( API_PATH ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isBadRequest() )
                .andExpect( jsonPath( "$.error",
                        Matchers.equalTo( "Found matching item name; cannot have 2 items with same name" ) ) );
    }
}
