package edu.ncsu.csc326.wolfcafe.service;

import edu.ncsu.csc326.wolfcafe.dto.menu.MenuDto;
/**
 * Service interface for managing menus in the WolfCafe system.
 */
public interface MenuService {
	/**
     * Retrieves the menu for a specific location.
     *
     * @param locationId
     *            the ID of the location for which the menu is requested.
     * @return the menu details as a {@link MenuDto}.
     */
    MenuDto getMenu ( Long locationId );

  /**
    * Updates the menu for a specific location.
    *
    * @param menuDto
    *            the updated menu details.
    * @return the updated menu as a {@link MenuDto}.
    */
    MenuDto updateMenuForLocation ( MenuDto menuDto, Long locationId );


}
