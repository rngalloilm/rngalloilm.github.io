package edu.ncsu.csc326.wolfcafe.entity.inventory;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * POJO class for Ingredients(the Ingredients) are arbitary
 */

@Entity
public class Ingredient implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    /**
     * default constructor
     */
    public Ingredient () {
        // default constructor
    }

    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY )
    private Long   id;
    /**
     * ingredient name
     */
    private String name;

    /**
     * Constructor that takes the name attribute of Ingredient
     *
     * @param name
     *            the name of the ingredient
     */
    public Ingredient ( final String name ) {
        this.name = name;
    }

    /**
     * getter for id attribute of ingredient
     *
     * @return the id of the ingredient
     */
    public Long getId () {
        return id;
    }

    /**
     * setter for the id attribute of ingredient
     *
     * @param id
     *            the id of ingredient
     */
    public void setId ( final Long id ) {
        this.id = id;
    }

    /**
     * getter for the ingredient name
     *
     * @return the name of the ingredient as String
     */
    public String getName () {
        return name;
    }

    /**
     * setter for name field of ingredient
     *
     * @param name
     *            the name of ingredient
     */
    public void setName ( final String name ) {
        this.name = name;
    }

}
