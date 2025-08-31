package edu.ncsu.csc326.wolfcafe.repositories.inventory;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;

/**
 * InventoryRepository for working with the DB through the 
 * JpaRepository.
 */
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

}
 