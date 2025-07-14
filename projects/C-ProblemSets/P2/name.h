/**
 * Header file for the name component. Functions for reading the
 * name field and converting it to standard format.
*/

#include "util.h"
#include <stdbool.h>

/**
 * Gets the first two words from input and stores it in a string. Exits
 * if the name is too long or missing.
 * @param name First and last name, input in this function
 * @return False if EOF is reached or there's no name
*/
bool read_name( char name[ FIELD_MAX + 1 ] );

/**
 * Puts the name into standard format. Standard format: "Last, First".
 * @param name First and last name, string edited here
*/
void fix_name( char name[ FIELD_MAX + 1 ] );