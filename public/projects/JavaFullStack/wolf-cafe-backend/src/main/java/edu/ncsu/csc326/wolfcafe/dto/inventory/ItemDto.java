package edu.ncsu.csc326.wolfcafe.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Item for data transfer.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemDto {
	/**
     * The unique identifier for the item.
     */
    private Long id;
    /**
     * The name of the item.
     */
    private String name;
    /**
     * A brief description of the item.
     */
    private String description;
    /**
     * The price of the item.
     */
    private double price;
}
