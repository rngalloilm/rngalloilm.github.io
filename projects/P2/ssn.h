/**
 * Header file for the ssn component. Functions for reading 
 * the social security number and converting it to standard format.
*/

#include "util.h"
#include <stdbool.h>

/**
 * Gets the ssn from input and stores it in a string. Exits
 * if the ssn is too long or missing.
 * @param ssn Nine digits or N/A, input in this function
*/
void read_ssn( char ssn[ FIELD_MAX + 1 ] );

/**
 * Puts the ssn into standard format. Standard format: "XXX-XX-XXXX" or "N/A".
 * @param ssn Nine digits or N/A, string edited here
*/
void fix_ssn( char ssn[ FIELD_MAX + 1 ] );