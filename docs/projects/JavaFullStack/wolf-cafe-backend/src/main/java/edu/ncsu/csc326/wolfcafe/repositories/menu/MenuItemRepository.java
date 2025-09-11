package edu.ncsu.csc326.wolfcafe.repositories.menu;

import org.springframework.data.jpa.repository.JpaRepository;
/**
 * Repository interface for managing menu item entities.
 *  Provides methods for standard CRUD operations on the `menu_items` table in
 * the database. This interface extends {@link JpaRepository}, allowing seamless
 * integration with Spring Data JPA for handling `MenuItem` entities.
 
 */

import edu.ncsu.csc326.wolfcafe.entity.menu.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

}
