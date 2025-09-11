/**
 * Header file for the account component. Reads and maintains the list of account 
 * names and balances and writing the final state of the account file when the program is done.
*/

#include <stdbool.h>
#include <stdio.h>

/** Maximum length of an account name. */
#define NAME_LIMIT 30

/** Limit on the length of an account file. */
#define AFILE_LIMIT 30

/**
 * Reads an amount of currency from the given stream and converts it from dollars to cents, 
 * storing it in the unsigned long pointed to by val. Checks for overflow and correct decimal placement.
 * @param fp file pointer
 * @param val used to store the currency from the file
 * @return True if the input contains an amount of currency in a valid format
*/
bool readCurrency( FILE *fp, unsigned long *val );

/**
 * Uses a list of all account names and a list of balances with 
 * the transaction component to get the balance value for an account and 
 * adjust it based on the current transaction.
 * @param name All account names
 * @return Pointer to the balance value for an account with the given name. Else, NULL
*/
unsigned long *lookupAccount( char const name[ NAME_LIMIT + 1 ] );

/**
 * Loads all the accounts from the file with the given name, detecting 
 * any errors in the filename or the file contents.
 * @param fname File name
*/
void loadAccounts( char fname[ AFILE_LIMIT + 1 ] );

/**
 * Write out the updated balances of all accounts after input processing. It 
 * writes to the next version of the given account file name.
 * @param fname File name
*/
void saveAccounts( char fname[ AFILE_LIMIT + 1 ] );