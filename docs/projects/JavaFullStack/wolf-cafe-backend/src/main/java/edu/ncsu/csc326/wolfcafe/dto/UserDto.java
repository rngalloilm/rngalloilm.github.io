package edu.ncsu.csc326.wolfcafe.dto;

import java.util.Collection;
import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.orders.OrderDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Information to login a user.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
	/**
    * The unique identifier for the user.
    */
    private Long        id;
    /**
     * The full name of the user.
     */
    private String      name;
    /**
     * The username chosen by the user.
     */
    private String      username;
    /**
     * The email address of the user.
     */
    private String      email;
   /**
    * The password of the user. This field may not always be included in
    * responses for security reasons.
    */
    private String      password;
    /**
     * The collection of roles assigned to the user (e.g., "ADMIN", "STAFF",
     * "CUSTOMER").
     */
    Collection<RoleDto> roles;
    /**
     * The list of orders associated with the user.
     */
    List<OrderDto>      orders;
    /**
     * The location associated with the user, if applicable.
     */
    LocationDto         location;

}
