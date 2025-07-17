/**
  @file value.c
  @author Nick Gallo (rngallo)
  Implementation for the value component, with support for integer
  and (eventually) string values.
*/

#include "value.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

/** The hash multiplier */
#define HASH_MULTIPLIER 31

//////////////////////////////////////////////////////////
// Integer implementation.

// print method for Integer.
static void printInteger( Value const *v )
{
  // Print the integer inside this value.
  printf( "%d", v->ival );
}

// move method for Integer.
static void moveInteger( Value const *src, Value *dest )
{
  // We just need to copy the value.
  dest->ival = src->ival;
  
  dest->print = src->print;
  dest->move = src->move;
  dest->equals = src->equals;
  dest->hash = src->hash;
  dest->empty = src->empty;
}

// equals method for Integer.
static bool equalsInteger( Value const *v, Value const *other )
{
  // Make sure the other object is also an Integer.
  // (i.e., it uses the same print funtion)
  if ( other->print != printInteger )
    return false;

  return v->ival == other->ival;
}

// hash method for Integer.
static unsigned int hashInteger( Value const *v )
{
  // This will overflow negative values to large positive ones.
  return v->ival;
}

// Free memory used inside this integer Value.
static void emptyInteger( Value *v )
{
  // An int vaue doesn't need any additional memory.
}

int parseInteger( Value *v, char const *str )
{
  // Try to parse an integer from str.
  int val, len;
  if ( sscanf( str, "%d%n", &val, &len ) != 1 )
    return 0;

  // Fill in all the fields of v for an integer type of value.
  v->print = printInteger;
  v->move = moveInteger;
  v->equals = equalsInteger;
  v->hash = hashInteger;
  v->empty = emptyInteger;
  v->ival = val;

  // Return how much of str we parsed.
  return len;
}

//////////////////////////////////////////////////////////
// String implementation.

// print method for String.
static void printString( Value const *v )
{
  // Assuming the string is null-terminated.
  printf( "%s", (char *)v->vptr );
}

// move method for String.
static void moveString( Value const *src, Value *dest )
{
  // Move the pointer from source to destination.
  dest->vptr = src->vptr;

  // Assign function pointers for string operations.
  dest->print = src->print;
  dest->move = src->move;
  dest->equals = src->equals;
  dest->hash = src->hash;
  dest->empty = src->empty;
}

// equals method for String.
static bool equalsString( Value const *v, Value const *other )
{
  // Check if other is also a string.
  if ( other->print != printString )
    return false;

  // Compare the strings.
  return strcmp( (char *)v->vptr, (char *)other->vptr ) == 0;
}

// hash method for String.
static unsigned int hashString( Value const *v )
{
  const char *key = (char *)v->vptr;
  int i = 1;
  unsigned int hash = 0;

  while ( i != strlen( key ) - 1 ) {
    hash += key[ i++ ];
    hash += hash << 10;
    hash ^= hash >> 6;
  }

  hash += hash << 3;
  hash ^= hash >> 11;
  hash += hash << 15;

  return hash;
}

// Free memory used inside this string Value.
static void emptyString( Value *v )
{
  free( v->vptr );
  v->vptr = NULL;
}

int parseString( Value *v, char const *str )
{
  int len = 0;
  while( isspace( str[ len]) ) {
    len++;
  }

  char *strValue = (char *)malloc( sizeof( char ) * strlen( str ) + 1 );
  int pos = 0;
  int found = 0;

  for ( int i = len; str[ i ]; i++ ) {
    if ( str[ i ] == '\"' ) {
      found++;
    }
    if ( found > 1 ) {
      strValue[ pos++ ] = str[ i ];
      len++;
      break;
    }
    strValue[ pos++ ] = str[ i ];
    len++;
  }

  if ( found < 2 ) {
    free( strValue );
    return 0;
  }

  strValue[ pos ] = '\0';

  // Initialize Value instance for a string
  v->print = printString;
  v->move = moveString;
  v->equals = equalsString;
  v->hash = hashString;
  v->empty = emptyString;
  v->vptr = strValue;

  return len;  // Account for the opening and closing quotes  
}