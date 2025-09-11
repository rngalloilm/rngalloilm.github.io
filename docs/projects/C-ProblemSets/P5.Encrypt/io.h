/** 
  @file io.h
  @author rngallo
  Header for the IO implementation.
*/

#include "DES.h"
#include <stdlib.h>
#include <stdio.h>

/**
 * Reads up to 8 bytes from the given input file, storing them in the data array of 
 * block and setting the len field to indicate how many bytes have been read.
 * @param fp Source stream.
 * @param block Resulting bytes from the input.
*/
void readBlock( FILE *fp, DESBlock *block );

/**
 * Writes the contents of the data array in block to the given file. 
 * The len field of block indicates how many bytes the block contains.
 * @param fp Source stream.
 * @param block Bytes to be output.
*/
void writeBlock( FILE *fp, DESBlock const *block );