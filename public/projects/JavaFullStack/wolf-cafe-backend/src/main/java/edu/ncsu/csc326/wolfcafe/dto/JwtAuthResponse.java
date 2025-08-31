package edu.ncsu.csc326.wolfcafe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response for authenticated and authorized user.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
	 /**
     * The JWT access token issued to the user after authentication.
     */
    private String      accessToken;
    /**
     * The type of token being used, defaulting to "Bearer".
     */
    private String      tokenType = "Bearer";
    /**
     * The role of the authenticated user (e.g., ADMIN, STAFF, CUSTOMER).
     */
    private String      role;
    /**
     * The location associated with the user, if applicable.
     */
    private LocationDto location;

}
