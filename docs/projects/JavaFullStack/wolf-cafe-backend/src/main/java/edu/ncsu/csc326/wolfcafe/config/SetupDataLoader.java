package edu.ncsu.csc326.wolfcafe.config;

import java.time.Clock;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.Role;
import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import edu.ncsu.csc326.wolfcafe.repositories.LocationRepository;
import edu.ncsu.csc326.wolfcafe.repositories.RoleRepository;
import edu.ncsu.csc326.wolfcafe.repositories.UserRepository;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderRepository;

/**
 * Sets up the database with roles and a default admin user. Also checks for
 * end-of-day operations.
 */
@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    /** True if already setup */
    private boolean            alreadySetup = false;

    /** Link to RoleRepository */
    @Autowired
    private RoleRepository     roleRepository;

    /** Link to UserRepository */
    @Autowired
    private UserRepository     userRepository;

    /** Encodes passwords */
    @Autowired
    private PasswordEncoder    passwordEncoder;

    /** Link to LocationRepository */
    @Autowired
    private LocationRepository locationRepository;

    /** Link to OrderRepository */
    @Autowired
    private OrderRepository    orderRepository;

    /** Admin password from application.properties file */
    @Value ( "${app.admin-user-password}" )
    private String             adminUserPassword;

    /** Clock to control the current time, useful for testing */
    private Clock              clock        = Clock.systemDefaultZone();

    /**
     * Setter for the clock, allows injection of a custom clock for testing.
     *
     * @param clock
     *            the clock to set
     */
    public void setClock ( final Clock clock ) {
        this.clock = clock;
    }

    /**
     * When the application context is refreshed, this method will run to create
     * roles, the admin user, and schedule the end-of-day checks.
     */
    @Override
    @Transactional
    public void onApplicationEvent ( final ContextRefreshedEvent event ) {
        if ( alreadySetup ) {
            return;
        }

        final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate( this::checkEndOfDay, 0, 10, TimeUnit.MINUTES );

        final Role adminRole = createRoleIfNotFound( Roles.ROLE_ADMIN );
        for ( final Roles.UserRoles role : Roles.UserRoles.values() ) {
            createRoleIfNotFound( role.toString() );
        }

        createUserIfNotFound( "Admin User", "admin", "admin@admin.edu", new ArrayList<>( Arrays.asList( adminRole ) ) );

        alreadySetup = true;
    }

    /**
     * Checks if it's the end of the day for each location and deletes
     * non-completed orders accordingly.
     */
    public void checkEndOfDay () {
        System.out.println( "Checking for end of day at: " + LocalTime.now( clock ) );

        final LocalTime now = LocalTime.now( clock );
        final LocalTime nowInEastern = LocalTime.now( clock.withZone( ZoneId.of( "America/New_York" ) ) );

        final LocalTime endOfDay = LocalTime.of( 23, 59, 59 );

        final List<Location> locations = locationRepository.findAll();

        for ( final Location location : locations ) {
            final LocalTime locationEndTime = location.getEndOfDayTime();

            if ( ( now.isAfter( locationEndTime ) && now.isBefore( endOfDay ) )
                    && ( nowInEastern.isAfter( locationEndTime ) && nowInEastern.isBefore( endOfDay ) ) ) {

                // Find and delete non-COMPLETED orders for the location
                final List<Order> orders = orderRepository.findAll().stream()
                        .filter( order -> order.getLocation().getId().equals( location.getId() ) )
                        .filter( order -> !"COMPLETED".equalsIgnoreCase( order.getStatus() ) )
                        .collect( Collectors.toList() );

                for ( final Order order : orders ) {
                    orderRepository.delete( order );
                }

            }
        }
    }

    /**
     * Creates the role with the given name if it doesn't exist.
     *
     * @param name
     *            role name
     * @return the created or existing role
     */
    @Transactional
    public Role createRoleIfNotFound ( final String name ) {
        Role role = roleRepository.findByName( name );
        if ( role == null ) {
            role = new Role();
            role.setName( name );
        }
        role = roleRepository.save( role );
        return role;
    }

    /**
     * Creates a user with the given information if they don't exist.
     *
     * @param name
     *            user's name
     * @param username
     *            user's username
     * @param email
     *            user's email
     * @param roles
     *            user's roles
     * @return the created or existing user
     */
    @Transactional
    private User createUserIfNotFound ( final String name, final String username, final String email,
            final Collection<Role> roles ) {
        final Optional<User> returnedUser = userRepository.findByUsernameOrEmail( username, email );

        if ( returnedUser.isEmpty() ) {
            final User user = new User();
            user.setName( name );
            user.setUsername( username );
            user.setEmail( email );
            user.setPassword( passwordEncoder.encode( adminUserPassword ) );
            user.setRoles( roles );
            userRepository.save( user );
            return user;
        }
        else {
            return returnedUser.get();
        }
    }
}
