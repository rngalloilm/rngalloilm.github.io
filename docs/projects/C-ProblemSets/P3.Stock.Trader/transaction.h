/**
 * Header file for the transaction component. Reads and processes 
 * all the transactions in the transaction file.
*/

#include <stdio.h>
#include <stdbool.h>

/** Maximum length of an account name. */
#define NAME_LIMIT 30

/**
 * Reads and performs all transactions in the transaction file with 
 * the given name. It uses the account component to update account 
 * balances and detects errors as the transaction file is processed.
 * @param fname File name
*/
void processTransactions( char const fname[] );