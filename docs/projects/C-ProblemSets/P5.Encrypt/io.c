/** 
  @file io.c
  @author rngallo
  Input and output for blocks.
*/

#include "io.h"
#include <stdlib.h>
#include <stdio.h>

/**
 * Reads up to 8 bytes from the given input file, storing them in the data array of 
 * block and setting the len field to indicate how many bytes have been read.
 * @param fp Source stream.
 * @param block Resulting bytes from the input.
*/
void readBlock( FILE *fp, DESBlock *block )
{
  // Read up to 8 bytes from the file.
  size_t bytesRead = fread( block->data, sizeof( byte ), BLOCK_BYTES, fp );

  // Set the length in the block.
  block->len = ( int )bytesRead;  
}

/**
 * Writes the contents of the data array in block to the given file. 
 * The len field of block indicates how many bytes the block contains.
 * @param fp Source stream.
 * @param block Bytes to be output.
*/
void writeBlock( FILE *fp, DESBlock const *block )
{
  // Write the number of bytes indicated by the len field of the block to the file.
  fwrite( block->data, sizeof( byte ), block->len, fp );
}