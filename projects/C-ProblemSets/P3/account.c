/**
 * @file account.c
 * @author Nick Gallo (rngallo)
*/

#include "account.h"
#include <stdlib.h>
#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <string.h>
#include <math.h>
#include <limits.h>
#include "util.h"

/** Number of accounts supported by the program. */
#define ACCOUNT_LIMIT 100000

/** Number of indecies used by ".txt" */
#define FNAME_SUFFIX 4

// Static global variables for account names and balances
static char accountNames[ ACCOUNT_LIMIT ][ NAME_LIMIT + 1 ];
static unsigned long accountBalances[ ACCOUNT_LIMIT ];

/**
 * Check if the character is a digit.
 * @param ch character value
 * @return true if the value is a digit
*/
static bool isDigit( char ch ) {
  return ( ch >= '0' && ch <= '9' );
}

/**
 * Check if the character is a letter.
 * @param ch character value
 * @return true if the value is a letter
*/
static bool isLetter(char ch) {
  return ( ( ch >= 'a' && ch <= 'z' ) || ( ch >= 'A' && ch <= 'Z' ) );
}

/**
 * Convert the character to an unsigned long.
 * @param ch character value
 * @return unsigned long value
*/
static unsigned long charToDigit( char ch ) {
  return ( unsigned long )( ch - '0' );
}

bool readCurrency( FILE *fp, unsigned long *val )
{
  unsigned long value = 0;
  unsigned long cents = 0;
  bool hasDecimal = false;
  int decimalPlaces = 0;

  char ch = fgetc( fp );

  // Skip non digit characters and whitespace
  while ( !isDigit( (char)ch ) && ch != EOF ) {
    ch = fgetc( fp );
  }

  // Start getting the digits
  while ( isDigit( (char)ch ) || ( ch == '.' && !hasDecimal ) ) {
    if ( ch == '.' ) {
      hasDecimal = true;

      // Move to the next character after the decimal point
      ch = fgetc( fp );
      continue;
    }

    if ( hasDecimal ) {
      if ( decimalPlaces < 2 ) {
        cents = cents * 10 + charToDigit( ch );
        decimalPlaces++;
      } 
      
      else {
        // Too many decimal places
        fprintf( stderr, "Invalid account file\n" );
        exit( 1 );
      }
    } 
    
    else {
      unsigned long d = charToDigit( ch );

      if ( !checkMul( value, 10 ) || !checkAdd( value * 10, d ) ) {
        // Overflow while multiplying or adding
        return false;
      }

      value = value * 10 + d;
    }

    ch = fgetc( fp );
  }

  if ( !hasDecimal ) {
    *val = value;
  } 
  
  else {
    if ( decimalPlaces != 2 ) {
      fprintf( stderr, "Invalid account file\n" );
      exit( 1 );
    }

    if ( !checkAdd( value * 100, cents ) ) {
      // Overflow while adding cents
      return false;
    }

    *val = value * 100 + cents;
  }

  if ( ch == EOF ) {
    if ( hasDecimal ) {
      // If the file ends after reading a partial decimal number, it's an error
      return false;
    }

    *val = value;

    return true;
  }

  // Non digit character encountered
  return false;
}

unsigned long *lookupAccount( char const name[ NAME_LIMIT + 1 ] )
{
  for ( int i = 0; i < ACCOUNT_LIMIT; i++ ) {
    if ( strcmp( accountNames[ i ], name ) == 0 ) {
      // Account with the given name found, return a pointer to its balance
      return &accountBalances[ i ];
    }

    // Stop iterating when we reach the end of the accounts
    if ( accountNames[ i ][ 0 ] == '\0' ) {
      break;
    }
  }

  // Account not found, return NULL
  return 0;
}

void loadAccounts( char fname[ AFILE_LIMIT + 1 ] )
{
  bool checkVersion = false;
  char version;
  int len = 0;

  // Check the format of the file name before the ".txt"
  for ( int i = 0; fname[ i ] != '.'; i++ ) {
    // Can only be letters, digits, and a dash
    if ( !isLetter( fname[ i ] ) && !isDigit( fname[ i ] ) && fname[ i ] != '-' ) {
      fprintf( stderr, "Can't open account file: %s\n", fname );
      exit( 1 );
    }

    // Get the first digit of the version number after the '-'
    if ( checkVersion == true ) {
      version = fname[ i ];

      checkVersion = false;
    }

    if ( fname[ i ] == '-' ) {
      checkVersion = true;
    }

    len++;
  }

  // No more than 30 characters, checked in main(). Version n ("filename-n") increments
  // on output so if n = 9, length must be < 29
  if ( version == '9' && len > ( AFILE_LIMIT - FNAME_SUFFIX - 1 ) ) {
    fprintf( stderr, "Invalid account file name: %s\n", fname );
    exit( 1 );
  }

  // Open the input file
  FILE *in = fopen( fname, "r" );

  // Skipping whitespace, store a name (30 char max) and a converted number value
  int accountCount = 0;
  char name[ NAME_LIMIT + 1 ];
  unsigned long balance;

  while ( fscanf( in, "%30s", name ) == 1 ) {
    // Check if number of accounts is over limit
    if ( accountCount >= ACCOUNT_LIMIT ) {
      fprintf( stderr, "Invalid account file\n" );
      exit( 1 );
    }

    // Check if the account name exceeds the limit
    if ( strlen( name ) >= NAME_LIMIT ) {
      fprintf( stderr, "Invalid account file\n" );
      exit( 1 );
    }

    strcpy( accountNames[ accountCount ], name );

    // Get number as cents type unsigned long
    if ( readCurrency( in, &balance ) ) {
      fprintf( stderr, "Invalid account file\n" );
      exit( 1 );
    }
    
    accountBalances[accountCount] = balance;
    accountCount++;
  }

  // Add a null term to the row after the last recorded name
  accountNames[ accountCount ][ 0 ] = '\0';

  // Close the file
  fclose( in );
}

void saveAccounts( char fname[ AFILE_LIMIT + 1 ] )
{
  // Find the position of the dash '-' in the file name
  char *dashPos = strrchr( fname, '-' );

  // If the dash is found, increment the version number
  if ( dashPos != NULL ) {
    // Get the version number following the dash
    char *versionStr = dashPos + 1;

    // Check if the versionStr is a valid number
    if ( !isdigit( *versionStr ) ) {
      // Handle the case where versionStr is not a valid number
      fprintf( stderr, "Invalid account file name: %s\n", fname );
      exit( 1 );
    }

    int version = atoi(versionStr);
    version++;

    // Update the version in the filename
    sprintf(dashPos, "-%d.txt", version);
  }

  // If no dash is found, create a new filename with version 1
  else {
    strcat( fname, "-1.txt" );
  }

  // Open the file for writing
  FILE *file = fopen( fname, "w" );
  if ( file == NULL ) {
    fprintf( stderr, "Invalid account file\n" );
    exit( 1 );
  }

  // Write out the updated balances of all accounts
  for ( int i = 0; i < ACCOUNT_LIMIT; i++ ) {
    if ( accountNames[ i ][ 0 ] == '\0' ) {
      // End of data
      break;
    }

    // Print the new accounts to the incremented file version
    unsigned long decimal = accountBalances[ i ] % 100;
    unsigned long whole = accountBalances[ i ] / 100;

    fprintf( file, "%-30s %18lu.%02lu\n", accountNames[ i ], whole, decimal );
  }

  // Close the file
  fclose( file );
}