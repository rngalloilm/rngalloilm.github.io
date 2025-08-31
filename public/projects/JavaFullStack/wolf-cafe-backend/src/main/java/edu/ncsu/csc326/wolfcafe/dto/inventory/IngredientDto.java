package edu.ncsu.csc326.wolfcafe.dto.inventory;
/**
 *  POJO for ingredientDto
 */

public class IngredientDto {

    private Long   id;

    private String name;

    /**
     *  No-argument constructor for Hibernate
     */
    public IngredientDto () {
    }

    /**
     * Constructor with IngredientType (no id)
     * @param name the name of the ingredient 
     */
    public IngredientDto ( final String name ) {
        this.name = name;
    }

    /**
     *  Constructor with IngredientType and ID
     * @param id the id of the IngredientDto
     * @param name the name of the IngredientDto
     */
    public IngredientDto ( final Long id, final String name ) {
        this.id = id;
        this.name = name;
    }

    // Getters and Setters

    /**
     * Gets the ID of the entity.
     *
     * @return the ID of the entity
     */
    public Long getId () {
        return id;
    }

    /**
     * Sets the ID of the entity.
     *
     * @param id
     *            the ID to set
     */
    public void setId ( final Long id ) {
        this.id = id;
    }

    /**
     * Gets the name of the entity.
     *
     * @return the name of the entity
     */
    public String getName () {
        return name;
    }

    /**
     * Sets the name of the entity.
     *
     * @param name
     *            the name to set
     */
    public void setName ( final String name ) {
        this.name = name;
    }

}
