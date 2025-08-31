/**
 * Header file for the catalog component. Includes helper functions to create and free
 * the catalog, read parks from a file, find distance between parks, and
 * list and sort parks in the catalog.
*/

#include <stdbool.h>
#include <stdio.h>

/** Exit code */
#define EXIT_FAILURE 1

/** Character limit for a county name */
#define COUNTY_NAME 12

/** Character limit for a park name */
#define PARK_NAME 40

/** Max number of counties per park */
#define MAX_COUNTY 5

/**
 * Park struct. Includes and ID, lat, long, name, and up to 5 counties.
*/
typedef struct {
  int id;
  double latitude;
  double longitude;
  char name[ PARK_NAME + PARK_NAME ];
  int numCounties;
  char counties[ MAX_COUNTY ][ COUNTY_NAME + 1 ];
} Park;

/**
 * Catalog struct. Includes number of parks, current capacity, and array of pointers to parks.
*/
typedef struct {
  int count;
  int capacity;
  Park **parks;
} Catalog;

/**
 * Serves as a constructor. Dynamically allocates storage for the Catalog and 
 * initializes its fields to store a resizable array.
 * @return A pointer to the new Catalog.
*/
Catalog *makeCatalog();

/**
 * Finds distance in miles between two parks based on the Parks’ global coordinates.
 * @param a Park A.
 * @param b Park B.
 * @return Distance in miles.
*/
double distance( Park const *a, Park const *b );

/**
 * Frees the memory used to store the given Catalog and Parks, freeing 
 * the resizable array of pointers and freeing space for the Catalog struct itself.
 * @param catalog Catalog of all Parks.
*/
void freeCatalog( Catalog *catalog );

/**
 * Reads all the parks from a park file with the given name. Makes 
 * an instance of the Park struct for each one and stores a 
 * pointer to that Park in the resizable array in catalog.
 * @param filename Name of the file.
 * @param catalog Catalog where Parks are inserted.
*/
void readParks( char const *filename, Catalog *catalog );

/**
 * Sorts the parks in the given catalog. Uses qsort() and a comparison function pointer 
 * parameter to determine the order they get sorted.
 * @param catalog Catalog of Parks being sorted.
 * @param compare Comparison function pointer to sort parks by some criteria.
*/
void sortParks( Catalog *catalog, int ( * compare ) ( void const *va, void const *vb ) );

/**
 * Prints all or some of the parks. Used for the 
 * list parks, list names, and list county commands.
 * @param catalog Catalog of Parks being used to pull from.
 * @param test Function pointer. Returns true to print that Park.
 * @param str Additional info for the test function. Includes parameters for a command.
*/
void listParks( Catalog *catalog, bool ( *test )( Park const *park, char const *str ), char const *str );