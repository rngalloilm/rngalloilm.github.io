/**
 * @file ssn.c
 * @author Nick Gallo (rngallo)
*/

#include "ssn.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

/** Exit status for a missing or badly formatted ssn. */
#define SSN_ERROR 103

/** Number of digits in the first group in the SSN. */
#define START_DIGITS 3

/** Number of digits in the middle group in the SSN. */
#define MIDDLE_DIGITS 2

/** Number of digits in the last group in the SSN. */
#define END_DIGITS 4

/** The length of a N/A ssn */
#define LEN_NA 3

/** The length of a ssn with no dashes */
#define LEN_NO_DASHES 9

/** The length of a ssn with dashes */
#define LEN_DASHES 11

/** Input ssn doesn't include dashes */
#define NO_DASHES 0

/** Input ssn includes dashes */
#define HAS_DASHES 1

/** Input ssn is N/A */
#define SSN_NA 2

/** Input ssn is invalid */
#define INVALID_SSN 3

void read_ssn( char ssn[ FIELD_MAX + 1 ] )
{
  int ch;
  int length = 0;
  
  // Iterate through the line until the first colon is reached
  while ( ( ch = getchar() ) != EOF && ch != '\n' ) {
    // Exit if ssn length exceeds the maximum length
    if ( length >= FIELD_MAX ) {
      exit(SSN_ERROR);
    }

    // Store the character
      ssn[length] = (char)ch;
      length++;
  }

  ssn[length] = '\0';
}

/**
 * Checks to see if the input recieved is either nine numbers, nine numbers and two dashes (-), or
 * the string "N/A".
 * @param ssn Nine digits or N/A, validity checked here
 * @return A digit corresponding with the format, or false
*/
static int is_valid_ssn( char ssn[ FIELD_MAX + 1 ] )
{
  int i = 0;
  int dashCount = 0;
  int slashCount = 0;

  // All input ssn will have 9 (no dashes), 11 (dashes), or 3 (N/A) characters
  if ( strlen(ssn) != LEN_NO_DASHES && strlen(ssn) != LEN_DASHES && strlen(ssn) != LEN_NA ) {
    exit(SSN_ERROR);
  }

  // Only numbers and 0 or 2 dashes (-) unless "N/A". Check numeral type inputs first
  if ( strlen(ssn) == LEN_NO_DASHES || strlen(ssn) == LEN_DASHES ) {
    while ( ssn[i] != '\0' ) {
      // Can only be a digit or a dash
      if ( !isdigit(ssn[i]) && ssn[i] != '-' ) {
        return INVALID_SSN;
      }

      // If it has dashes, it needs 2
      if ( ssn[i] == '-' ) {
        dashCount++;
      }

      i++;
    }
  }
  // Check "N/A" validity
  if ( strlen(ssn) == LEN_NA ) {
    // Reset iteration through ssn[]
    i = 0;
    while ( ssn[i] != '\0' ) {
      // Can only be an uppercase letter or a slash
      if ( !isalpha(ssn[i]) && ssn[i] != '/' ) {
        return INVALID_SSN;
      }
      if ( isalpha(ssn[i]) && !isupper(ssn[i]) ) {
        return INVALID_SSN;
      }

      // It needs 1 slash
      if ( ssn[i] == '/' ) {
        slashCount++;
      }

      i++;
    }
  }
  
  // If ssn is "N/A"
  if ( slashCount == 1 && strlen(ssn) == LEN_NA ) {
    return SSN_NA;
  }
  // If ssn is "XXXXXXXXX"
  if ( dashCount == 0 && strlen(ssn) == LEN_NO_DASHES ) {
    return NO_DASHES;
  }
  // If ssn is "XXX-XX-XXXX"
  if ( dashCount == 2 && strlen(ssn) == LEN_DASHES ) {
    return HAS_DASHES;
  }

  return INVALID_SSN;
}

void fix_ssn( char ssn[ FIELD_MAX + 1 ] )
{
  // Determine the format of the ssn
  int ssnType = is_valid_ssn(ssn);
  // Check if the ssn content is valid
  if ( ssnType == INVALID_SSN ) {
    exit(SSN_ERROR);
  }

  // If the input is in "XXXXXXXXX", it needs to be put it standard format
  // "XXX-XX-XXXX" and "N/A" are already in SF
  int i = 0;
  int count = 0;
  if ( ssnType == NO_DASHES ) {
    char termOne[START_DIGITS + 1];
    char termTwo[MIDDLE_DIGITS + 1];
    char termThree[END_DIGITS + 1];
    // Get the first term
    while ( i < START_DIGITS ) {
      termOne[count] = ssn[i];
      count++;
      i++;
    }
    termOne[count] = '\0';
    // Get the second term
    count = 0;
    while ( i < ( START_DIGITS + MIDDLE_DIGITS ) ) {
      termTwo[count] = ssn[i];
      count++;
      i++;
    }
    termTwo[count] = '\0';
    // Get the third term 
    count = 0;
    while ( i < ( START_DIGITS + MIDDLE_DIGITS + END_DIGITS ) ) {
      termThree[count] = ssn[i];
      count++;
      i++;
    }
    termThree[count] = '\0';

    // Organize the terms
    count = 0;
    // Reset iteration through ssn[]
    i = 0;
    while ( termOne[count] != '\0' ) {
      ssn[i] = termOne[count];
      count++;
      i++;
    }
    ssn[i] = '-';
    i++;
    count = 0;
    while ( termTwo[count] != '\0' ) {
      ssn[i] = termTwo[count];
      count++;
      i++;
    }
    ssn[i] = '-';
    i++;
    count = 0;
    while ( termThree[count] != '\0' ) {
      ssn[i] = termThree[count];
      count++;
      i++;
    }
    ssn[i] = '\0';
  }
}