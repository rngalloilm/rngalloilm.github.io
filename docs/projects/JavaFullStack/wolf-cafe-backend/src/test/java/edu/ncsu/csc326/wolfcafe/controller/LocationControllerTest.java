package edu.ncsu.csc326.wolfcafe.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.TestUtils;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
/** class to test the location functionality  */ 
@SpringBootTest
@AutoConfigureMockMvc
public class LocationControllerTest {

    @Autowired
    private MockMvc             mvc; // MockMvc for simulating HTTP requests to the controller

    @Autowired
    private LocationService     locationService; // Service for managing location-related operations

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil; // Utility for cleaning up the database before each test


    LocationDto                 locationDto; //Location Dto object 
    /**
     * Sets up the test environment before each test.
     */
    @BeforeEach
    public void setUp () {
        databaseCleanupUtil.truncateAllTables();

        locationDto = locationService.createLocation(
                new LocationDto( 1L, "Existing Cafe", "456 Existing St", 0.07, null, null, LocalTime.of( 18, 0 ) ) );
    }
    /**
     * Test retrieving a location by its ID
     * @throws Exception if the location with the given ID does not exist 
     */
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Test
    @Transactional
    public void testGetLocation () throws Exception {
        mvc.perform( get( "/api/locations/{id}", locationDto.getId() ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.id" ).value( locationDto.getId() ) )
                .andExpect( jsonPath( "$.name" ).value( locationDto.getName() ) )
                .andExpect( jsonPath( "$.address" ).value( locationDto.getAddress() ) );
    }
    /**
     * Test retrieving all locations.
     * @throws Exception if the locations is the system are not able to be retrieved 
     */
    @Test
    @Transactional
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testGetAllLocations () throws Exception {
        mvc.perform( get( "/api/locations" ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$" ).isArray() );
    }
    /**
     * Test creating a new location.
     * @throws Exception if it can not create the given location(Ex. maybe the format is incorrect)
     */
    @Test
    @Transactional
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    public void testCreateLocation () throws Exception {
        final String locationJson = """
                {
                    "id": 2,
                    "name": "New Cafe",
                    "address": "123 Test St",
                    "taxRate": 0.05,
                    "endOfDayTime": "18:00"
                }
                """;

        mvc.perform( post( "/api/locations" ).contentType( MediaType.APPLICATION_JSON ).content( locationJson )
                .accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$.name" ).value( "New Cafe" ) )
                .andExpect( jsonPath( "$.address" ).value( "123 Test St" ) );
    }
    /**
     *  Test deleting a location by its ID.
     * @throws Exception if the location with the given can not be deleted
     */
    @Test
    @Transactional
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    public void testDeleteLocation () throws Exception {
        // Assuming ID 1 exists for deletion test
        mvc.perform( delete( "/api/locations/{id}", locationDto.getId() ) ).andExpect( status().isNoContent() );
    }
    /**
     * Test setting the tax rate for a location
     * @throws Exception if the location does not exist or some other error 
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testSetLocationTax () throws Exception {
        final LocationDto locationDto = new LocationDto();
        locationDto.setId( 1L );
        locationDto.setTaxRate( 0.05 );

        mvc.perform( put( "/api/locations/{id}/taxrate", locationDto.getId() ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( locationDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() );
    }
    /**
     * Test setting the tax rate with an invalid value (below the minimum threshold).
     * @throws Exception invalid request since the tax rate is below 0.02
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testSetLocationTaxBadRequest () throws Exception {
        final LocationDto locationDto = new LocationDto();
        locationDto.setId( 1L );
        locationDto.setTaxRate( 0.01 );

        mvc.perform( put( "/api/locations/{id}/taxrate", locationDto.getId() ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( locationDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isBadRequest() )
                .andExpect( jsonPath( "$" ).value( "Tax rate must be at least 2%" ) );
    }
    /**
     * Test setting the tax rate for a non-existent location.
     * @throws Exception the location with the given id does not exist 
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testSetLocationTaxNotFound () throws Exception {
        final LocationDto locationDto = new LocationDto();
        locationDto.setId( 999L ); // Non-existent location ID
        locationDto.setTaxRate( 0.05 );

        mvc.perform( put( "/api/locations/{id}/taxrate", locationDto.getId() ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( locationDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isNotFound() );
    }
    /**
     * Test setting the tax rate below the allowed limit
     * @throws Exception a bad request because the tax rate is below 2%
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testSetLocationTaxBelowTwoPercent () throws Exception {
        final LocationDto locationDto = new LocationDto();
        locationDto.setId( 1L );
        locationDto.setTaxRate( 0.01 ); // Tax rate below 2%

        mvc.perform( put( "/api/locations/{id}/taxrate", locationDto.getId() ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( locationDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isBadRequest() )
                .andExpect( jsonPath( "$" ).value( "Tax rate must be at least 2%" ) );
    }

}
