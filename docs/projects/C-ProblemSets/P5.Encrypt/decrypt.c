/** 
  @file decrypt.c
  @author rngallo
  Top level file for decryption.
*/

#include "io.h"
#include "DES.h"
#include <stdlib.h>
#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <string.h>

/**
 * Top level component for decryption.
*/
int main( int argc, char *argv[] )
{
  // Check for the correct number of arguments.
  if ( argc != 4 ) {
    fprintf( stderr, "usage: decrypt <key> <input_file> <output_file>\n" );
    exit( EXIT_FAILURE );
  }

  // Check key length.
  char *keyText = argv[ 1 ];
  if ( strlen( keyText ) > BLOCK_BYTES ) {
    fprintf( stderr, "Key too long\n" );
    exit( EXIT_FAILURE );
  }

  // Open input file.
  FILE *inputFile = fopen( argv[ 2 ], "rb" );
  if ( !inputFile ) {
    perror( argv[ 2 ] );
    exit( EXIT_FAILURE );
  }

  // Open output file.
  FILE *outputFile = fopen( argv[ 3 ], "wb" );
  if ( !outputFile ) {
    perror( argv[ 3 ] );
    fclose( inputFile );
    exit( EXIT_FAILURE );
  }

  // Prepare the key.
  byte key[ BLOCK_BYTES ];
  prepareKey( key, keyText );

  // Generate subkeys.
  byte subKeys[ ROUND_COUNT ][ SUBKEY_BYTES ];
  generateSubkeys( subKeys, key );

  // Read, encrypt, and write each block.
  DESBlock block;
  while ( !feof( inputFile ) ) {
    readBlock( inputFile, &block );

    // Decrypt the block.
    decryptBlock( &block, subKeys );

    // Write the encrypted block.
    writeBlock( outputFile, &block );
  }

  // Close files.
  fclose( inputFile );
  fclose( outputFile );

  return 0;
}