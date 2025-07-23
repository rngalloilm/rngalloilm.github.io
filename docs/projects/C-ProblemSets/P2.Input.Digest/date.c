/**
 * @file date.c
 * @author Nick Gallo (rngallo)
*/

#include "date.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

/** Exit status for a missing or badly formatted date. */
#define DATE_ERROR 102

/** Two low-order digits of the current year. */
#define CURRENT_YEAR "23"

/** Number of digits in the short (2 digit) year. */
#define SHORT_YEAR 2

/** Number of digits in the full (4 digit) year. */
#define FULL_YEAR 4

/** Number of digits in the month. */
#define MONTH_DIGITS 2

/** Number of digits in the day. */
#define DAY_DIGITS 2

/** If the date uses slashes (/) as a delimiter */
#define HAS_SLASH 0

/** If the date uses dashes (-) as a delimiter */
#define HAS_DASH 1

/** If the date is invalid */
#define INVALID_DATE 2

/** Date containing a full year */
#define FULL_YEAR_DATE 10

/** Date containing a short year */
#define SHORT_YEAR_DATE 8

/** Number of delimiters in a date */
#define DELIMS_IN_DATE 2

void read_date( char date[ FIELD_MAX + 1 ] )
{
  int ch;
  int length = 0;
  
  // Iterate through the line until the first colon is reached
  while ( ( ch = getchar() ) != EOF && ch != ':' ) {
    // Exit if date length exceeds the maximum length
    if ( length >= FIELD_MAX ) {
      exit(DATE_ERROR);
    }

    // Store the character
      date[length] = (char)ch;
      length++;
  }

  date[length] = '\0';
}

/**
 * Checks to see if the input recieved is only numbers, one of: dashes(-) or
 * slashes(/), and either 8 (short year) or 10 (long year) characters from input (YYYY-MM-DD or DD-MM-YY).
 * @param date Year, month, and day string, validity checked here
 * @return A digit corresponding with the delimiter, or false
*/
static int is_valid_date( char date[ FIELD_MAX + 1 ] )
{
  int i = 0;
  int dashCount = 0;
  int slashCount = 0;
  int dateLen = strlen(date);

  // All input dates will have 8 (short year) or 10 (long year) characters
  if ( dateLen != SHORT_YEAR_DATE && dateLen != FULL_YEAR_DATE ) {
    exit(DATE_ERROR);
  }

  // Only numbers and one of: dashes(-) or slashes(/)
  while ( date[i] != '\0' ) {
    if ( !isdigit(date[i]) && ( date[i] != '/' && date[i] != '-' ) ) {
      return INVALID_DATE;
    }

    // Can only have one type of demiliter, count number of
    if ( date[i] == '-' ) {
      dashCount++;
    }
    if ( date[i] == '/' ) {
      slashCount++;
    }

    i++;
  }

  // Can only have one type of demiliter, determine which
  if ( dashCount == DELIMS_IN_DATE ) {
    return HAS_DASH;
  }
  if ( slashCount == DELIMS_IN_DATE ) {
    return HAS_SLASH;
  }

  return INVALID_DATE;
}

void fix_date( char date[ FIELD_MAX + 1 ] )
{
  // Determine which delimiter is used
  int delimType = is_valid_date(date);
  char delimChar;
  // Check if the date content is valid
  if ( delimType == INVALID_DATE ) {
    exit(DATE_ERROR);
  }
  if ( delimType == HAS_DASH ) {
    delimChar = '-';
  }
  if ( delimType == HAS_SLASH ) {
    delimChar = '/';
  }

  // Determine the order of the year, month, and day. Put the date into standard format: "YYYY-MM-DD"
  int termLen = 0;
  int i = 0;

  // Length 10 is either "YYYY-MM-DD" or "DD-MM-YYYY"
  if ( strlen(date) == FULL_YEAR_DATE ) {
    // Determine if year comes first
    while ( date[i] != delimChar ) {
      termLen++;
      i++;
    }

    // If the first terms are length 4, it's "YYYY-MM-DD". Correct order but needs a '-' delimiter
    if ( termLen == FULL_YEAR ) {
      // Assign '-'
      i = 0;
      while ( date[i] != '\0' ) {
        if ( date[i] == delimChar ) {
          date[i] = '-';
        }
        i++;
      }
    }

    // If the first terms are length 2, it's "DD-MM-YYYY". Needs a '-' delimiter and swap order
    else if ( termLen == DAY_DIGITS ) {
      // Assign '-'
      i = 0;
      while ( date[i] != '\0' ) {
        if ( date[i] == delimChar ) {
          date[i] = '-';
        }
        i++;
      }
      
      // Put in "YYYY-MM-DD" format from "DD-MM-YYYY"
      char year[FULL_YEAR + 1];
      char month[MONTH_DIGITS + 1];
      char day[DAY_DIGITS + 1];
      int count = 0;
      // Reset iteration through date[]
      i = 0;
      // Get the day
      while ( i < DAY_DIGITS ) {
        day[count] = date[i];
        count++;
        i++;
      }
      day[count] = '\0';
      // Skip '-'
      i++;
      // Get the month
      count = 0;
      while ( i < ( DAY_DIGITS + MONTH_DIGITS + 1 ) ) {
        month[count] = date[i];
        count++;
        i++;
      }
      month[count] = '\0';
      // Skip '-'
      i++;
      // Get the year 
      count = 0;
      while ( i < ( FULL_YEAR + MONTH_DIGITS + DAY_DIGITS + DELIMS_IN_DATE ) ) {
        year[count] = date[i];
        count++;
        i++;
      }
      year[count] = '\0';

      // Organize the terms
      count = 0;
      // Reset iteration through date[]
      i = 0;
      while ( year[count] != '\0' ) {
        date[i] = year[count];
        count++;
        i++;
      }
      date[i] = '-';
      i++;
      count = 0;
      while ( month[count] != '\0' ) {
        date[i] = month[count];
        count++;
        i++;
      }
      date[i] = '-';
      i++;
      count = 0;
      while ( day[count] != '\0' ) {
        date[i] = day[count];
        count++;
        i++;
      }
      date[i] = '\0';
    }

    // If the first term is not length 2 or 4 it it invalid
    else {
      exit(DATE_ERROR);
    }
  }

  // Length 8 is "DD-MM-YY"
  if ( strlen(date) == SHORT_YEAR_DATE ) {
    // Assign '-' as delimiter
    i = 0;
    while ( date[i] != '\0' ) {
      if ( date[i] == delimChar ) {
        date[i] = '-';
      }
      i++;
    }

    // Put in "YYYY-MM-DD" format from "DD-MM-YY"
    // In 1900s if YY is 24 or later
    char year[SHORT_YEAR + 1];
    char month[MONTH_DIGITS + 1];
    char day[DAY_DIGITS + 1];
    int count = 0;
    // Reset iteration through date[]
    i = 0;
    // Get the day
    while ( i < DAY_DIGITS ) {
      day[count] = date[i];
      count++;
      i++;
    }
    day[count] = '\0';
    // Skip '-'
    i++;
    // Get the month
    count = 0;
    while ( i < ( DAY_DIGITS + MONTH_DIGITS + 1 ) ) {
      month[count] = date[i];
      count++;
      i++;
    }
    month[count] = '\0';
    // Skip '-'
    i++;
    // Get the year 
    count = 0;
    while ( i < ( SHORT_YEAR + MONTH_DIGITS + DAY_DIGITS + DELIMS_IN_DATE ) ) {
      year[count] = date[i];
      count++;
      i++;
    }
    year[count] = '\0';

    // Organize the terms
    count = 0;
    // Reset iteration through date[]
    i = 0;
    // If year is greater than 23 it's in 1900s, else it's 2000s
    if ( strcmp( year, CURRENT_YEAR ) >= 0 ) {
      date[i] = '1';
      i++;
      date[i] = '9';
      i++;
    }
    else {
      date[i] = '2';
      i++;
      date[i] = '0';
      i++;
    }

    while ( year[count] != '\0' ) {
      date[i] = year[count];
      count++;
      i++;
    }
    date[i] = '-';
    i++;
    count = 0;
    while ( day[count] != '\0' ) {
      date[i] = day[count];
      count++;
      i++;
    }
    date[i] = '-';
    i++;
    count = 0;
    while ( month[count] != '\0' ) {
      date[i] = month[count];
      count++;
      i++;
    }
    date[i] = '\0';
  }
}