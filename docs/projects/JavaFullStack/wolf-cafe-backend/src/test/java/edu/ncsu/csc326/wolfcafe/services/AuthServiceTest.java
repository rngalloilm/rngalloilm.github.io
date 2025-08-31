package edu.ncsu.csc326.wolfcafe.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.JwtAuthResponse;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.LoginDto;
import edu.ncsu.csc326.wolfcafe.dto.RegisterDto;
import edu.ncsu.csc326.wolfcafe.dto.UserDto;
import edu.ncsu.csc326.wolfcafe.entity.Role;
import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.exception.WolfCafeAPIException;
import edu.ncsu.csc326.wolfcafe.repositories.RoleRepository;
import edu.ncsu.csc326.wolfcafe.repositories.UserRepository;
import edu.ncsu.csc326.wolfcafe.service.AuthService;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
//test case for authService class 
@SpringBootTest
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService         authService; // Inject AuthService 

    @Autowired
    private UserRepository      userRepository; // Inject UserRepository

    @Autowired
    private RoleRepository      roleRepository; // Inject RoleRepository

    @Autowired
    private PasswordEncoder     passwordEncoder; // Inject PasswordEncoder 

    @Autowired
    private LocationService     locationService; // Inject LocationService

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil; // Inject utility to clean up the databas

    private RegisterDto         registerDto; // DTO for user registration
    private LoginDto            loginDto; // DTO for user login
    private User                user; // User entity f
    private Role                customerRole;  //used to assign a user the customer role
   /**
    * Set up test data before each test case.
    */
    @BeforeEach
    public void setUp () {
        databaseCleanupUtil.truncateAllTables();

        registerDto = new RegisterDto( "John Doe", "jdoe", "johndoe@example.com", "password123", null );
        loginDto = new LoginDto( "jdoe", "password123" );

        // Initialize roles if they don't exist
        customerRole = roleRepository.findByName( "ROLE_CUSTOMER" );
        if ( customerRole == null ) {
            customerRole = new Role();
            customerRole.setName( "ROLE_CUSTOMER" );
            customerRole = roleRepository.save( customerRole );
        }

        // Pre-create user with customer role for login tests
        user = new User();
        user.setName( "Existing User" );
        user.setUsername( "existingUser" );
        user.setEmail( "existing@example.com" );
        user.setPassword( passwordEncoder.encode( "password" ) );
        user.setRoles( Set.of( customerRole ) );
        userRepository.save( user );
    }
    /**
     * Test the user registration functionality.
     */
    @Test
    public void testRegisterUserSuccess () {
        final String response = authService.register( registerDto );
        assertEquals( "User registered successfully.", response );

        final User registeredUser = userRepository.findByUsername( "jdoe" ).orElse( null );
        assertNotNull( registeredUser );
        assertEquals( "John Doe", registeredUser.getName() );
        assertEquals( "johndoe@example.com", registeredUser.getEmail() );
    }
    /**
     * Test registration with a duplicate username.
     */
    @Test
    public void testRegisterUserDuplicateUsername () {
        registerDto.setUsername( "existingUser" ); // Use existing username

        final WolfCafeAPIException exception = assertThrows( WolfCafeAPIException.class,
                () -> authService.register( registerDto ) );
        assertEquals( "Username or email already exists.", exception.getMessage() );
    }
    /**
     * Test registration with a duplicate email.
     */
    @Test
    public void testRegisterUserDuplicateEmail () {
        registerDto.setEmail( "existing@example.com" ); // Use existing email

        final WolfCafeAPIException exception = assertThrows( WolfCafeAPIException.class,
                () -> authService.register( registerDto ) );
        assertEquals( "Username or email already exists.", exception.getMessage() );
    }
    /**
     * Test the login functionality.
     */
    @Test
    public void testLoginUserSuccess () {
        final LoginDto loginDto = new LoginDto( "existingUser", "password" );
        final JwtAuthResponse response = authService.login( loginDto );

        assertNotNull( response.getAccessToken() );
        assertEquals( "ROLE_CUSTOMER", response.getRole() );
    }
    /**
     * Test login with an invalid password.
     */
    @Test
    public void testLoginUserInvalidPassword () {
        final LoginDto loginDto = new LoginDto( "existingUser", "wrongpassword" );

        // final WolfCafeAPIException exception = assertThrows(
        // WolfCafeAPIException.class,
        // () -> authService.login( loginDto ) );
        // assertEquals( "Invalid username or password", exception.getMessage()
        // );
    }
    /**
     * Test deleting a user by their ID.
     */
    @Test
    public void testDeleteUserByIdSuccess () {
        final User user = userRepository.findByUsername( "existingUser" ).orElse( null );
        assertNotNull( user );

        authService.deleteUserById( user.getId() );
        assertFalse( userRepository.existsById( user.getId() ) );
    }
    /**
     * Test attempting to delete a non-existing user.
     */
    @Test
    public void testDeleteUserByIdNotFound () {
        assertThrows( ResourceNotFoundException.class, () -> authService.deleteUserById( -1L ) );
    }
    /**
     * Test retrieving all users.
     */
    @Test
    public void testGetAllUsers () {
        final List<UserDto> users = authService.getAllUsers();
        assertTrue( users.size() > 0 );
        // assertEquals( "admin", users.get( 0 ).getUsername() );
    }
    /**
     * Test retrieving a user by their ID.
     */
    @Test
    public void testGetUserByIdSuccess () {
        final User user = userRepository.findByUsername( "existingUser" ).orElse( null );
        assertNotNull( user );

        final UserDto userDto = authService.getUserById( user.getId() );
        assertEquals( "existingUser", userDto.getUsername() );
    }
    /**
     * Test retrieving a user by ID that does not exist.
     */
    @Test
    public void testGetUserByIdNotFound () {
        assertThrows( ResourceNotFoundException.class, () -> authService.getUserById( -1L ) );
    }
    /**
     *  Test editing a user by ID.
     */
    @Test
    public void testEditUserByIdSuccess () {
        final User user = userRepository.findByUsername( "existingUser" ).orElse( null );
        assertNotNull( user );

        final RegisterDto updatedDto = new RegisterDto( "Updated Name", "updatedUser", "updated@example.com",
                "newPassword", null );
        final String response = authService.editUserById( user.getId(), updatedDto );
        assertEquals( "User updated successfully.", response );

        final User updatedUser = userRepository.findById( user.getId() ).orElse( null );
        assertEquals( "Updated Name", updatedUser.getName() );
        assertTrue( passwordEncoder.matches( "newPassword", updatedUser.getPassword() ) );
    }
    /**
     * Test editing a user with a duplicate username.
     */
    @Test
    public void testEditUserDuplicateUsername () {
        final User user = userRepository.findByUsername( "existingUser" ).orElse( null );
        assertNotNull( user );

        // final RegisterDto updatedDto = new RegisterDto( "Updated Name",
        // "jdoe", "updated@example.com", "newPassword" );
        //// assertThrows( WolfCafeAPIException.class, () ->
        // authService.editUserById( user.getId(), updatedDto ) );
    }
    /**
     * Test registering a staff user.
     */
    @Test
    public void testRegisterStaffSuccess () {
        LocationDto dto = new LocationDto( null, "some property", "some property", 0, null, null,
                LocalTime.of( 18, 0 ) );
        dto = locationService.createLocation( dto );
        final RegisterDto staffDto = new RegisterDto( "Staff User", "staffUser", "staff@example.com", "staffPassword",
                dto.getId() );
        final String response = authService.registerStaff( staffDto );
        assertEquals( "Staff registered successfully.", response );

        final User registeredStaff = userRepository.findByUsername( "staffUser" ).orElse( null );
        assertNotNull( registeredStaff );
        assertTrue( registeredStaff.getRoles().stream().anyMatch( role -> role.getName().equals( "ROLE_STAFF" ) ) );
    }
}
