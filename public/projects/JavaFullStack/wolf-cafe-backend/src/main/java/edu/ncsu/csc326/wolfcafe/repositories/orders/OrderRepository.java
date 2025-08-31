package edu.ncsu.csc326.wolfcafe.repositories.orders;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.entity.orders.Order;

/**
 * 
 * Repository interface for managing {@link Order} entities.
 * This interface provides methods for performing standard CRUD operations and
 * custom queries for `Order` entities. It is linked to the `orders` table in
 * the database.
 * 
 * The `Order` entity represents a customer's order at a specific location and
 * contains details about the ordered items or recipes.
 * 
 * 
 */
public interface OrderRepository extends JpaRepository<Order, Long> {
    /** Deletes all orders associated with a specific location ID. */
	@Modifying
    @Transactional
    @Query ( "DELETE FROM Order o WHERE o.location.id = :locationId" )
    void deleteByLocationId ( @Param ( "locationId" ) Long locationId );
	/**  Retrieves all orders along with their associated ordered items.*/
    @EntityGraph ( attributePaths = "orderedItems" )
    @Query ( "SELECT o FROM Order o" )
    List<Order> findAllWithOrderedItems ();
}
