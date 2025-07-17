/**
 * Header file for the date component. Functions for reading the
 * birthdate field and converting it to standard format.
*/

#include "util.h"
#include <stdbool.h>

/**
 * Gets the date from input and stores it in a string. Exits
 * if the date is too long or missing.
 * @param date Year, month, and day string, input in this function
*/
void read_date( char date[ FIELD_MAX + 1 ] );

/**
 * Puts the date into standard format. Standard format: "YYYY-MM-DD".
 * @param name Year, month, and day string, string edited here
*/
void fix_date( char date[ FIELD_MAX + 1 ] );