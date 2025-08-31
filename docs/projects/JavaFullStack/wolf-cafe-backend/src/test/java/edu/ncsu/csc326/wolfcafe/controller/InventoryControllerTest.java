package edu.ncsu.csc326.wolfcafe.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.TestUtils;
import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryItemDto;
import edu.ncsu.csc326.wolfcafe.service.InventoryService;
//test class for the inventory controller 
@SpringBootTest
@AutoConfigureMockMvc
class InventoryControllerTest {

    @Autowired
    private MockMvc             mockMvc;

    @MockBean
    private InventoryService    inventoryService;

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil;

    @BeforeEach
    void setUp () {
        MockitoAnnotations.openMocks( this );
        databaseCleanupUtil.truncateAllTables();
    }

    /**
     * Tests retrieval of the inventory for a specific location.
     *
     * This test verifies that the GET request to "/api/inventory/{id}" returns
     * the correct InventoryDto for the specified location ID.
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform call.
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    void testGetInventoryForLocation () throws Exception {
        final Long locationId = 1L;
        final InventoryDto inventoryDto = new InventoryDto();
        inventoryDto.setId( 1L );
        inventoryDto.setItems( Collections.emptyList() );

        when( inventoryService.getInventory( locationId ) ).thenReturn( inventoryDto );

        mockMvc.perform( get( "/api/inventory/{id}", locationId ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$.id" ).value( 1L ) );
    }

    /**
     * Tests updating the inventory for a specific location.
     *
     * Verifies that the PUT request to "/api/inventory/{id}" successfully
     * updates the inventory with valid item quantities.
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform call.
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    void testUpdateInventoryForLocation () throws Exception {
        final Long locationId = 1L;

        final IngredientDto ingredientDto = new IngredientDto();
        ingredientDto.setId( 1L );
        ingredientDto.setName( "PUMPKIN SPICE" );

        final InventoryItemDto inventoryItemDto = new InventoryItemDto();
        inventoryItemDto.setAmount( 10 );
        inventoryItemDto.setIngredient( ingredientDto );

        final InventoryDto inventoryDto = new InventoryDto();
        inventoryDto.setId( 1L );
        inventoryDto.setItems( List.of( inventoryItemDto ) );

        when( inventoryService.updateInventory( any( InventoryDto.class ) ) ).thenReturn( inventoryDto );

        mockMvc.perform( put( "/api/inventory/{id}", locationId ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( inventoryDto ) ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$.id" ).value( 1L ) )
                .andExpect( jsonPath( "$.items[0].ingredient.name" ).value( "PUMPKIN SPICE" ) )
                .andExpect( jsonPath( "$.items[0].amount" ).value( 10 ) );
    }

    /**
     * Tests updating inventory with an invalid item amount.
     *
     * Ensures that a PUT request to "/api/inventory/{id}" returns a bad request
     * (HTTP 400) if an inventory item has a negative amount.
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform call.
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    void testUpdateInventoryInvalidAmount () throws Exception {
        final Long locationId = 1L;

        final IngredientDto ingredientDto = new IngredientDto();
        ingredientDto.setId( 1L );
        ingredientDto.setName( "PUMPKIN SPICE" );

        final InventoryItemDto inventoryItemDto = new InventoryItemDto();
        inventoryItemDto.setAmount( -5 ); // Invalid amount
        inventoryItemDto.setIngredient( ingredientDto );

        final InventoryDto inventoryDto = new InventoryDto();
        inventoryDto.setId( 1L );
        inventoryDto.setItems( List.of( inventoryItemDto ) );

        mockMvc.perform( put( "/api/inventory/{id}", locationId ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( inventoryDto ) ) ).andExpect( status().isBadRequest() );
    }
}
