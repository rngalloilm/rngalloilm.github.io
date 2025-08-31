package edu.ncsu.csc326.wolfcafe;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
/**
* Utility class for performing database cleanup operations.
*/
@Component
public class DatabaseCleanupUtil {
	//injects EnitityMangager to interact with the database
    @PersistenceContext
    private EntityManager entityManager;
    /**
     * truncate all the tables in database
     */
    @Transactional
    public void truncateAllTables () {
        // Disable foreign key checks
        entityManager.createNativeQuery( "SET FOREIGN_KEY_CHECKS = 0" ).executeUpdate();

        // Fetch all table names
        final List<String> tables = entityManager.createNativeQuery( "SHOW TABLES" ).getResultList();

        // Truncate each table
        for ( final String table : tables ) {
            if ( !table.equals( "roles" ) ) {
                entityManager.createNativeQuery( "TRUNCATE TABLE " + table ).executeUpdate();
            }
        }

        // Re-enable foreign key checks
        entityManager.createNativeQuery( "SET FOREIGN_KEY_CHECKS = 1" ).executeUpdate();
    }
}
