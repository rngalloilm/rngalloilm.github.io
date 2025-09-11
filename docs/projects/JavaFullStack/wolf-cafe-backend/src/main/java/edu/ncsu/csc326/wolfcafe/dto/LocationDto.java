package edu.ncsu.csc326.wolfcafe.dto;

import java.time.LocalTime;

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
public class LocationDto {
	/**
     * The unique identifier of the location.
     */
    private Long      id;
    /**
     * The name of the location.
     */
    private String    name;
    /**
     * The physical address of the location.
     */
    private String    address;
    /**
     * The tax rate applicable at the location.
     */
    private double    taxRate;
    /**
     * The ID of the menu associated with the location.
     */
    private Long      menuId;
    /**
     * The ID of the inventory associated with the location.
     */
    private Long      inventoryId;
    /** the closing time of the WolfCafe location */
    private LocalTime endOfDayTime;

}
