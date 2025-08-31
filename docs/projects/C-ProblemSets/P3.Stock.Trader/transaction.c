/**
 * @file transaction.c
 * @author Nick Gallo (rngallo)
*/

#include "transaction.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "util.h"
#include "account.h"

/** Character limit for the transaction type */
#define TRANSAC_LIMIT 4

void processTransactions( char const fname[] )
{
  // Open the input file
  FILE *in = fopen( fname, "r" );
  if ( in == NULL ) {
    fprintf( stderr, "Can't open transaction file: %s\n", fname );
    exit( 1 );
  }

  char accountName[ NAME_LIMIT + 1 ];
  char transactionType[ TRANSAC_LIMIT + 1 ];
  unsigned long sharesCount;
  unsigned long sharesPrice;

  // Process each line in the file
  while ( fscanf( in, "%30s %4s %ld", accountName, transactionType, &sharesCount ) == 3 ) {
    // Check accountName length
    if ( strlen( accountName ) > NAME_LIMIT ) {
      fprintf( stderr, "Invalid transaction file\n" );
      exit( 1 );
    }

    // Read in the share price
    if ( readCurrency( in, &sharesPrice ) ) {
      fprintf( stderr, "Invalid transaction file\n" );
      exit( 1 );
    }

    // Perform transaction based on transaction type
    // Handle buy transaction
    if ( strcmp( transactionType, "sell" ) == 0 ) {

      // Get the account balance
      unsigned long *balancePtr = lookupAccount( accountName );
      unsigned long transactionCents = 0;

      // Check multiplication operation for overflow
      if ( !checkMul( sharesPrice, sharesCount ) ) {
        fprintf( stderr, "Account overflow\n" );
        exit( 1 );
      }
      transactionCents = sharesPrice * sharesCount;

      // Check addition operation for overflow
      if ( !checkAdd( *balancePtr, transactionCents ) ) {
        fprintf( stderr, "Account overflow\n" );
        exit( 1 );
      }

      // Add transaction to balance
      *balancePtr += transactionCents;
    }

    // Handle sell transaction
    else if ( strcmp( transactionType, "buy" ) == 0 ) {
      // Get the account balance
      unsigned long *balancePtr = lookupAccount( accountName );
      unsigned long transactionCents = 0;

      // Check multiplication operation for overflow
      if ( !checkMul( sharesPrice, sharesCount ) ) {
        fprintf( stderr, "Account overflow\n" );
        exit( 1 );
      }

      transactionCents = sharesPrice * sharesCount; 

      // Check subtraction operation for overflow
      if ( !checkSub( *balancePtr, transactionCents ) ) {
        fprintf( stderr, "Account overflow\n" );
        exit( 1 );
      }
      

      // Subtract transaction from balance
      *balancePtr -= transactionCents;
    }

    // Invalid transaction type
    else {
      fprintf( stderr, "Invalid transaction file\n" );
      exit( 1 );
    }
  }

  // Close the file
  fclose( in );
}