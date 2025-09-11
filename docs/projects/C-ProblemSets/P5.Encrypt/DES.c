/** 
  @file DES.c
  @author rngallo
  Implementation of the DES algorithm.
*/

#include "DES.h"
#include <stdlib.h>
#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <string.h>

/** Number of bytes in the rotate data array */
#define NUM_BYTES_IN_28 4

/** End of the 28 bits */
#define END_28_BITS 28

void prepareKey( byte key[ BLOCK_BYTES ], char const *textKey ) 
{
  // Ensure the text key is not too long.
  if ( strlen( textKey ) > BLOCK_BYTES ) {
    printf( "Key too long\n" );
    exit( EXIT_FAILURE );
  }

  // Copy characters of textKey to key array.
  for ( size_t i = 0; i < BLOCK_BYTES; ++i ) {
    if ( i < strlen( textKey ) )
      key[ i ] = ( byte )textKey[ i ];
    else
      key[ i ] = 0;
  }
}

int getBit( byte const data[], int idx )
{
  // Adjust for the idx starting at 1.
  idx -= 1;

  // Calculate which byte and bit in the byte to access.
  int byteIdx = idx / BYTE_SIZE;
  int bitIdx = idx % BYTE_SIZE;

  // Create a mask for the bit we want to get.
  byte mask = 1 << ( ( BYTE_SIZE - 1 ) - bitIdx );

  // Apply the mask and return the result.
  return ( data[ byteIdx ] & mask ) != 0;
}

void putBit( byte data[], int idx, int val )
{
  // Adjust for the idx starting at 1.
  idx -= 1;

  // Calculate which byte and bit in the byte to access.
  int byteIdx = idx / BYTE_SIZE;
  int bitIdx = idx % BYTE_SIZE;

  // Create a mask for the bit we want to modify.
  byte mask = 1 << ( ( BYTE_SIZE - 1 ) - bitIdx );

  // Set or clear the bit as per the value of 'val'.
  if ( val ) {
    // Set the bit.
    data[ byteIdx ] |= mask;
  } 
  else {
    // Clear the bit
    data[ byteIdx ] &= ~mask;
  }
}

/**
 * Helper function to rotate a 28-bit value stored in a byte array to the left by a given number of bits.
 * @param data Byte array containing the 28-bit value.
 * @param shift Number of bits to rotate.
 */
static void rotateLeft( byte data[], int shift ) {
  for ( int i = 0; i < shift; i++ ) {
    // Get the first bit of each byte.
    int group[ NUM_BYTES_IN_28 ];
    group[ 0 ] = getBit( data, 1 );
    group[ 1 ] = getBit( data, BYTE_SIZE + 1 );
    group[ 2 ] = getBit( data, ( BYTE_SIZE * 2 ) + 1 );
    group[ 3 ] = getBit( data, ( BYTE_SIZE * 3 ) + 1 );

    // Left shift each byte and the right's first bit into the left byte.
    for ( int j = 1; j < NUM_BYTES_IN_28; j++ ) {
      data[ j - 1 ] = data[ j - 1 ] << 1;
      putBit( data, ( BYTE_SIZE * j ), group[ j ] );
    }

    // Put the bit that got rotated at the end
    data[ NUM_BYTES_IN_28 - 1 ] = data[ NUM_BYTES_IN_28 - 1 ] << 1;
    putBit( data, END_28_BITS, group[ 0 ] );
  }
}

void permute( byte output[], byte const input[], int const perm[], int n )
{
  // Zero the output array.
  // Calculate the number of bytes needed in the output.
  int outputBytes = ( n + ( BYTE_SIZE - 1 ) ) / BYTE_SIZE;
  for ( int i = 0; i < outputBytes; i++ ) {
    output[ i ] = 0;
  }

  // Copying bits
  for ( int i = 0; i < n; i++ ) {
    // Find the position of the bit in the input array.
    // Adjust index since perm counts from 1.
    int inBitIdx = perm[ i ] - 1;
    int inByteIdx = inBitIdx / BYTE_SIZE;
    int inBitPos = inBitIdx % BYTE_SIZE;

    // Extract the bit.
    byte bit = ( input[ inByteIdx ] >> ( BYTE_SIZE - 1 - inBitPos ) ) & 1;

    // Place the bit in the output array.
    int outBitIdx = i;
    int outByteIdx = outBitIdx / BYTE_SIZE;
    int outBitPos = outBitIdx % BYTE_SIZE;

    // Set the bit in the output.
    output[ outByteIdx ] |= ( bit << ( BYTE_SIZE - 1 - outBitPos ) );
  }

  // Handle remaining bits if n isn't a multiple of 8.
  if ( n % BYTE_SIZE != 0 ) {
    int lastByteBits = n % BYTE_SIZE;
    output[ outputBytes - 1 ] &= ( 0xFF << ( BYTE_SIZE - lastByteBits ) );
  }
}

// /**
//  * Helper function to help debug.
//  * @param data Byte array.
//  * @param bcount Bit count.
// */
// static void printBits( byte const data[], int bcount )
// {
//   for ( int i = 1; i <= bcount; i++ )
//     printf( "%c", getBit( data, i ) ? '1' : '0' );
//   printf( "\n" );
// }

void generateSubkeys( byte K[ ROUND_COUNT ][ SUBKEY_BYTES ], byte const key[ BLOCK_BYTES ] )
{
  byte C[ SUBKEY_HALF_BYTES ] = {0};
  byte D[ SUBKEY_HALF_BYTES ] = {0};

  // Initial permutation on the key to get C0 and D0.
  permute( C, key, leftSubkeyPerm, SUBKEY_HALF_BITS );
  permute( D, key, rightSubkeyPerm, SUBKEY_HALF_BITS );

  // Generate the 16 subkeys.
  for ( int round = 1; round <= ROUND_COUNT; ++round ) {
    // Rotate according to the schedule.
    rotateLeft( C, subkeyShiftSchedule[ round ] );
    rotateLeft( D, subkeyShiftSchedule[ round ] );

    // Combine C and D.
    byte combined[ SUBKEY_HALF_BYTES * 2 ] = {0}; 
    for ( int i = 0; i < SUBKEY_HALF_BITS + 1; i++ ) {
      putBit( combined, i, getBit( C, i ) );
      putBit( combined, i + SUBKEY_HALF_BITS, getBit( D, i ) );
    }

    // Apply the final permutation to get the subkey.
    permute( K[ round ], combined, subkeyPerm, SUBKEY_BITS );
  }
}

void sBox( byte output[ 1 ], byte const input[ SUBKEY_BYTES ], int idx )
{
  // Calculate the starting bit position in 'input' for the S-Box.
  int startPos = ( idx * SBOX_INPUT_BITS ) + 1;

  // Extract the 6-bit section for this S-Box.
  int row = ( getBit ( input, startPos ) << 1 ) | getBit( input, startPos + ( SBOX_INPUT_BITS - 1 ) );
  int col = ( getBit( input, startPos + 1 ) << 3 ) | 
            ( getBit( input, startPos + 2 ) << 2 ) | 
            ( getBit( input, startPos + 3 ) << 1 ) | 
            getBit( input, startPos + 4 );

  // Lookup the value in the S-Box table.
  byte sBoxValue = sBoxTable[ idx ][ row ][ col ];

  // Store the result in the high-order bits of output[0].
  output[ 0 ] = sBoxValue << ( BYTE_SIZE - SBOX_OUTPUT_BITS );
}

void fFunction( byte result[ BLOCK_HALF_BYTES ], byte const R[ BLOCK_HALF_BYTES ], byte const K[ SUBKEY_BYTES ] )
{
  byte expandedR[ SUBKEY_BYTES ];
  byte combined[ SUBKEY_BYTES ];
  byte sboxOutput[ SBOX_COUNT / 2 ] = {0};

  // Expansion: Expand R to 48 bits.
  permute( expandedR, R, expandedRSelector, SUBKEY_BITS );

  // Combination: XOR expanded R with the subkey.
  for ( int i = 0; i < SUBKEY_BYTES; ++i ) {
    combined[ i ] = expandedR[ i ] ^ K[ i ];
  }

  // S-Box Transformation: Process the combined data through S-Boxes.
  for ( int i = 0; i < SBOX_COUNT; ++i ) {
    byte sBoxResult[ 1 ];
    sBox( sBoxResult, combined, i );

    for ( int j = 0; j < SBOX_OUTPUT_BITS; ++j ) {
      putBit( sboxOutput, ( i * SBOX_OUTPUT_BITS ) + j + 1, getBit( sBoxResult, j + 1 ) );
    }
  }

  // Permutation: Apply the fFunction permutation.
  permute( result, sboxOutput, fFunctionPerm, BLOCK_HALF_BITS );
}

void encryptBlock( DESBlock *block, byte const K[ ROUND_COUNT ][ SUBKEY_BYTES ] )
{
  byte leftHalf[ BLOCK_HALF_BYTES ];
  byte rightHalf[ BLOCK_HALF_BYTES ];
  byte tempHalf[ BLOCK_HALF_BYTES ];

  // Initial Permutation: Split the block into two halves.
  permute( leftHalf, block->data, leftInitialPerm, BLOCK_HALF_BITS );
  permute( rightHalf, block->data, rightInitialPerm, BLOCK_HALF_BITS );

  // Perform 16 rounds of encryption.
  for ( int round = 1; round < ROUND_COUNT; round++ ) {
    // Copy right half to temp.
    memcpy( tempHalf, rightHalf, BLOCK_HALF_BYTES );

    // Apply fFunction on rightHalf with subkey and XOR with leftHalf.
    fFunction( rightHalf, rightHalf, K[ round ] );
    for ( int i = 0; i < BLOCK_HALF_BYTES; i++ ) {
      rightHalf[ i ] ^= leftHalf[ i ];
    }

    // Copy tempHalf to leftHalf for next round.
    memcpy( leftHalf, tempHalf, BLOCK_HALF_BYTES );
  }

  // Recombine the halves in reverse order: R16L16.
  byte recombinedBlock[ BLOCK_BYTES ];
  for ( int i = 0; i < BLOCK_HALF_BYTES; i++ ) {
    recombinedBlock[ i ] = rightHalf[ i ];
    recombinedBlock[ i + BLOCK_HALF_BYTES ] = leftHalf[ i ];
  }

  // Final Permutation.
  permute( block->data, recombinedBlock, finalPerm, BLOCK_BITS );
}

void decryptBlock( DESBlock *block, byte const K[ ROUND_COUNT ][ SUBKEY_BYTES ] )
{
  byte leftHalf[ BLOCK_HALF_BYTES ];
  byte rightHalf[ BLOCK_HALF_BYTES ];
  byte tempHalf[ BLOCK_HALF_BYTES ];

  // Initial Permutation: Split the block into two halves.
  permute( leftHalf, block->data, leftInitialPerm, BLOCK_HALF_BITS );
  permute( rightHalf, block->data, rightInitialPerm, BLOCK_HALF_BITS );

  // Perform 16 rounds of decryption (using subkeys in reverse order).
  for ( int round = ( ROUND_COUNT - 1 ); round >= 1; round-- ) {
    // Copy right half to temp.
    memcpy( tempHalf, rightHalf, BLOCK_HALF_BYTES );

    // Apply fFunction on rightHalf with subkey and XOR with leftHalf.
    fFunction( rightHalf, rightHalf, K[ round ] );
    for ( int i = 0; i < BLOCK_HALF_BYTES; i++ ) {
      rightHalf[ i ] ^= leftHalf[ i ];
    }

    // Copy tempHalf to leftHalf for next round.
    memcpy( leftHalf, tempHalf, BLOCK_HALF_BYTES );
  }

  // Recombine the halves in reverse order: R16L16.
  byte recombinedBlock[ BLOCK_BYTES ];
  for ( int i = 0; i < BLOCK_HALF_BYTES; i++ ) {
    recombinedBlock[ i ] = rightHalf[ i ];
    recombinedBlock[ i + BLOCK_HALF_BYTES ] = leftHalf[ i ];
  }

  // Final Permutation.
  permute( block->data, recombinedBlock, finalPerm, BLOCK_BITS );
}