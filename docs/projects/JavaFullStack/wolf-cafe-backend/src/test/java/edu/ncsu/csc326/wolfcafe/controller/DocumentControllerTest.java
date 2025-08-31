package edu.ncsu.csc326.wolfcafe.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Paths;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import edu.ncsu.csc326.wolfcafe.exception.GlobalExceptionHandler;

/**
 * Unit tests for the DocumentController class
 */
@SpringBootTest
public class DocumentControllerTest {

    @Autowired
    private DocumentController documentController; // Controller being tested

    private MockMvc            mockMvc;            // MockMvc to simulate HTTP
                                                   // requests and validate
                                                   // responses

    @BeforeEach
    public void setup () {
        mockMvc = MockMvcBuilders.standaloneSetup( documentController )
                .setControllerAdvice( new GlobalExceptionHandler() ).build();
    }

    /**
     * Initializes the MockMvc object before each test case.
     */
    @Test
    public void testGetDocumentWithValidCategory () throws Exception {
        final String category = "PrivacyPolicy"; // Example valid category
        mockMvc.perform( MockMvcRequestBuilders.get( "/api/document/{category}", category ) )
                .andExpect( status().isOk() ); // Expect a 200 OK status

    }

    /**
     * Tests the GET /api/document/{category} endpoint with the four valid
     * categories: privacyPolicy, userGuide, developerGuide, and humanFlourshing
     *
     */
    @Test
    public void testGetDocumentWithInvalidCategory () throws Exception {
        final String category = "NonExistingCategory"; // Example invalid
                                                       // category
        mockMvc.perform( MockMvcRequestBuilders.get( "/api/document/{category}", category ) )
                .andExpect( status().isNotFound() ) // Expect a 404 Not found
                                                    // Exception
                .andExpect( content().string( "{\"error\":\"Could not find category NonExistingCategory\"}" ) ); // Expect
        // the
        // error
        // message
    }

    /**
     * Tests the GET /api/document/{category} endpoint with an invalid category
     * not privacyPolicy, userGuide, developerGuide, and humanFlourshing
     *
     */
    @Test
    public void testGetDocumentNotFound () throws Exception {
        final String category = "UserGuide3"; // Assume "UserGuide" does not
                                              // exist in the file system for
                                              // this test
        mockMvc.perform( MockMvcRequestBuilders.get( "/api/document/{category}", category ) )
                .andExpect( status().isNotFound() ) // Expect a 404 Not Found
                                                    // status
                .andExpect( content()
                        .string( org.hamcrest.Matchers.containsString( "Could not find category UserGuide3" ) ) );
    }

    /**
     * Tests the GET /api/document/{category} endpoint with an invalid parent
     * path
     */
    @Test
    public void testGetDocumentNotFoundTwo () throws Exception {
        final String originalUserDir = System.getProperty( "user.dir" );
        System.setProperty( "user.dir", Paths.get( "/" ).toString() ); // Root
                                                                       // directory
                                                                       // has no
                                                                       // parent

        final String category = "UserGuide"; // Assume "UserGuide" does not
                                             // exist in the file system for
                                             // this test
        mockMvc.perform( MockMvcRequestBuilders.get( "/api/document/{category}", category ) )
                .andExpect( status().isInternalServerError() ) // Expect a 404
                                                               // Not Found
                // status
                .andExpect( content()
                        .string( org.hamcrest.Matchers.containsString( "Parent directory could not be determined" ) ) );
        System.setProperty( "user.dir", originalUserDir );
    }

}
