package edu.ncsu.csc326.wolfcafe.repositories.inventory;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;

/**
 * IngredientRepository for working with the DB through the JpaRepository.
 */
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

}
