package edu.ncsu.csc326.wolfcafe.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.LocationRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.InventoryRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRepository;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
import jakarta.transaction.Transactional;

/**
 * Implementation of the IngredientService interface.
 */
@Service
public class LocationServiceImpl implements LocationService {
    /**
     * default constructor
     */
    public LocationServiceImpl () {
        // default constructor
    }

    /** Autowire the ingredient repository **/
    @Autowired
    private LocationRepository  locationRepository;
    /** Repository for accessing menu data. */
	 @Autowired
    private MenuRepository      menuRepository;
	 /** Repository for accessing inventory data. */
    @Autowired
    private InventoryRepository inventoryRepository;
    /** Mapper for converting between DTOs and entities. */
    private final ModelMapper   modelMapper = new ModelMapper();
    /**
     * Creates a new location with associated menu and inventory.
     *
     * @param locationDto
     *            the data transfer object containing location details.
     * @return the newly created location as a DTO.
     */
    @Transactional
    @Override
    public LocationDto createLocation ( final LocationDto locationDto ) {
        Location location = modelMapper.map( locationDto, Location.class );

        Menu menu = new Menu();
        menu.setItemList( new ArrayList<>() );
        menu.setRecipeList( new ArrayList<>() );

        // Persist the Menu first
        menu = menuRepository.save( menu );

        location.setMenu( menu );
        menu.setLocation( location );

        Inventory inventory = new Inventory();
        inventory.setInventoryItems( new ArrayList<>() );

        inventory = inventoryRepository.save( inventory );

        location.setInventory( inventory );

        location = locationRepository.save( location );
        menuRepository.save( menu );

        return modelMapper.map( location, LocationDto.class );
    }
    /**
     * Deletes a location by its ID.
     *
     * @param locationId
     *            the ID of the location to delete.
     * @throws ResourceNotFoundException
     *             if the location does not exist.
     */
    @Override
    public void deleteLocation ( final long locationId ) {
        final Location foundLocation = locationRepository.findById( locationId )
                .orElseThrow( () -> new ResourceNotFoundException( "Location does not exist with id " + locationId ) );

        locationRepository.delete( foundLocation );
    }
    /**
     * Updates the tax rate for a specific location.
     *
     * @param locationId
     *            the ID of the location to update.
     * @param taxRate
     *            the new tax rate for the location.
     * @throws ResourceNotFoundException
     *             if the location does not exist.
     */
    @Override
    public void setLocationTax ( final long locationId, final double taxRate ) {
        final Location foundLocation = locationRepository.findById( locationId )
                .orElseThrow( () -> new ResourceNotFoundException( "Location does not exist with id " + locationId ) );

        foundLocation.setTaxRate( taxRate );
        locationRepository.save( foundLocation );
    }
    /**
     * Retrieves a location by its ID.
     *
     * @param locationId
     *            the ID of the location to retrieve.
     * @return the location details as a DTO.
     * @throws ResourceNotFoundException
     *             if the location does not exist.
     */
    @Override
    public LocationDto getLocation ( final long locationId ) {
        final Location foundLocation = locationRepository.findById( locationId )
                .orElseThrow( () -> new ResourceNotFoundException( "Location does not exist with id " + locationId ) );
        return modelMapper.map( foundLocation, LocationDto.class );
    }
    /**
     * Retrieves all locations in the system.
     *
     * @return a list of all locations as DTOs.
     */
    @Override
    public List<LocationDto> getAllLocations () {
        final List<LocationDto> convertedDtoLocations = new ArrayList<>();
        for ( final Location locationEntity : locationRepository.findAll() ) {
            convertedDtoLocations.add( modelMapper.map( locationEntity, LocationDto.class ) );
        }

        return convertedDtoLocations;
    }

}
