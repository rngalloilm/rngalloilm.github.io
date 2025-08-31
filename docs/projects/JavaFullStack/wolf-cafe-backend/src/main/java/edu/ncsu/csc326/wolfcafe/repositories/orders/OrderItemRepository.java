package edu.ncsu.csc326.wolfcafe.repositories.orders;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ncsu.csc326.wolfcafe.entity.orders.OrderItem;

/**
 * IngredientRepository for working with the DB through the JpaRepository.
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
