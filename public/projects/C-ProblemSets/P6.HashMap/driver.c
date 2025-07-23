/**
  @file driver.c
  @author Nick Gallo
  Top level component for the dictionary.
*/

#include "input.h"
#include "map.h"
#include "value.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

/** Exit failure parameter. */
#define EXIT_FAILURE 1

#define STRING_SIZE 31

// Function to parse a value (integer for now)
static bool parseValue( Value *v, const char *str ) {
  if ( str[ 0 ] == '\"' ) {
    // Handle string value
    return parseString( v, str ) > 0;
  } 
  
  else {
    // Handle integer value
    return parseInteger( v, str ) > 0;
  }
}

/**
 * Top level component.
*/
int main()
{
  // Create an empty map
  Map *map = makeMap( 10 );

  // Check for map creation failure
  if ( !map ) {
    fprintf( stderr, "Failed to create map\n" );
    return EXIT_FAILURE;
  }

  // Prompt for the first command
  printf( "cmd> " );

  // Read commands in a loop
  char *line;
  while ( ( line = readLine( stdin ) ) != NULL ) {
    // Echo the command
    printf( "%s\n", line );

    // Parse the command and its arguments
    char cmd[ 10 ];
    Value key, val;
    int numParsed = sscanf( line, "%9s", cmd );

    // Process commands
    if ( strcmp( cmd, "set" ) == 0 ) {
      // Handle set command
      char keyStr[ STRING_SIZE ], valStr[ STRING_SIZE ];

      if ( sscanf( line, "%*s %s %s", keyStr, valStr ) == 2 ) {
        // Parse key and value
        if ( parseValue( &key, keyStr ) && parseValue( &val, valStr ) ) {
          // Set key-value in map
          mapSet( map, &key, &val );
        } 
        
        else {
          printf( "Invalid command\n" );
        }
      } 
      
      else {
        printf( "Invalid command\n" );
      }
    } 
    
    else if ( strcmp( cmd, "get" ) == 0 ) {
        // Handle get command
        char keyStr[ STRING_SIZE ];
        if ( sscanf( line, "%*s %s", keyStr ) == 1 ) {
          if ( parseValue( &key, keyStr ) ) {
            Value *retrieved = mapGet( map, &key );

            if ( retrieved ) {
              retrieved->print( retrieved );
              printf( "\n" );
            } 
            
            else {
              printf( "Undefined\n" );
            }
          } 
          
          else {
              printf( "Invalid command\n" );
          }
        } 
        
        else {
          printf( "Invalid command\n" );
        }
    } 
    
    else if ( strcmp( cmd, "remove" ) == 0 ) {
      // Handle remove command
      char keyStr[ STRING_SIZE ];
      if ( sscanf( line, "%*s %s", keyStr ) == 1 ) {
        if ( parseValue( &key, keyStr ) ) {
          if ( !mapRemove( map, &key ) ) {
            printf( "Not in map\n" );
          }
        } 
        
        else {
          printf( "Invalid command\n" );
        }
      } 
      
      else {
        printf( "Invalid command\n" );
      }
    } 
    
    else if ( strcmp( cmd, "size" ) == 0 ) {
      // Handle size command
      if ( numParsed == 1 ) {
        printf( "%d\n", mapSize( map ) );
      } 
      
      else {
        printf( "Invalid command\n" );
      }
    } 
    
    else if ( strcmp( cmd, "quit" ) == 0 ) {
      // Handle quit command
      break;
    } 
    
    else {
      printf( "Invalid command\n" );
    }

    // Free the line read
    free( line );

    // Print prompt for next command
    printf( "\ncmd> " );
  }

  // Free the map
  freeMap( map );

  return 0;
}