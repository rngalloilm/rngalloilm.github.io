/**
 * @file name.c
 * @author Nick Gallo (rngallo)
*/

#include "name.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

/** Exit status for a missing or badly formatted name. */
#define NAME_ERROR 101
/** Used in checking validity of name, 2 commas is considered an invalid name. */
#define MAX_COMMAS 1

bool read_name( char name[ FIELD_MAX + 1 ] )
{
  int ch;
  int length = 0;

  // Iterate through the line until the first colon is reached
  while ( ( ch = getchar() ) != EOF && ch != ':' ) {
    // Exit if name length exceeds the maximum length
    if ( length >= FIELD_MAX ) {
      exit(NAME_ERROR);
    }

    // Store the character
    name[length] = (char)ch;
    length++;
  }

  // Check if the end-of-file was reached
  if ( ch == EOF || length == 0 ) {
    return false;
  }

  name[length] = '\0';
  return true;
}

/**
 * Checks to see if the input recieved is only letters, spaces, and up to 1 comma.
 * @param name First and last name, validity checked here
 * @return Number of commas, 2 represents invalid
*/
static int is_valid_name( char name[ FIELD_MAX + 1 ] )
{
  int i = 0;

  // Only letters and spaces
  while ( name[i] != '\0' ) {
    if ( !isalpha(name[i]) && name[i] != ' ' && name[i] != ',' ) {
      exit(NAME_ERROR); 
    }

    i++;
  }

  // Check for a comma
  int commaCount = 0;
  for ( i = 0; i < strlen(name); i++ ) {
    if ( name[i] == ',' ) {
      commaCount++;
    }
  }

  return commaCount;
}

void fix_name( char name[ FIELD_MAX + 1 ] )
{
  int commaCount = is_valid_name(name);

  // Check if the name content is valid
  if ( commaCount > MAX_COMMAS ) {
    exit(NAME_ERROR);
  }

  int i = 0;
  int startLast = 0;
  int nullTerm = 0;

  // Capitalize the first letter of the first and last names
  int new_word = 1;

  while (i < strlen(name)) {
    // Check if the current character is a letter and is part of a new word
    if ( isalpha(name[i]) && new_word ) {
      name[i] = toupper(name[i]);
      new_word = 0;
    } else if ( isspace(name[i]) || name[i] == ',' ) {
      new_word = 1;
      startLast = i;
    }

    i++;  // Move to the next character
  }

  // Index of null term
  nullTerm = i;

  // If there's no comma, it's "First Last" and needs to be "Last, First"
  if ( commaCount == 0 ) {
    int count = 0;

    // Reset iteration through name[]
    i = 0;
    
    // Get the first name, account for the comma in the loop
    // Add a comma and a space ahead of the first name
    char firstName[FIELD_MAX + 1];
    char lastName[FIELD_MAX + 1];
    firstName[0] = ',';
    count++;
    firstName[1] = ' ';
    count++;

    while ( i < ( startLast + 1 ) ) {
      firstName[count] = name[i];
      count++;
      i++;
    }

    // Add a null term to firstName[]
    firstName[count] = '\0';
    // Move past the space
    i++;
    // Reset counter
    count = 0;

    // Get the last name, will include the null term
    while ( i <= nullTerm ) {
      lastName[count] = name[i];
      count++;
    }

    // Reset iteration through name[]
    i = 0;
    // Reset counter
    count = 0;

    // Setup the formatted name[]

    // Insert the last name
    // name[] is dest, 0 is the dstart, lastName[] is the src,
    // 0 is the sstart, strlen(lastName[]) is the send.
    copy_substring( name, 0, lastName, 0, strlen(lastName) );

    // Insert the first name which inlcludes the comma and space
    // name[] is dest, strlen(lastName) + 1 is the dstart, firstName[] is the src,
    // 0 is the sstart, strlen(firstName) is the send.
    copy_substring( name, strlen(lastName) + 1, firstName, 0, strlen(firstName) );
  }
}