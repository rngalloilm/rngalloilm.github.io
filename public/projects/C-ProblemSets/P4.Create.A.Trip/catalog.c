/**
 * @file catalog.c
 * @author Nick Gallo (rngallo)
*/

#include "catalog.h"
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include <string.h>
#include <math.h>
#include "input.h"

/** Multiplier for converting degrees to radians. */
#define DEG_TO_RAD ( M_PI / 180 )

/** Radius of the Earth. */
#define EARTH_RADIUS 3959

/** Expected number of arguments on the first line of a park file. */
#define LINE_ONE_NUM_ARGS 4

/**
 * Helper function to resize the parks array if necessary.
 * @param catalog Catalog of all Parks.
*/
static void ensureCapacity( Catalog *catalog ) {
  if ( catalog->count >= catalog->capacity ) {
    catalog->capacity *= 2;
    catalog->parks = ( Park ** )realloc( catalog->parks, catalog->capacity * sizeof( Park * ) );

    if ( !catalog->parks ) {
      perror( "Failed to resize parks array" );
      exit( EXIT_FAILURE );
    }
  }
}

Catalog *makeCatalog() {
  // Allocate memory for the catalog.
  Catalog *newCatalog = ( Catalog * )malloc( sizeof( Catalog ) );

  // Check if catalog allocated.
  if ( newCatalog == NULL ) {
    return NULL;
  }

  // Initialize the fields of the catalog.
  newCatalog->count = 0;
  newCatalog->capacity = 5;
  newCatalog->parks = ( Park ** )malloc( newCatalog->capacity * sizeof( Park * ) );

  // Check if 2D parks array allocated.
  if ( newCatalog->parks == NULL ) {
    free( newCatalog );
    return NULL;
  }

  return newCatalog;
}

double distance( Park const *a, Park const *b ) {
  // Get latitude and longitude in radians.
  double lat1 = a->latitude * DEG_TO_RAD;
  double lon1 = a->longitude * DEG_TO_RAD;
  double lat2 = b->latitude * DEG_TO_RAD;
  double lon2 = b->longitude * DEG_TO_RAD;

  // Convert the locations to vectors.
  double v1[] = { cos( lon1 ) * cos( lat1 ),
                  sin( lon1 ) * cos( lat1 ),
                  sin( lat1 ) };
  double v2[] = { cos( lon2 ) * cos( lat2 ),
                  sin( lon2 ) * cos( lat2 ),
                  sin( lat2 ) };

  // Dot product these two vectors.
  double dp = 0.0;
  for ( int i = 0; i < 3; i++ ) {
    dp += v1[ i ] * v2[ i ];
  }
  
  // Clamp the dot product value to avoid precision errors.
  dp = fmax( -1.0, fmin( 1.0, dp ) );

  // Compute the angle between the vectors based on the dot product.
  double angle = acos( dp );

  // Return distance based on the radius of the Earth.
  return EARTH_RADIUS * angle;
}

void freeCatalog( Catalog *catalog ) {
  // Free each Park pointed to by the pointers in the parks array.
  for ( int i = 0; i < catalog->count; i++ ) {
    free( catalog->parks[ i ] );
  }

  // Free the array of pointers itself.
  free( catalog->parks );

  // Finally, free the Catalog struct.
  free( catalog );
}

void readParks( char const *filename, Catalog *catalog ) {
  // Open the file.
  FILE *fp = fopen( filename, "r" );

  // Check if the file opened.
  if ( !fp ) {
    fprintf( stderr, "Can't open file: %s\n", filename );
    exit( EXIT_FAILURE );
  }

  // Iterate through the pairs of lines.
  Park temp;
  int scanResult;
  // Scan the upper line for the ID, lat, long, and first county.
  while ( ( scanResult = fscanf( fp, "%d %lf %lf %12s", &temp.id, &temp.latitude, &temp.longitude, temp.counties[ 0 ] ) ) == LINE_ONE_NUM_ARGS ) {
    temp.numCounties = 1;
    
    // Read additional county names if present.
    int ch;
    while ( temp.numCounties < MAX_COUNTY ) {
      // Peek at the next character without removing it from the stream.
      ch = fgetc( fp );

      // Skip whitespace but stop at a newline or EOF.
      while ( isspace( ch ) && ch != '\n' && ch != EOF ) {
        // Get the next character since we don't care about spaces here.
        ch = fgetc( fp );
      }

      // If it's a newline or EOF, stop reading counties.
      if ( ch == '\n' || ch == EOF ) {
        break;
      }
      
      // If the character is not a newline or space, put it back into the stream to read the next county.
      else {
        ungetc( ch, fp );
      }

      if ( fscanf( fp, "%12s", temp.counties[ temp.numCounties ] ) == 1 ) {
        // Check the length of the county name.
        if ( strlen( temp.counties[ temp.numCounties ] ) > COUNTY_NAME ) {
          fprintf( stderr, "Invalid park file: %s\n", filename );
          fclose( fp );
          exit( EXIT_FAILURE );
        }

        temp.numCounties++;
      }
      
      else {
        // If we can't read a county name, it's probably an error in the file format.
        fprintf( stderr, "Invalid park file: %s\n", filename );
        fclose( fp );
        exit( EXIT_FAILURE );
      }
    }

    // Check for a number of one to five counties.
    if ( temp.numCounties < 1 || temp.numCounties > MAX_COUNTY ) {
      fprintf( stderr, "Invalid park file: %s\n", filename );
      fclose( fp );
      exit( EXIT_FAILURE );
    }

    // Read the park name.
    if ( !fgets( temp.name, sizeof( temp.name ), fp ) ) {
      fprintf( stderr, "Invalid park file: %s\n", filename );
      fclose( fp );
      exit( EXIT_FAILURE );
    }

    // Check for duplicate IDs.
    for ( int i = 0; i < catalog->count; i++ ) {
      if ( catalog->parks[ i ]->id == temp.id ) {
        fprintf( stderr, "Invalid park file: %s\n", filename );
        fclose( fp );
        exit( EXIT_FAILURE );
      }
    }

    // Remove trailing newline from park name if present.
    size_t len = strlen( temp.name );
    if ( len > 0 && temp.name[ len - 1 ] == '\n' ) {
      temp.name[ len - 1 ] = '\0';
    }

    // Check for park name length.
    if ( strlen( temp.name ) > PARK_NAME ) {
      fprintf( stderr, "Invalid park file: %s\n", filename );
      fclose( fp );
      exit( EXIT_FAILURE );
    }

    // Allocate and copy park data.
    ensureCapacity( catalog );
    catalog->parks[ catalog->count ] = ( Park * )malloc( sizeof( Park ) );

    if ( !catalog->parks[ catalog->count ] ) {
      perror( "Failed to allocate memory for Park" );
      fclose( fp );
      exit( EXIT_FAILURE );
    }

    // Assign the park to the catalog.
    *( catalog->parks[ catalog->count ] ) = temp;
    catalog->count++;
  }

  // If the result of fscanf is not EOF and it's less than 4, it means there's an error in file formatting.
  if ( scanResult != EOF && scanResult < LINE_ONE_NUM_ARGS ) {
    fprintf( stderr, "Invalid park file: %s\n", filename );
    fclose( fp );
    exit( EXIT_FAILURE );
  }

  fclose( fp );
}

void sortParks( Catalog *catalog, int ( * compare ) ( void const *va, void const *vb ) ) {
  qsort( catalog->parks, catalog->count, sizeof( Park * ), compare );
}

void listParks( Catalog *catalog, bool ( *test )( Park const *park, char const *str ), char const *str ) {
  // Iterate over each park in the catalog.
  for ( int i = 0; i < catalog->count; i++ ) {
    Park *currentPark = catalog->parks[ i ];

    // Check if the park should be printed.
    if ( test( currentPark, str ) ) {
      // Print the park ID, name, latitude, and longitude.
      printf( "%-3d %-40s %8.3lf %8.3lf ", currentPark->id, currentPark->name, currentPark->latitude, currentPark->longitude );

      // Print the counties.
      for ( int j = 0; j < currentPark->numCounties; j++ ) {
        printf( "%s", currentPark->counties[ j ] );
        if ( j < currentPark->numCounties - 1 ) {
          printf( "," );
        }
      }
      printf( "\n" );
    }
  }
}