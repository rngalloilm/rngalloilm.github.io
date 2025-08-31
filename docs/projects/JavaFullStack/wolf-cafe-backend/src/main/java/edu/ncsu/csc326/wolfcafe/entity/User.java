package edu.ncsu.csc326.wolfcafe.entity;

import java.util.Collection;
import java.util.List;

import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * System user.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table ( name = "users" )
public class User {
	/**
     * The unique identifier for the user.
     */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long             id;

    /**
     * The full name of the user.
     */
    private String           name;
    @Column ( nullable = false, unique = true )
    /**
     * The unique username for the user.
     */
    private String           username;
    /**
     * The unique email address for the user.
     */
    @Column ( nullable = false, unique = true )
    
    private String           email;
    /**
     * The password for the user account (hashed for security purposes).
     */
    @Column ( nullable = false )
    
    private String           password;
    /**
     * The roles associated with the user, determining access and permissions in
     * the system (e.g., "ROLE_ADMIN", "ROLE_CUSTOMER").
     */
    @ManyToMany ( fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE } )
    @JoinTable ( name = "users_roles", joinColumns = @JoinColumn ( name = "user_id", referencedColumnName = "id" ),
            inverseJoinColumns = @JoinColumn ( name = "role_id", referencedColumnName = "id" ) )
    private Collection<Role> roles;

    /**
     * The orders placed by the user. A user can have multiple orders, and
     * removing a user also removes their associated orders.
     */
    @OneToMany ( mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true )
    private List<Order>      orders;

    /**
     * The location associated with the user. This may represent the user's
     * preferred location for placing orders or their assigned workplace (for
     * staff users).
     */
    @ManyToOne ( fetch = FetchType.LAZY )
    @JoinColumn ( name = "location_id", nullable = true )
    private Location         location;

}
