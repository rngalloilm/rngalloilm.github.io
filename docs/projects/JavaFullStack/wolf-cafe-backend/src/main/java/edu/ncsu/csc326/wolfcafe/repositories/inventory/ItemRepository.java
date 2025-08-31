package edu.ncsu.csc326.wolfcafe.repositories.inventory;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;

/**
 * Repository interface for Items.
 */
public interface ItemRepository extends JpaRepository<Item, Long> {
}
