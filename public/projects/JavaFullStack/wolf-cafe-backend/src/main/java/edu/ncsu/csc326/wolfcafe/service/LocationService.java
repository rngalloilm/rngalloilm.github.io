package edu.ncsu.csc326.wolfcafe.service;

import java.util.List;

import edu.ncsu.csc326.wolfcafe.dto.LocationDto;

/**
 * Creates a new location.
 *
 * @param dto
 *            the details of the location to be created.
 * @return the created location 
 */
public interface LocationService {
	/**
     * Creates a new location.
     *
     * @param dto
     *            the details of the location to be created.
     * @return the created location as a {@link LocationDto}.
     */
    LocationDto createLocation ( LocationDto dto );
    /**
     * Deletes a location by its ID.
     *
     * @param locationId
     *            the ID of the location to be deleted.
     */
    void deleteLocation ( long locationId );
    /**
     * Retrieves a specific location by its ID.
     *
     * @param locationId
     *            the ID of the location to retrieve.
     * @return the details of the location as a {@link LocationDto}.
     */
    LocationDto getLocation ( long locationId );

    /**
     * Retrieves all locations.
     *
     * @return a list of all locations as {@link LocationDto}.
     */
    List<LocationDto> getAllLocations ();
    /**
     * Sets the tax rate for a specific location.
     *
     * @param locationId
     *            the ID of the location to update.
     * @param taxRate
     *            the new tax rate to be set.
     */
    void setLocationTax ( long locationId, double taxRate );
}
