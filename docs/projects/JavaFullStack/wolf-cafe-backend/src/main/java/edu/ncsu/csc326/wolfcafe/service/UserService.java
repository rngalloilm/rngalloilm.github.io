package edu.ncsu.csc326.wolfcafe.service;

import edu.ncsu.csc326.wolfcafe.entity.User;

/**
 * Interface defining the user behaviors.
 */

public interface UserService {
	/**
     * Retrieves the currently authenticated user.
     *
     * @return the authenticated {@link User}.
     */
    User fetchCurrentUser ();

}
