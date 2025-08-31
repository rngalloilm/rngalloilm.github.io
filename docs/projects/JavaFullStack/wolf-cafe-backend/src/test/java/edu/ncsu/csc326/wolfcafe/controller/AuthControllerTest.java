package edu.ncsu.csc326.wolfcafe.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Arrays;

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

import edu.ncsu.csc326.wolfcafe.TestUtils;
import edu.ncsu.csc326.wolfcafe.dto.JwtAuthResponse;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.LoginDto;
import edu.ncsu.csc326.wolfcafe.dto.RegisterDto;
import edu.ncsu.csc326.wolfcafe.dto.UserDto;
import edu.ncsu.csc326.wolfcafe.service.AuthService;
/**
 * Unit tests for the AuthController class 
 */
@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {
	// MockMvc to simulate HTTP requests
    @Autowired
    private MockMvc     mockMvc;
 // Mocked authentication service
    @MockBean
    private AuthService authService;

    private RegisterDto registerDto;
    private LoginDto    loginDto;
    private UserDto     userDto;
    /**
     * Sets up mock objects and DTOs for testing 
     */
    @BeforeEach
    public void setUp () {
        MockitoAnnotations.openMocks( this );

        // Initialize DTOs
        registerDto = new RegisterDto( "John Doe", "jdoe", "johndoe@example.com", "password123", null );
        loginDto = new LoginDto( "jdoe", "password123" );
        userDto = new UserDto( 1L, "John Doe", "jdoe", "johndoe@example.com", "password", new ArrayList<>(),
                new ArrayList<>(), new LocationDto() );
        // "ROLE_CUSTOMER",
        // Collections.emptyList() );
    }
    /**
     * Test for registering a new user.
     * 
     */
    @Test
    public void testRegisterUser () throws Exception {
        when( authService.register( any( RegisterDto.class ) ) ).thenReturn( "User registered successfully." );

        mockMvc.perform( post( "/api/auth/register" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( registerDto ) ) ).andExpect( status().isCreated() )
                .andExpect( content().string( "User registered successfully." ) );
    }
    /**
     * Test for logging in a user.
     */
    @Test
    public void testLoginUser () throws Exception {
        final JwtAuthResponse jwtAuthResponse = new JwtAuthResponse( "Bearer", "token123", "ROLE_CUSTOMER", null );
        when( authService.login( any( LoginDto.class ) ) ).thenReturn( jwtAuthResponse );

        mockMvc.perform( post( "/api/auth/login" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( loginDto ) ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$.tokenType" ).value( "token123" ) )
                .andExpect( jsonPath( "$.accessToken" ).value( "Bearer" ) )
                .andExpect( jsonPath( "$.role" ).value( "ROLE_CUSTOMER" ) );
    }
    /**
     * Test for deleting a user with admin authorization.
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testDeleteUser () throws Exception {
        doNothing().when( authService ).deleteUserById( 1L );

        mockMvc.perform( delete( "/api/auth/user/1" ) ).andExpect( status().isOk() )
                .andExpect( content().string( "User deleted successfully." ) );
    }
    /**
     * Test for retrieving all users
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testGetAllUsers () throws Exception {
        when( authService.getAllUsers() ).thenReturn( Arrays.asList( userDto ) );

        mockMvc.perform( get( "/api/auth/user" ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$[0].id" ).value( userDto.getId() ) )
                .andExpect( jsonPath( "$[0].name" ).value( userDto.getName() ) )
                .andExpect( jsonPath( "$[0].username" ).value( userDto.getUsername() ) );
        // .andExpect( jsonPath( "$[0].role" ).value( userDto.getRole() ) );
    }
    /**
     * Test for retrieving a user by ID 
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testGetUserById () throws Exception {
        when( authService.getUserById( 1L ) ).thenReturn( userDto );

        mockMvc.perform( get( "/api/auth/user/1" ) ).andExpect( status().isOk() )
                .andExpect( jsonPath( "$.id" ).value( userDto.getId() ) )
                .andExpect( jsonPath( "$.name" ).value( userDto.getName() ) )
                .andExpect( jsonPath( "$.username" ).value( userDto.getUsername() ) );
        // .andExpect( jsonPath( "$.role" ).value( userDto.getRole() ) );
    }
    
    /**
     * Test for editing a user with admin authorization.
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testEditUser () throws Exception {
        when( authService.editUserById( eq( 1L ), any( RegisterDto.class ) ) )
                .thenReturn( "User updated successfully." );

        mockMvc.perform( put( "/api/auth/user/1" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( registerDto ) ) ).andExpect( status().isOk() )
                .andExpect( content().string( "User updated successfully." ) );
    }
    /**
     * Test for registering a staff member with admin authorization.
     */
    @WithMockUser ( username = "admin", roles = "ADMIN" )
    @Test
    public void testRegisterStaff () throws Exception {
        when( authService.registerStaff( any( RegisterDto.class ) ) ).thenReturn( "Staff registered successfully." );

        mockMvc.perform( post( "/api/auth/createStaff" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( registerDto ) ) ).andExpect( status().isCreated() )
                .andExpect( content().string( "Staff registered successfully." ) );
    }
    /**
     * Test for ensuring a customer cannot delete a user (
     */
    @WithMockUser ( username = "user", roles = "CUSTOMER" )
    @Test
    public void testDeleteUserAccessDeniedForCustomer () throws Exception {
        mockMvc.perform( delete( "/api/auth/user/1" ) ).andExpect( status().isForbidden() );
    }

    /**
     * Test for ensuring a customer cannot edit a user 
     */
    @WithMockUser ( username = "user", roles = "CUSTOMER" )
    @Test
    public void testEditUserAccessDeniedForCustomer () throws Exception {
        mockMvc.perform( put( "/api/auth/user/1" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( registerDto ) ) ).andExpect( status().isForbidden() );
    }
    /**
     * Test for ensuring a customer cannot register staff 
     */
    @WithMockUser ( username = "user", roles = "CUSTOMER" )
    @Test
    public void testRegisterStaffAccessDeniedForCustomer () throws Exception {
        mockMvc.perform( post( "/api/auth/createStaff" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( registerDto ) ) ).andExpect( status().isForbidden() );
    }
}
