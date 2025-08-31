package edu.ncsu.csc326.wolfcafe.dto;

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
public class RoleDto {
	/**
     * The unique identifier for the role.
     */
    private Long   id;
    /**
     * The name of the role (e.g., "ADMIN", "STAFF", "CUSTOMER").
     */
    private String name;

}
