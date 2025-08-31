package edu.ncsu.csc326.wolfcafe.service;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.JwtAuthResponse;
import edu.ncsu.csc326.wolfcafe.dto.LoginDto;
import edu.ncsu.csc326.wolfcafe.dto.RegisterDto;
import edu.ncsu.csc326.wolfcafe.dto.UserDto;

/**
 * Authorization service
 */
public interface AuthService {
    /**
     * Registers the given user
     *
     * @param registerDto
     *            new user information
     * @return message for success or failure
     */
    String register ( RegisterDto registerDto );

    /**
     * Logins in the given user
     *
     * @param loginDto
     *            username/email and password
     * @return response with authenticated user
     */
    JwtAuthResponse login ( LoginDto loginDto );

    /**
     * Deletes the given user by id
     *
     * @param id
     *            id of user to delete
     */
    // void deleteUserById ( Long id );

    /**
     * Returns a list of all the users
     *
     * @return all the recipes
     */
    List<UserDto> getAllUsers ();

    public void deleteUserById ( final Long id );

    /**
     * Edits the user with the given ID.
     *
     * @param id
     *            id of the user to edit
     * @param userDto
     *            updated user information
     * @return message indicating success or failure
     */
    // String editUserById ( Long id, RegisterDto userDto );

    // UserDto getUserById ( Long id );
    /**
     * Registers a new staff member with the provided information.
     *
     * @param registerDto
     *            contains the staff member's registration details.
     * @return a message indicating the success or failure of the registration.
     */
    String registerStaff ( RegisterDto registerDto );
    /**
     * Edits the user with the given ID.
     * Edits an existing user's information by their ID.
     *
     * @param id
     *            id of the user to edit
     *            the ID of the user to edit.
     * @param userDto
     *            updated user information
     * @return message indicating success or failure
     *            contains the updated user information.
     * @return a message indicating the success or failure of the update.
     */
    String editUserById ( final Long id, final RegisterDto userDto );
    
    /**
     * Retrieves a user's details by their ID.
     *
     * @param id
     *            the ID of the user to retrieve.
     * @return a {@link UserDto} object containing the user's details.
     */
    UserDto getUserById ( final Long id );
}
