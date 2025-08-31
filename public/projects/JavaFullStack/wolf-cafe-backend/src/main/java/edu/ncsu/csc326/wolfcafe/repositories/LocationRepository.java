package edu.ncsu.csc326.wolfcafe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import edu.ncsu.csc326.wolfcafe.entity.Location;

/**
 * IngredientRepository for working with the DB through the JpaRepository.
 */
public interface LocationRepository extends JpaRepository<Location, Long> {
    /**
     * Deletes all records from the `locations` table in the database.
     */
	@Modifying
    @Query ( value = "DELETE FROM locations", nativeQuery = true )
    void deleteAllLocations ();
}
