/** 
  @file encrypt.c
  @author rngallo
  Top level file for encryption.
*/

#include "io.h"
#include "DES.h"
#include <stdlib.h>
#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <string.h>

/**
 * Top level component for encryption.
*/
int main( int argc, char *argv[] )
{
  // Check for the correct number of arguments.
  if ( argc != 4 ) {
    fprintf( stderr, "usage: encrypt <key> <input_file> <output_file>\n" );
    exit( EXIT_FAILURE );
  }

  // Check key length.
  char *keyText = argv[ 1 ];
  if ( strlen( keyText ) > BLOCK_BYTES ) {
    fprintf( stderr, "Key too long\n" );
    exit( EXIT_FAILURE );
  }

  // Open input file.
  FILE *in = fopen( argv[ 2 ], "rb" );
  if ( !in ) {
    perror( argv[ 2 ] );
    exit( EXIT_FAILURE );
  }

  // Open output file.
  FILE *out = fopen( argv[ 3 ], "wb" );
  if ( !out ) {
    perror( argv[ 3 ] );
    fclose( in );
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
  while ( !feof( in ) ) {
    readBlock( in, &block );

    for ( int i = block.len; i < BLOCK_BYTES; i++ ) {
      block.data[ i ] = 0;
    }

    // Encrypt the block.
    encryptBlock( &block, subKeys );

    // Write the encrypted block.
    writeBlock( out, &block );
  }

  // Close files.
  fclose( in );
  fclose( out );

  return 0;
}