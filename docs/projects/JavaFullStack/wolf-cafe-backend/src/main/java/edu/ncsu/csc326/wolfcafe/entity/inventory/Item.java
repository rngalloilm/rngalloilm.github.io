package edu.ncsu.csc326.wolfcafe.entity.inventory;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents an item for sale in the WolfCafe.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table ( name = "items" )
public class Item implements Serializable {
	 /** Serialization version UID for ensuring compatibility. */
    private static final long serialVersionUID = 1L;
    /** Unique identifier for the item. */
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long              id;
    /** Name of the item. This must be unique and is required. */
    @Column ( nullable = false, unique = true )
    private String            name;
    /** Optional description providing details about the item. */
    private String            description;
    /** Price of the item. This value is required. */
    @Column ( nullable = false )
    private double            price;

}
