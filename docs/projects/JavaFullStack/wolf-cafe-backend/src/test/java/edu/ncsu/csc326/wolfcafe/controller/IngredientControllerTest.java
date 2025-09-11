package edu.ncsu.csc326.wolfcafe.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalTime;
import java.util.Arrays;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.TestUtils;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateIngredientRequest;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
//test class for testing the ingredient controller class 
@SpringBootTest
@AutoConfigureMockMvc
public class IngredientControllerTest {

    /** Mock MVC for testing controller */
    @Autowired
    private MockMvc             mvc;

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil;

    @Autowired
    private LocationService     locationService;

    private Long                testLocationId;

    /**
     * Sets up the test environment by clearing the ingredient repository before
     * each test and creating a test location.
     */
    @BeforeEach
    void setUp () {
        databaseCleanupUtil.truncateAllTables();

        // Create a test location
        final LocationDto locationDto = new LocationDto( null, "Test Location", "123 Test St", 0.08, null, null,
                LocalTime.of( 18, 0 ) );
        testLocationId = locationService.createLocation( locationDto ).getId();
    }

    /**
     * Tests the creation of an ingredient using the helper function.
     */
    @Test
    @Transactional
    @WithMockUser ( username = "staff", roles = "STAFF" )
    void testCreateIngredient () throws Exception {
        helperCreateIngredient( "Coffee", testLocationId );
    }

    /**
     * Tests retrieving multiple ingredients by their ID.
     */
    @Test
    @Transactional
    @WithMockUser ( username = "staff", roles = "STAFF" )
    void testGetIngredient () throws Exception {
        for ( int i = 0; i < 3; i++ ) {
            final IngredientDto dto = helperCreateIngredient( "Coffee #" + i, testLocationId );

            final IngredientDto returnedDto = helperGetIngredient( "Coffee #" + i, dto.getId(), false );
            assertEquals( returnedDto.getId(), dto.getId() );
            assertEquals( returnedDto.getName(), dto.getName() );
        }
    }

    /**
     * Tests the deletion of an ingredient.
     */
    @Test
    @Transactional
    @WithMockUser ( username = "staff", roles = "STAFF" )
    void testDeleteIngredient () throws Exception {
        final IngredientDto dto = helperCreateIngredient( "Coffee", testLocationId );

        mvc.perform( delete( "/api/ingredients/" + dto.getId() ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isNoContent() );

        final IngredientDto returnedDto = helperGetIngredient( "Coffee", dto.getId(), true );
        assertEquals( returnedDto, null );
    }

    /**
     * Tests retrieving all ingredients.
     */
    @Test
    @Transactional
    @WithMockUser ( username = "staff", roles = "STAFF" )
    void testGetAllIngredients () throws Exception {
        mvc.perform( get( "/api/ingredients" ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$" ).isArray() ).andExpect( jsonPath( "$" ).isEmpty() );

        final String[] ingredients = { "Butterscotch", "Candy Corn", "Bubblegum" };
        Arrays.stream( ingredients ).forEach( name -> helperCreateIngredient( name, testLocationId ) );

        final MvcResult result = mvc.perform( get( "/api/ingredients" ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$", hasSize( ingredients.length ) ) ).andReturn();

        final String content = result.getResponse().getContentAsString();
        final ObjectMapper mapper = new ObjectMapper();
        final JsonNode jsonArray = mapper.readTree( content );

        for ( int i = 0; i < ingredients.length; i++ ) {
            assertEquals( ingredients[i], jsonArray.get( i ).get( "name" ).asText() );
        }
    }

    /**
     * Tests deleting all ingredients.
     */
    @Test
    @Transactional
    @WithMockUser ( username = "staff", roles = "STAFF" )
    void testDeleteAllIngredients () throws Exception {
        final String[] ingredients = { "Butterscotch", "Candy Corn", "Bubblegum" };
        Arrays.stream( ingredients ).forEach( name -> helperCreateIngredient( name, testLocationId ) );

        mvc.perform( get( "/api/ingredients" ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$", hasSize( ingredients.length ) ) ).andReturn();

        mvc.perform( delete( "/api/ingredients" ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isNoContent() );

        mvc.perform( get( "/api/ingredients" ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$", hasSize( 0 ) ) ).andReturn();
    }

    /**
     * Helper method to create an IngredientDto by sending an HTTP POST request.
     */
    public IngredientDto helperCreateIngredient ( final String name, final Long locationId ) {
        final IngredientDto ingredient = new IngredientDto( name );
        final CreateIngredientRequest createIngredientRequest = new CreateIngredientRequest();
        createIngredientRequest.setIngredientDto( ingredient );
        createIngredientRequest.setInitialAmount( 1 );
        createIngredientRequest.setLocationId( locationId );

        try {
            final MvcResult result = mvc.perform( post( "/api/ingredients" ).contentType( MediaType.APPLICATION_JSON )
                    .content( TestUtils.asJsonString( createIngredientRequest ) ).accept( MediaType.APPLICATION_JSON ) )
                    .andExpect( status().isOk() ).andExpect( jsonPath( "$.name" ).value( name ) ).andReturn();

            final String jsonResponse = result.getResponse().getContentAsString();
            final ObjectMapper mapper = new ObjectMapper();
            final JsonNode jsonNode = mapper.readTree( jsonResponse );

            ingredient.setId( jsonNode.get( "id" ).asLong() );
            System.out.println( name + " Set ID to " + jsonNode.get( "id" ).asLong() );
        }
        catch ( final Exception e ) {
            Assertions.fail( "Failed to create ingredient: " + e.getMessage() );
        }

        return ingredient;
    }

    /**
     * Helper method to retrieve an IngredientDto by its ID and name.
     */
    public IngredientDto helperGetIngredient ( final String name, final long id, final boolean expectingDeleted ) {
        IngredientDto ingredient = null;
        try {
            final MvcResult result = mvc.perform( get( "/api/ingredients/" + id ).accept( MediaType.APPLICATION_JSON ) )
                    .andExpect( !expectingDeleted ? status().isOk() : status().isNotFound() ).andReturn();

            final String jsonResponse = result.getResponse().getContentAsString();
            final ObjectMapper mapper = new ObjectMapper();
            final JsonNode jsonNode = mapper.readTree( jsonResponse );

            if ( jsonNode.has( "name" ) && jsonNode.has( "id" ) ) {
                ingredient = new IngredientDto();
                ingredient.setName( jsonNode.get( "name" ).asText() );
                ingredient.setId( jsonNode.get( "id" ).asLong() );
            }
        }
        catch ( final Exception e ) {
            Assertions.fail( "Failed to fetch ingredient: " + e.getMessage() );
        }

        return ingredient;
    }
}
