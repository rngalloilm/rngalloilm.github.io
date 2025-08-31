package edu.ncsu.csc326.wolfcafe.repositories.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ncsu.csc326.wolfcafe.entity.inventory.InventoryItem;

/**
 * InventoryItemRepository for working with the DB through the JpaRepository.
 */
@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
}
