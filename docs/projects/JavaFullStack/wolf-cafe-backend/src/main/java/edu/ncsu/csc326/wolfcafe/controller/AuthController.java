package edu.ncsu.csc326.wolfcafe.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ncsu.csc326.wolfcafe.dto.JwtAuthResponse;
import edu.ncsu.csc326.wolfcafe.dto.LoginDto;
import edu.ncsu.csc326.wolfcafe.dto.RegisterDto;
import edu.ncsu.csc326.wolfcafe.dto.UserDto;
import edu.ncsu.csc326.wolfcafe.service.AuthService;
import lombok.AllArgsConstructor;

/**
 * Controller for authentication functionality.
 */
@CrossOrigin ( "*" )
@RestController
@RequestMapping ( "/api/auth" )
@AllArgsConstructor
public class AuthController {

    /** Link to AuthService */
    private final AuthService authService;

    /**
     * Registers a new customer user with the system.
     *
     * @param registerDto
     *            object with registration info
     * @return response indicating success or failure
     */
    @PostMapping ( "/register" )
    public ResponseEntity<String> register ( @RequestBody final RegisterDto registerDto ) {
        final String response = authService.register( registerDto );
        return new ResponseEntity<>( response, HttpStatus.CREATED );
    }

    /**
     * Logs in the given user
     *
     * @param loginDto
     *            user information for login
     * @return object representing the logged in user
     */
    @PostMapping ( "/login" )
    public ResponseEntity<JwtAuthResponse> login ( @RequestBody final LoginDto loginDto ) {
        final JwtAuthResponse jwtAuthResponse = authService.login( loginDto );
        return new ResponseEntity<>( jwtAuthResponse, HttpStatus.OK );
    }

    /**
     * Deletes the given user. Requires the ADMIN role.
     *
     * @param id
     *            id of user to delete
     * @return response indicating success or failure
     */
    @PreAuthorize ( "hasRole('ADMIN')" )
    @DeleteMapping ( "/user/{id}" )
    public ResponseEntity<String> deleteUser ( @PathVariable ( "id" ) final Long id ) {
        authService.deleteUserById( id );
        return ResponseEntity.ok( "User deleted successfully." );
    }

    /**
     * GET all users
     *
     * @return the response entity of action
     */
    @PreAuthorize ( "hasRole('ADMIN')" )
    @GetMapping ( "/user" )
    public ResponseEntity<List<UserDto>> getAllUsers () {
        final List<UserDto> users = authService.getAllUsers();
        return ResponseEntity.ok( users );
    }

    @PreAuthorize ( "hasRole('ADMIN')" )
    @GetMapping ( "/user/{id}" )
    public ResponseEntity<UserDto> getUserById ( @PathVariable ( "id" ) final Long id ) {
        final UserDto userDto = authService.getUserById( id );
        return ResponseEntity.ok( userDto );
    }

    /**
     * Edits the given user. Requires the ADMIN role.
     *
     * @param id
     *            id of the user to edit
     * @param userDto
     *            updated user information
     * @return response indicating success or failure
     */
    @PreAuthorize ( "hasRole('ADMIN')" )
    @PutMapping ( "/user/{id}" )
    public ResponseEntity<String> editUser ( @PathVariable ( "id" ) final Long id,
            @RequestBody final RegisterDto userDto ) {
        final String response = authService.editUserById( id, userDto );
        return new ResponseEntity<>( response, HttpStatus.OK );
    }

    /**
     * Registers a new staff user with the system. Requires ADMIN role.
     *
     * @param registerDto
     *            object with registration info
     * @return response indicating success or failure
     */
    @PreAuthorize ( "hasRole('ADMIN')" )
    @PostMapping ( "/createStaff" )
    public ResponseEntity<String> createStaff ( @RequestBody final RegisterDto registerDto ) {
        final String response = authService.registerStaff( registerDto );
        return new ResponseEntity<>( response, HttpStatus.CREATED );
    }

}
