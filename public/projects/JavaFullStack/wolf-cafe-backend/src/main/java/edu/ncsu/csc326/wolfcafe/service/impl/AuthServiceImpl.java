package edu.ncsu.csc326.wolfcafe.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.ncsu.csc326.wolfcafe.dto.JwtAuthResponse;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.LoginDto;
import edu.ncsu.csc326.wolfcafe.dto.RegisterDto;
import edu.ncsu.csc326.wolfcafe.dto.UserDto;
import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.Role;
import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.exception.WolfCafeAPIException;
import edu.ncsu.csc326.wolfcafe.repositories.RoleRepository;
import edu.ncsu.csc326.wolfcafe.repositories.UserRepository;
import edu.ncsu.csc326.wolfcafe.security.JwtTokenProvider;
import edu.ncsu.csc326.wolfcafe.service.AuthService;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
import lombok.AllArgsConstructor;

/**
 * Implemented AuthService
 */
@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
	
    
    /** Repository for user data */
    private final UserRepository userRepository;
    /** Repository for role data */
    private final RoleRepository roleRepository;
    /** Password encoder to hash passwords */
    private final PasswordEncoder passwordEncoder;
    /** Authentication manager to handle authentication requests */
    private final AuthenticationManager authenticationManager;
    /** JWT token provider to create and validate JWT tokens */
    private final JwtTokenProvider jwtTokenProvider;
    /** Service to manage locations */
    private final LocationService locationService;
    /** ModelMapper instance for converting entities to DTOs */
    private final ModelMapper modelMapper = new ModelMapper();

    /**
     * Registers the given user
     *
     * @param registerDto
     *            new user information
     * @return message for success or failure
     */
    @Override
    public String register ( final RegisterDto registerDto ) {

        if ( registerDto.getName() == null || registerDto.getName().trim().isEmpty() ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Name is required." );
        }
        if ( registerDto.getUsername() == null || registerDto.getUsername().trim().isEmpty() ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Username is required." );
        }
        if ( registerDto.getEmail() == null || registerDto.getEmail().trim().isEmpty() ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Email is required." );
        }
        if ( registerDto.getPassword() == null || registerDto.getPassword().trim().isEmpty() ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Password is required." );
        }

        // Check if username or email is "admin" or "admin@admin.edu"
        if ( "admin".equalsIgnoreCase( registerDto.getUsername() )
                || "admin@admin.edu".equalsIgnoreCase( registerDto.getUsername() )
                || "admin".equalsIgnoreCase( registerDto.getEmail() )
                || "admin@admin.edu".equalsIgnoreCase( registerDto.getEmail() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST,
                    "Username or email cannot be 'admin' or 'admin@admin.edu'." );
        }

        // Check if username or email is already used
        if ( userRepository.existsByUsername( registerDto.getUsername() )
                || userRepository.existsByEmail( registerDto.getEmail() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Username or email already exists." );
        }
        // Check if password is properly formatted
        final String email = registerDto.getEmail();
        if ( email.indexOf( '.' ) == -1 || email.indexOf( '@' ) == -1 || email.indexOf( '@' ) > email.indexOf( '.' ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Email is malformed." );
        }
        // Check if username is being used as email or email as username
        if ( userRepository.existsByEmail( registerDto.getUsername() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Username cannot be the same as an email." );
        }
        if ( userRepository.existsByUsername( registerDto.getEmail() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Email cannot be the same as a username." );
        }

        final User user = new User();
        user.setName( registerDto.getName() );
        user.setUsername( registerDto.getUsername() );
        user.setEmail( registerDto.getEmail() );
        user.setPassword( passwordEncoder.encode( registerDto.getPassword() ) );

        final Set<Role> roles = new HashSet<>();
        final Role userRole = roleRepository.findByName( "ROLE_CUSTOMER" );
        roles.add( userRole );

        user.setRoles( roles );
        user.setOrders( new ArrayList<>() ); // instantiate orders properly so
                                             // it can be used later

        userRepository.save( user );

        return "User registered successfully.";
    }

    /**
     * Logins in the given user
     *
     * @param loginDto
     *            username/email and password
     * @return response with authenticated user
     */
    @Override
    public JwtAuthResponse login ( final LoginDto loginDto ) {
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken( loginDto.getUsernameOrEmail(), loginDto.getPassword() ) );

        SecurityContextHolder.getContext().setAuthentication( authentication );

        final String token = jwtTokenProvider.generateToken( authentication );

        final Optional<User> userOptional = userRepository.findByUsernameOrEmail( loginDto.getUsernameOrEmail(),
                loginDto.getUsernameOrEmail() );

        String role = null;
        Long locationId = null;
        if ( userOptional.isPresent() ) {
            final User loggedInUser = userOptional.get();
            final Optional<Role> optionalRole = loggedInUser.getRoles().stream().findFirst();

            if ( optionalRole.isPresent() ) {
                final Role userRole = optionalRole.get();
                role = userRole.getName();
            }

            locationId = loggedInUser.getLocation() != null ? loggedInUser.getLocation().getId() : -1;
        }

        final JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setRole( role );
        jwtAuthResponse.setLocation(
                locationId != null && locationId != -1 ? locationService.getLocation( locationId ) : null );
        jwtAuthResponse.setAccessToken( token );

        return jwtAuthResponse;
    }

    //
    // /**
    // * Deletes the given user by id
    // *
    // * @param id
    // * id of user to delete
    // */
    @Override
    public void deleteUserById ( final Long id ) {
        userRepository.findById( id )
                .orElseThrow( () -> new ResourceNotFoundException( "User not found with id " + id ) );
        userRepository.deleteById( id );
    }

    //
    @Override
    public List<UserDto> getAllUsers () {
        final List<User> users = userRepository.findAll();
        return users.stream().map( user -> modelMapper.map( user, UserDto.class ) ).collect( Collectors.toList() );
    }

    @Override
    public UserDto getUserById ( final Long id ) {
        final User user = userRepository.findById( id )
                .orElseThrow( () -> new ResourceNotFoundException( "User not found with id " + id ) );
        return modelMapper.map( user, UserDto.class );
    }

    /**
     * Edits the given user by id
     *
     * @param id
     *            id of user to edit
     */
    @Override
    public String editUserById ( final Long id, final RegisterDto userDto ) {
        // Fetch the existing user
        final User user = userRepository.findById( id )
                .orElseThrow( () -> new ResourceNotFoundException( "User not found with id " + id ) );

        // Check for duplicates - username
        if ( !user.getUsername().equals( userDto.getUsername() )
                && userRepository.existsByUsername( userDto.getUsername() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Username already exists." );
        }

        // Check for duplicates - email
        if ( !user.getEmail().equals( userDto.getEmail() ) && userRepository.existsByEmail( userDto.getEmail() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Email already exists." );
        }

        // Update user fields
        user.setName( userDto.getName() );
        user.setUsername( userDto.getUsername() );
        user.setEmail( userDto.getEmail() );

        // Handle password update if provided
        if ( userDto.getPassword() != null && !userDto.getPassword().isEmpty() ) {
            user.setPassword( passwordEncoder.encode( userDto.getPassword() ) );
        }

        // Save the updated user
        userRepository.save( user );

        return "User updated successfully.";
    }
    /**
     * Registers a new user in the system with provided information.
     * 
     * Validates the input data and checks for conflicts (e.g., username or email already exists).
     * Assigns a default "ROLE_CUSTOMER" role and saves the new user to the database.
     * 
     * @param registerDto contains the user's registration data
     * @return a success message upon successful registration
     */
    @Override
    public String registerStaff ( final RegisterDto registerDto ) {

        if ( registerDto.getName() == null || registerDto.getName().trim().isEmpty() ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Name is required." );
        }
        if ( registerDto.getUsername() == null || registerDto.getUsername().trim().isEmpty() ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Username is required." );
        }
        if ( registerDto.getEmail() == null || registerDto.getEmail().trim().isEmpty() ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Email is required." );
        }
        if ( registerDto.getPassword() == null || registerDto.getPassword().trim().isEmpty() ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Password is required." );
        }

        if ( registerDto.getLocationId() == null ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "A location is required." );
        }

        final LocationDto location = locationService.getLocation( registerDto.getLocationId() );

        // Check if username or email is "admin" or "admin@admin.edu"
        if ( "admin".equalsIgnoreCase( registerDto.getUsername() )
                || "admin@admin.edu".equalsIgnoreCase( registerDto.getUsername() )
                || "admin".equalsIgnoreCase( registerDto.getEmail() )
                || "admin@admin.edu".equalsIgnoreCase( registerDto.getEmail() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST,
                    "Username or email cannot be 'admin' or 'admin@admin.edu'." );
        }

        // Check if username or email is already used
        if ( userRepository.existsByUsername( registerDto.getUsername() )
                || userRepository.existsByEmail( registerDto.getEmail() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Username or email already exists." );
        }

        // Check if username is being used as email or email as username
        if ( userRepository.existsByEmail( registerDto.getUsername() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Username cannot be the same as an email." );
        }
        if ( userRepository.existsByUsername( registerDto.getEmail() ) ) {
            throw new WolfCafeAPIException( HttpStatus.BAD_REQUEST, "Email cannot be the same as a username." );
        }

        final User user = new User();
        user.setName( registerDto.getName() );
        user.setUsername( registerDto.getUsername() );
        user.setEmail( registerDto.getEmail() );
        user.setPassword( passwordEncoder.encode( registerDto.getPassword() ) );

        final Location newLocation = modelMapper.map( location, Location.class );
        user.setLocation( newLocation );

        final Set<Role> roles = new HashSet<>();
        final Role staffRole = roleRepository.findByName( "ROLE_STAFF" );
        roles.add( staffRole );

        user.setRoles( roles );
        user.setOrders( new ArrayList<>() ); // instantiate orders properly so
                                             // it can be used later

        userRepository.save( user );

        return "Staff registered successfully.";
    }

}
