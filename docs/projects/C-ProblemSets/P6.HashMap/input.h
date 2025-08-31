/**
 * Header file for the input component. Reads a single line of input from 
 * the given input stream (stdin or a file) and returns it as a DA string.
*/

#include <stdbool.h>
#include <stdio.h>

/**
 * Reads a single line of input from the given input stream (stdin or a file). 
 * Use reading commands from the user and park descriptions from a park file.
 * @param fp Input file stream.
 * @return A string inside a block of dynamically allocated memory.
*/
char *readLine( FILE *fp );