package edu.ncsu.csc326.wolfcafe.repositories.menu;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.ncsu.csc326.wolfcafe.entity.Location;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
/**
 * Repository interface for managing menu entities.
 * This interface provides methods to perform standard CRUD operations and
 * custom queries for `Menu` entities. It is linked to the `menus` table in the
 * database.
 */

public interface MenuRepository extends JpaRepository<Menu, Location> {

    @Query ( "SELECT m FROM Menu m WHERE m.location.id = :locationId" )
    Menu findByLocationId ( @Param ( "locationId" ) Long locationId );

    @Modifying
    @Query ( value = "DELETE FROM menus", nativeQuery = true )
    void deleteAllMenus ();
}
