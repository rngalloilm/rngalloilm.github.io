package edu.ncsu.csc326.wolfcafe.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.menu.MenuDto;
import edu.ncsu.csc326.wolfcafe.dto.menu.MenuItemDto;
import edu.ncsu.csc326.wolfcafe.dto.menu.MenuRecipeDto;
import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import edu.ncsu.csc326.wolfcafe.entity.menu.MenuItem;
import edu.ncsu.csc326.wolfcafe.entity.menu.MenuRecipe;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.repositories.LocationRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRepository;
import edu.ncsu.csc326.wolfcafe.service.MenuService;
//unit test cases for menuService 
@SpringBootTest
class MenuServiceTest {

    @Autowired
    private MenuService         menuService; // Service being tested 

    @MockBean
    private MenuRepository      menuRepository; // Mocked repository for Menu

    @MockBean
    private LocationRepository  locationRepository; // Mocked repository for Location

    @Autowired
    private DatabaseCleanupUtil databaseCleanupUtil; // Utility to clean up the database
    /**
     * cleaning up the database for unit tests
     */
    @BeforeEach
    void setUp () {
        databaseCleanupUtil.truncateAllTables();
    }
    /**
     * Test case where service class gets an existing menu for a location.
     */
    @Test
    void testGetMenuExisting () {
        final Location location = new Location( 1L, "Test Location", "123 Test St", 7.5, null, new Inventory(),
                LocalTime.of( 18, 0 ) );
        final Menu menu = new Menu( 1L, location, new ArrayList<>(), new ArrayList<>() );
        location.setMenu( menu );

        // Mock behavior
        when( locationRepository.findById( anyLong() ) ).thenReturn( Optional.of( location ) );
        when( menuRepository.findByLocationId( anyLong() ) ).thenReturn( menu );

        final MenuDto retrievedMenu = menuService.getMenu( location.getId() );
        assertNotNull( retrievedMenu );
        assertEquals( location.getId(), retrievedMenu.getLocation().getId() );
        verify( locationRepository, times( 1 ) ).findById( anyLong() );
    }
    /**
     * Test case where service class updates an existing menu for a location.
     */
    @Test
    void testUpdateMenu () {
        final ArrayList<MenuItemDto> menuItemsDto = new ArrayList<>();
        final ArrayList<MenuRecipeDto> menuRecipesDto = new ArrayList<>();
        final ArrayList<MenuItem> menuItems = new ArrayList<>();
        final ArrayList<MenuRecipe> menuRecipes = new ArrayList<>();

        final Location location = new Location( 1L, "Test Location", "123 Test St", 7.5, null, new Inventory(),
                LocalTime.of( 18, 0 ) );
        final Menu menuEntityPrior = new Menu( 1L, location, menuRecipes, menuItems );
        location.setMenu( menuEntityPrior );

        final MenuDto menuDto = new MenuDto( new LocationDto( location.getId(), location.getName(),
                location.getAddress(), location.getTaxRate(), null, null, LocalTime.of( 18, 0 ) ), menuRecipesDto,
                menuItemsDto );

        // Mock behavior
        when( locationRepository.findById( anyLong() ) ).thenReturn( Optional.of( location ) );
        when( menuRepository.findByLocationId( anyLong() ) ).thenReturn( menuEntityPrior );
        when( menuRepository.save( any( Menu.class ) ) ).thenReturn( menuEntityPrior );

        final MenuDto updatedMenu = menuService.updateMenuForLocation( menuDto, location.getId() );
        assertNotNull( updatedMenu );
        assertEquals( location.getId(), updatedMenu.getLocation().getId() );
        verify( menuRepository, times( 1 ) ).save( any( Menu.class ) );
    }
    /**
     *  Test case where service class updates an existing menu for a location with null values
     * should throw an exception 
     * @throws GeneralErrorException cannot submit a null menu or location values 
     */
    @Test
    void testUpdateMenuWithNullValues () {
        final GeneralErrorException exception = assertThrows( GeneralErrorException.class,
                () -> menuService.updateMenuForLocation( null, null ) );
        assertEquals( "Cannot submit a null menu to update", exception.getMessage() );
    }
    /**
     * test cases where service should throw an exception when trying to update a menu with null values.
     * @throws GeneralErrorException when trying to update a menu with null values 
     */
    @Test
    void testGetMenuForNonExistingLocation () {
        // Mock behavior
        when( locationRepository.findById( anyLong() ) ).thenReturn( Optional.empty() );

        final Long nonExistingLocationId = 999L;
        final GeneralErrorException exception = assertThrows( GeneralErrorException.class,
                () -> menuService.getMenu( nonExistingLocationId ) );
        assertTrue( exception.getMessage().contains( "Could not find location with ID" ) );
    }
}
