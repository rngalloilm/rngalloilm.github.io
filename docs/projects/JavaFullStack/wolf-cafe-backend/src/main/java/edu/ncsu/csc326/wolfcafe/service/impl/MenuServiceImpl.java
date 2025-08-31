package edu.ncsu.csc326.wolfcafe.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ncsu.csc326.wolfcafe.dto.menu.MenuDto;
import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Recipe;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import edu.ncsu.csc326.wolfcafe.entity.menu.MenuItem;
import edu.ncsu.csc326.wolfcafe.entity.menu.MenuRecipe;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.repositories.LocationRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuItemRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRecipeRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRepository;
import edu.ncsu.csc326.wolfcafe.service.MenuService;
import jakarta.transaction.Transactional;
/**
 * service for the menu
 */
@Service
public class MenuServiceImpl implements MenuService {
	/** Mapper for converting between DTOs and entities. */
    private final ModelMapper    modelMapper = new ModelMapper();
    /** Repository for accessing menu data. */
    @Autowired
    private MenuRepository       menuRepository;
    /** Repository for accessing location data. */
    @Autowired
    private LocationRepository   locationRepository;
    /** Repository for accessing menu recipe data. */
    @Autowired
    private MenuRecipeRepository menuRecipeRepository;
    /** Repository for accessing menu item data. */
    @Autowired
    private MenuItemRepository   menuItemRepository;
    /**
     * Retrieves the menu for a given location.
     *
     * @param locationId
     *            the ID of the location for which to fetch the menu.
     * @return the menu as a DTO.
     * @throws GeneralErrorException
     *             if the location or menu cannot be found.
     */
    @Override
    public MenuDto getMenu ( final Long locationId ) {
        final Location location = locationRepository.findById( locationId )
                .orElseThrow( () -> new GeneralErrorException( "Could not find location with ID " + locationId ) );

        final Menu menu = menuRepository.findByLocationId( location.getId() );
        if ( menu == null ) {
            throw new GeneralErrorException( "Could not find menu corresponding to location ID " + location.getId() );
        }

        final MenuDto menuDto = modelMapper.map( menu, MenuDto.class );
        return menuDto;
    }
    /**
     * Updates the menu for a given location.
     *
     * @param menuDto
     *            the updated menu data as a DTO.
     * @return the updated menu as a DTO.
     * @throws GeneralErrorException
     *             if the menu or location cannot be found or if the input is
     *             invalid.
     */
    @Transactional
    @Override
    public MenuDto updateMenuForLocation ( final MenuDto menuDto, final Long locationId ) {
        if ( menuDto == null ) {
            throw new GeneralErrorException( "Cannot submit a null menu to update" );
        }

        final Location location = locationRepository.findById( locationId )
                .orElseThrow( () -> new GeneralErrorException( "Could not find location with ID " + locationId ) );

        final Menu menu = menuRepository.findByLocationId( location.getId() );
        if ( menu == null ) {
            throw new GeneralErrorException( "Could not locate menu for location ID " + locationId );
        }

        // Clear current menu's recipe and item lists
        menu.getRecipeList().forEach( recipe -> menuRecipeRepository.delete( recipe ) );
        menu.getRecipeList().clear();

        menu.getItemList().forEach( item -> menuItemRepository.delete( item ) );
        menu.getItemList().clear();

        // Update recipes for this specific menu
        if ( menuDto.getRecipeList() != null ) {
            final List<MenuRecipe> updatedRecipes = menuDto.getRecipeList().stream().map( recipeDto -> {
                final MenuRecipe menuRecipe = new MenuRecipe();
                menuRecipe.setRecipe(
                        recipeDto.getRecipe() != null ? modelMapper.map( recipeDto.getRecipe(), Recipe.class ) : null );
                menuRecipe.setMenu( menu );
                menuRecipe.setIncluded( recipeDto.isIncluded() );
                return menuRecipe;
            } ).collect( Collectors.toList() );
            menu.getRecipeList().addAll( menuRecipeRepository.saveAll( updatedRecipes ) );
        }

        // Update items for this specific menu
        if ( menuDto.getItemList() != null ) {
            final List<MenuItem> updatedItems = menuDto.getItemList().stream().map( itemDto -> {
                final MenuItem menuItem = new MenuItem();

                // Map itemDto.getItem() to an Item entity and set it explicitly
                if ( itemDto.getItem() != null ) {
                    final Item mappedItem = modelMapper.map( itemDto.getItem(), Item.class );
                    menuItem.setItem( mappedItem );
                }
                else {
                    menuItem.setItem( null ); // Explicitly set null if
                                              // itemDto.getItem() is null
                }

                menuItem.setMenu( menu );
                menuItem.setIncluded( itemDto.isIncluded() );
                return menuItem;
            } ).collect( Collectors.toList() );
            menu.getItemList().addAll( menuItemRepository.saveAll( updatedItems ) );
        }

        // Save the menu and return updated DTO
        menuRepository.save( menu );
        return modelMapper.map( menu, MenuDto.class );
    }
}

