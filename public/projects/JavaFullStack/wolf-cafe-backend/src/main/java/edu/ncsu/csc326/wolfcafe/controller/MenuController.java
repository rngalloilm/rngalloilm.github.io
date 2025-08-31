package edu.ncsu.csc326.wolfcafe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ncsu.csc326.wolfcafe.dto.menu.MenuDto;
import edu.ncsu.csc326.wolfcafe.service.MenuService;

/**
 * Controller for Menu.
 */
@CrossOrigin ( "*" )
@RestController
@RequestMapping ( "/api/menu" )
public class MenuController {

    /** Connection to MenuService */
    @Autowired
    private MenuService menuService;
    /**
     * returns the menu with the given id 
     * @param locationId
     * @return menu item 
     */
    @GetMapping ( "{id}" )
    public MenuDto getMenu ( @PathVariable ( "id" ) final Long locationId ) {
        return menuService.getMenu( locationId );
    }

  /**
     * update the menu 
     * @param the MenuDto object containing the updated menu details.
     * @return the updated menuDto object 
     */
    @PreAuthorize ( "hasAnyRole('STAFF', 'ADMIN')" )
    @PutMapping ( "{id}" )
    public MenuDto updateMenuForLocation ( @PathVariable ( "id" ) final Long locationId,
            @RequestBody final MenuDto menuDto ) {
        menuService.updateMenuForLocation( menuDto, locationId );
        return menuService.getMenu( locationId );

    }
}
