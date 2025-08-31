package edu.ncsu.csc326.wolfcafe.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.repositories.UserRepository;
import edu.ncsu.csc326.wolfcafe.service.UserService;
/**
 * Implementation of the UserService interface for user-related operations.
 */
@Service
public class UserServiceImpl implements UserService {
	/** Repository for accessing user data. */
    @Autowired
    private UserRepository userRepository;
    /**
     * Fetches the currently authenticated user from the security context.
     *
     * @return the current user as a User entity.
     * @throws GeneralErrorException
     *             if the user cannot be found in the repository.
     */
    @Override
    public User fetchCurrentUser () {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final User user = userRepository.findByUsername( userDetails.getUsername() )
                .orElseThrow( () -> new GeneralErrorException( "User not able to be found" ) );

        return user;
    }

}
