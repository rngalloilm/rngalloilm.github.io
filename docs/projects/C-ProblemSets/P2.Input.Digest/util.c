/**
 * @file util.c
 * @author Nick Gallo (rngallo)
*/

#include "util.h"

#include <ctype.h>

int skip_digits( char str[], int start )
{
  int index = start;

  while ( str[index] != '\0' && isdigit( str[index] ) ) {
    index++;
  }

  return index;
}

int skip_letters( char str[], int start )
{
  int index = start;

  while ( str[index] != '\0' && isalpha( str[index] ) ) {
    index++;
  }

  return index;
}

int copy_substring( char dest[], int dstart, char src[], int sstart, int send )
{
  int destInd = dstart;
    
  for ( int srcInd = sstart; srcInd < send; srcInd++ ) {
    dest[destInd] = src[srcInd];
    destInd++;
  }
  
  // Add a null terminator to the end of dest
  dest[destInd] = '\0';
  
  return destInd;
}