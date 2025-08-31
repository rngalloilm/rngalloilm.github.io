package edu.ncsu.csc326.wolfcafe.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.UserDto;
import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.service.UserService;
//test for user controller 
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc     mockMvc; // Injects MockMvc to simulate HTTP requests

    @MockBean
    private UserService userService; // Mock the UserService to simulate database operations

    private UserDto     userDto; // DTO representing a user for test purposes
    /**
     * sets up the environment for tests
     */
    @BeforeEach
    public void setUp () {
        MockitoAnnotations.openMocks( this );
        userDto = new UserDto( 1L, "John Doe", "jdoe", "johndoe@example.com", "password", new ArrayList<>(),
                new ArrayList<>(), new LocationDto() );
    }
    /**
     * test case for fetching the current logged-in user. 
     * @throws Exception if there is an error fetching an user 
     */
    @Test
    void getCurrentUser () throws Exception {
        final User user = new User( 1L, "John Doe", "jdoe", "johndoe@example.com", "password", new ArrayList<>(),
                new ArrayList<>(), new Location() );

        // Mock the service to return the User object
        when( userService.fetchCurrentUser() ).thenReturn( user );

        mockMvc.perform( get( "/api/users/me" ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$.id" ).value( user.getId() ) )
                .andExpect( jsonPath( "$.name" ).value( user.getName() ) )
                .andExpect( jsonPath( "$.username" ).value( user.getUsername() ) )
                .andExpect( jsonPath( "$.email" ).value( user.getEmail() ) );
    }

}
