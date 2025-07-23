/**
 * @file input.c
 * @author Nick Gallo (rngallo)
*/

#include "input.h"
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include <string.h>

/** Size of allocated space for string. */
#define STRING_SIZE 1024

char *readLine( FILE *fp ) {
  // Check if theres content in the file stream
  if ( !fp ) {
    return NULL;
  }
  
  // Allocate memory for the string
  size_t size = STRING_SIZE;
  size_t position = 0;
  
  char *line = ( char* )malloc( size * sizeof( char ) );

  // Check for allocation failure
  if ( !line ) {
    free( line );
    
    return NULL;
  }

  // Get the string from the file stream
  int ch;
  while ( ( ch = fgetc( fp ) ) != EOF && ch != '\n' ) {
    // Check if the string is full
    if ( position == size - 1 ) {
      // Double the size
      size *= 2;

      // Reallocate
      char *doubledLine = ( char* )realloc( line, size * sizeof( char ) );

      // Check for allocation failure
      if ( !doubledLine ) {
        free( line );

        return NULL;
      }

      // Assign the resized line to the original
      line = doubledLine;
    }

    // Store the character
    line[ position ] = ch;
    position++;
  }

  // Free the memory if no input was read
  if ( ch == EOF && position == 0 ) {
    free( line );
    
    return NULL;
  }

  // Add a null term at the end of the string
  line[ position ] = '\0';

  return line;
}