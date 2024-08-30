/**
 * @file parks.c
 * @author Nick Gallo (rngallo)
*/

#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include <string.h>
#include "catalog.h"
#include "input.h"

// ----- Definitions -----

/** Character limit for a command name. */
#define CMD_NAME 40

/** Max number of files on the command line. */
#define MAX_FILES 100

/** Maximum number of parks in a trip. */
#define MAX_TRIP_PARKS 1000

/** Initial capacity for the trip array. */
#define INITIAL_TRIP_CAPACITY 5

/** Start of reading the county on the command line. */
#define CMD_COUNTY_IDX 12

/** Start of reading the ID for add on the command line. */
#define ADD_ID_IDX 4

/** Start of reading the ID for remove on the command line. */
#define REMOVE_ID_IDX 7

/** Start of reading the ID for remove on the command line. */
#define PARK_ID_LEN 3

/**
 * Trip struct. Includes number of parks, current capacity, and array of pointers to parks.
*/
typedef struct {
  int count;
  int capacity;
  Park **parks;
} Trip;

// ----- Compare functions -----

/**
 * Used when calling sortParks() to sort by ID.
 * @param va Park one.
 * @param vb Park two.
 * @return Comparison value.
*/
static int compareByID( void const *va, void const *vb ) {
  Park const *a = *( Park const ** )va;
  Park const *b = *( Park const ** )vb;

  if ( a->id < b->id ) return -1;
  if ( a->id > b->id ) return 1;
  return 0;
}

/**
 * Used when calling sortParks() to sort by name, after ID.
 * @param va Park one.
 * @param vb Park two.
 * @return Comparison value.
*/
static int compareByName( void const *va, void const *vb ) {
  Park const *a = *( Park const ** )va;
  Park const *b = *( Park const ** )vb;

  int nameComparison = strcmp( a->name, b->name );

  // If names are the same, compare by ID.
  if ( nameComparison == 0 ) {
    if ( a->id < b->id ) return -1;
    if ( a->id > b->id ) return 1;
    return 0;
  }

  return nameComparison;
}

/**
 * Used when calling sortParks() to sort by county name, after ID.
 * @param va Park one.
 * @param vb Park two.
 * @return Comparison value.
*/
static int compareByCounty( void const *va, void const *vb ) {
  Park const *a = *( Park const ** )va;
  Park const *b = *( Park const ** )vb;

  // First, compare the primary county (the first county listed for each park).
  int countyComparison = strcmp( a->counties[ 0 ], b->counties[ 0 ] );

  // If the primary counties are the same, compare the number of counties (prioritize single-county parks).
  if ( countyComparison == 0 ) {
    if ( a->numCounties != b->numCounties ) {
      // Park with fewer counties should come first.
      return ( a->numCounties < b->numCounties ) ? -1 : 1;
    } 
    
    else {
      // If the number of counties is the same, and there is more than one county,
      // continue comparing the next counties.
      for ( int i = 1; i < a->numCounties; i++ ) {
        countyComparison = strcmp( a->counties[ i ], b->counties[ i ] );

        if ( countyComparison != 0 ) {
          return countyComparison;
        }
      }
    }
  }

  return countyComparison;
}

// ----- Command processing -----

/**
 * Prints the header used for the "list" commands.
*/
static void printHeader() {
  printf( "%-3s %-40s %8s %8s %s\n", "ID", "Name", "Lat", "Lon", "Counties" );
}

/**
 * Sends all parks to be printed.
 * @param park Current park being tested.
 * @param substring County modifier. Not applicable.
 * @return Always true.
*/
static bool parksTest( Park const *park, char const *str ) {
  // All parks pass.
  return true;
}

/**
 * Sends parks with the specified county to be printed.
 * @param park Current park being tested.
 * @param substring County modifier.
 * @return True if county is found in Park.
*/
static bool countyTest( Park const *park, char const *str ) {
  // True for parks containing the specified county.
  for ( int i = 0; i < park->numCounties; i++ ) {
    if ( strcmp( park->counties[ i ], str ) == 0 ) {
      return true;
    }
  }

  return false;
}

/**
 * Finds a park in the catalog with the given ID.
 * @param catalog Catalog of all Parks.
 * @param id The ID of the park to find.
 * @return Pointer to the Park with the given ID, or NULL if not found.
 */
Park *findParkById( Catalog *catalog, int id ) {
  for ( int i = 0; i < catalog->count; i++ ) {
    if ( catalog->parks[ i ]->id == id ) {
      return catalog->parks[ i ];
    }
  }

  return NULL;
}

/**
 * Takes user input command (list commands, add, remove, trip) and executes.
 * @param catalog Catalog of all Parks.
 * @param command Standard input string containing the user's command.
*/
static void processCommand( Catalog *catalog, Trip *trip, char *command ) {
  // "list parks" command.
  if ( strcmp( command, "list parks" ) == 0 ) {
    // Print the header.
    printHeader();

    // Sort the parks by ID.
    sortParks( catalog, compareByID );
  
    // Print all the parks.
    listParks( catalog, parksTest, NULL );
  }

  // "list names" command.
  else if ( strcmp( command, "list names" ) == 0 ) {
    // Print the header.
    printHeader();

    // Sort the parks by name.
    sortParks( catalog, compareByName );
  
    // Print all the parks.
    listParks( catalog, parksTest, NULL );
  }

  // "list county" command.
  else if ( strncmp( command, "list county ", CMD_COUNTY_IDX ) == 0 ) {
    // Print the header.
    printHeader();

    // Skip the first 12 characters of the base command.
    char *countyName = command + CMD_COUNTY_IDX;

    // Sort the parks by ID then by county names.
    sortParks( catalog, compareByID );
    sortParks( catalog, compareByCounty );
    sortParks( catalog, compareByName );
  
    // Print the parks with the specified county.
    listParks( catalog, countyTest, countyName );
  }
  
  // "add" command.
  else if ( strncmp( command, "add ", ADD_ID_IDX ) == 0 ) {
    // Get the ID.
    char idStr[ PARK_ID_LEN + 1 ];
    strncpy( idStr, command + ADD_ID_IDX, PARK_ID_LEN );
    idStr[ PARK_ID_LEN ] = '\0';

    // Convert the string ID to an integer.
    int id = atoi( idStr );

    // Get the park with the ID.
    Park *park = findParkById( catalog, id );
    if ( park == NULL ) {
      printf( "Invalid command\n" );
    }

    else {
      // Check if park is already in the trip.
      for ( int i = 0; i < trip->count; i++ ) {
        if ( trip->parks[ i ] == park ) {
          break;
        }
      }
      // Check if the trip array needs to be expanded.
      if ( trip->count >= trip->capacity ) {
        trip->capacity *= 2;
        Park **newArray = realloc( trip->parks, trip->capacity * sizeof( Park * ) );

        if ( !newArray ) {
          // Check reallocation.
          printf( "Failed to expand trip.\n" );
          exit( EXIT_FAILURE );
        } 
        
        else {
          trip->parks = newArray;
        }
      }

      // Add the park to the trip.
      trip->parks[ trip->count++ ] = park;
    }
  }

  // "remove" command.
  else if ( strncmp( command, "remove ", REMOVE_ID_IDX ) == 0 ) {
    bool parkFound = false;

    // Get the ID.
    char idStr[ PARK_ID_LEN + 1 ];
    strncpy( idStr, command + REMOVE_ID_IDX, PARK_ID_LEN );
    idStr[ PARK_ID_LEN ] = '\0';

    // Convert the string ID to an integer.
    int id = atoi( idStr );

    // Remove the park from the trip.
    for ( int i = 0; i < trip->count; i++ ) {
      if ( trip->parks[ i ]->id == id ) {
        parkFound = true;

        // Shift remaining parks one position left.
        for ( int j = i; j < trip->count - 1; j++ ) {
          trip->parks[ j ] = trip->parks[ j + 1 ];
        }

        // Decrease the count of parks in the trip.
        trip->count--;
        break;
      }
    }

    if ( !parkFound ) {
      printf( "Invalid command\n" );
    }
  }

  // "trip" command.
  else if ( strcmp( command, "trip" ) == 0 ) {
    // Print the header.
    printf( "ID  Name                                     Distance\n" );

    // Keep the total distance.
    double totalDist = 0.0;

    // Keep the previous park.
    Park const *prevPark = NULL;

    // Iterate over the parks and find the total distance.
    for ( int i = 0; i < trip->count; i++ ) {
      // If there's a previous park, add the current distance to the total.
      if ( prevPark != NULL ) {
        totalDist += distance( prevPark, trip->parks[ i ] );
      }

      // Print the park.
      printf( "%-3d %-40s %8.1f\n", trip->parks[ i ]->id, trip->parks[ i ]->name, totalDist );

      // Update the previous park.
      prevPark = trip->parks[ i ];
    }
  }
  
  // If not listed, invalid and prompt again.
  else {
    printf( "Invalid command\n" );
  }
}

// ----- MAIN -----  

/**
 * Top level function.
 * @param numArgs Number of arguments on command line inluding executable.
 * @param args Pointer to the array of arguments.
*/
int main( int numArgs, char *args[] ) {
  // Create the catalog.
  Catalog *catalog = makeCatalog();
  // Check initialization.
  if ( catalog == NULL ) {
    fprintf( stderr, "Failed to create a catalog.\n" );
    exit( EXIT_FAILURE );
  }

  // Create the trip.
  Trip trip = { 0, INITIAL_TRIP_CAPACITY, malloc( INITIAL_TRIP_CAPACITY * sizeof( Park * ) ) };
  // Check initialization.
  if ( !trip.parks ) {
    exit( EXIT_FAILURE );
  }

  // Get all the parks into the catalog from the file names on command line.
  char fileNames[ MAX_FILES ][ CMD_NAME ];
  int fileCount = 0;
  // Must be at least one file name.
  if ( numArgs < 2 ) {
    fprintf( stderr, "usage: parks <park-file>*\n" );
    exit( EXIT_FAILURE );
  }
  // Put file names into a string array, max 100.
  for ( int i = 1; i < numArgs && fileCount < MAX_FILES; i++ ) {
    fileNames[ fileCount ][ CMD_NAME - 1 ] = '\0'; 
    strncpy( fileNames[ fileCount ], args[ i ], CMD_NAME );
    fileNames[ fileCount ][ CMD_NAME - 1 ] = '\0'; 

    fileCount++;
  }
  // Read all files and build the catalog.
  for ( int i = 0; i < fileCount; i++ ) {
    readParks( fileNames[ i ], catalog );
  }

  // Get the user commands (list, add, remove, trip, quit).
  char *command = NULL;

  do {
    // Free the allocated memory for command.
    free( command ); 

    // Get the command from the user.
    printf( "cmd> " );
    command = readLine( stdin );

    // Check for EOF, error, or NULL command.
    if ( !command ) {
      break;
    }

    // Echo the command.
    printf( "%s\n", command );

    if ( strcmp( command, "quit" ) != 0 ) {
      // Execute the functionality for the command.
      processCommand( catalog, &trip, command );
      printf( "\n" );
    }

  } while ( strcmp( command, "quit" ) != 0 );

  // Free the catalog, trips, and command string.
  free( command );
  free( trip.parks );
  freeCatalog( catalog );

  return 0;
}