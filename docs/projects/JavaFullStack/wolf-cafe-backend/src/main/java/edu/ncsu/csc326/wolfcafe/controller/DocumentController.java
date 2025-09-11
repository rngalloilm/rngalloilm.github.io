package edu.ncsu.csc326.wolfcafe.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;

@RestController
@CrossOrigin ( "*" )
public class DocumentController {

    // Base folder for documents relative to the project directory
    private final String DOCUMENTS_PATH = "project_docs";

    @GetMapping ( "/api/document/{category}" )
    public ResponseEntity<String> getDocument ( @PathVariable final String category ) {
        try {
            switch ( category ) {
                case "PrivacyPolicy":
                case "HumanFlourishing":
                case "UserGuide":
                case "DeveloperGuide":
                    break;
                default:
                    throw new ResourceNotFoundException( "Could not find category " + category );
            }

            // Get the absolute path
            final String projectDir = System.getProperty( "user.dir" );
            final Path parentDir = Paths.get( projectDir ).getParent(); // Navigate
                                                                        // to
                                                                        // parent
                                                                        // directory
            if ( parentDir == null ) {
                return ResponseEntity.status( HttpStatus.INTERNAL_SERVER_ERROR )
                        .body( "Parent directory could not be determined" );
            }
            final Path filePath = parentDir.resolve( Paths.get( DOCUMENTS_PATH, category + ".md" ) );

            // System.out.println(filePath);

            if ( !Files.exists( filePath ) ) {
                return ResponseEntity.status( HttpStatus.NOT_FOUND )
                        .body( "Document not found: " + filePath.toAbsolutePath() );
            }

            final String content = new String( Files.readAllBytes( filePath ) );
            return ResponseEntity.ok( content );

        }
        catch ( final IOException e ) {
            return ResponseEntity.status( HttpStatus.INTERNAL_SERVER_ERROR ).body( "Error reading document" );
        }
    }
}
