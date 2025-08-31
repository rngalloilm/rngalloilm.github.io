/**
 * @file trader.c
 * @author Nick Gallo (rngallo)
*/

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "util.h"
#include "account.h"
#include "transaction.h"

/** Index of the account file command-line argument. */
#define ACCOUNT_ARG 1

/** Index of the transacton file command-line argument. */
#define TRANSACT_ARG 2

/** Required number of arguments: trader <account-file> <transaction-file> */
#define REQ_ARGS 3

/**
 * Top-level component
*/
int main( int numArgs, char *cmdArgs[] )
{
  // If wrong # of cmd line args, prompt syntax and exit
  if ( numArgs != REQ_ARGS ) {
    printf( "usage: trader <account-file> <transaction-file>\n" );
    exit( 1 );
  }

  // Get the command line arguments: $ ./trader accounts-1.txt transactions-01.txt
  char accFileName[ AFILE_LIMIT + 1 ];
  char tranFileName[ AFILE_LIMIT + 1 ];


  if (strlen( cmdArgs[ ACCOUNT_ARG ] ) > ( AFILE_LIMIT ) ) {
    printf( "Can't open account file: %s\n", cmdArgs[ ACCOUNT_ARG ] );
    exit( 1 );
  }
  if (strlen( cmdArgs[ TRANSACT_ARG ] ) > ( AFILE_LIMIT ) ) {
    printf( "Can't open transaction file: %s\n", cmdArgs[ TRANSACT_ARG ] );
    exit( 1 );
  }

  strcpy( accFileName, cmdArgs[ ACCOUNT_ARG ] );
  accFileName[ AFILE_LIMIT ] = '\0';
  strcpy( tranFileName, cmdArgs[ TRANSACT_ARG ] );
  tranFileName[ AFILE_LIMIT ] = '\0';

  // account.loadAccounts() from arg 1
  loadAccounts( accFileName );

  // transaction.processTransactions() from arg 2
  processTransactions( tranFileName );

  // account.saveAccounts()
  saveAccounts( accFileName );

  return 0;
}