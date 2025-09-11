package edu.ncsu.csc326.wolfcafe.dto.requests;

import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateItemRequest {
    /** The ingredient DTO associated with this request. **/
    private ItemDto itemDto;

    /**
     * The initial amount of the ingredient to be associated with this
     * ingredient in the inventory
     **/
    private int     initialAmount;

    private long    locationId;
}
