package edu.ncsu.csc326.wolfcafe.repositories.menu;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ncsu.csc326.wolfcafe.entity.menu.MenuRecipe;
/**
 *  Repository interface for managing MenuRecipe entities.
 *  The `MenuRecipe` entity represents the association between menus and recipes,
 * enabling dynamic updates to menu recipe
 *  
 */
public interface MenuRecipeRepository extends JpaRepository<MenuRecipe, Long> {

}
