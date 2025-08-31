package edu.ncsu.csc326.wolfcafe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Information needed to register a new customer.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
	 /**
     * The full name of the customer registering.
     */
    private String name;
    /**
     * The username chosen by the customer for their account.
     */
    private String username;
    /**
     * The email address provided by the customer for registration.
     */
    private String email;
    /**
     * The password chosen by the customer for their account.
     */
    private String password;
    /**
     * The ID of the location associated with the customer, if applicable.
     */
    private Long   locationId;
}
