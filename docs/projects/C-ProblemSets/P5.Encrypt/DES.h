/** 
  @file DES.h
  @author rngallo
  Header for the DES Implementation.
*/

#include "DESMagic.h"
#include <stdlib.h>
#include <stdio.h>

/** Exit failure */
#define EXIT_FAILURE 1

/** Number of bits in a byte. */
#define BYTE_SIZE 8

/** Round a number of bits up to the nearest number of bytes needed 
    to store that many bits. */
#define ROUND_TO_BYTES( bits ) (((bits) + BYTE_SIZE - 1)/BYTE_SIZE)

/** Number of bytes in a DES block. */
#define BLOCK_BYTES ROUND_TO_BYTES( BLOCK_BITS )

/** Number of bytes in the left or right halves of a block (L and R). */
#define BLOCK_HALF_BYTES ROUND_TO_BYTES( BLOCK_HALF_BITS )

/** Number of bytes to store the left-side and right-side values (C
    and D) used to create the subkeys. */
#define SUBKEY_HALF_BYTES ROUND_TO_BYTES( SUBKEY_HALF_BITS )

/** Number of bytes to store a whole subkey (K_1 .. K_16). */
#define SUBKEY_BYTES ROUND_TO_BYTES( SUBKEY_BITS )

#ifndef DESBLOCK_H
#define DESBLOCK_H

#include "DESMagic.h"

/** Type used to represent a block to encrypt or decrypt with DES. */
typedef struct {
  /** Sequence of bytes in the block. */
  byte data[ BLOCK_BYTES ];

  /** Number of bytes currently in the data array (e.g., the last block in a file could
    be shorter. */
  int len;
} DESBlock;

#endif

/**
 * Checks the given text key to make sure it’s not too long. It copies the characters of 
 * this key from textKey to the key array and pads with zero bytes up to the length of a DES block.
 * @param key Byte version of the key.
 * @param textKey Text version of the key.
*/
void prepareKey( byte key[ BLOCK_BYTES ], char const *textKey );

/**
 * Gets the bit at index idx in the given the byte string.
 * @param data Block of bytes.
 * @param idx Index of the retrieved bit.
 * @return Zero or one based on the value of the retrieved bit.
*/
int getBit( byte const data[], int idx );

/**
 * Clears (if val is zero) or sets (if val is one) the bit at index idx of the data array.
 * @param data Block of bytes.
 * @param idx Index of the retrieved bit.
 * @param val Clears (if 0) or sets (if 1) the bit at idx.
*/
void putBit( byte data[], int idx, int val );

/**
 * Copies n bits from the given input array to output selected by the first n elements of perm.
 * If n isn’t multiple of 8, then this function should set any remaining bits in the last byte to zero.
 * @param output Destination of copied bits.
 * @param input Source of bits.
 * @param perm Selects the bits to be copied from input. 
 * @param n Determines if the bits past the last are 0.
*/
void permute( byte output[], byte const input[], int const perm[], int n );

/**
 * Computes 16 subkeys based on the input key and stores each one in an element of the given K array.
 * The resulting subkeys are stored in K[ 1 ] .. K[ 16 ]. Element zero of the subkey array isn’t used.
 * @param K Destination for 16 subkeys.
 * @param key Source key, determines the subkeys.
*/
void generateSubkeys( byte K[ ROUND_COUNT ][ SUBKEY_BYTES ], byte const key[ BLOCK_BYTES ] );

/**
 * S-Box calculation in the four high-order bits of output[ 0 ].
 * @param output 4 bit value found at table/row/col of sBoxTable.
 * @param input B is 8 blocks of 6 bits.
 * @param idx Value ranges from 0 to 7, determines starting bit position and sBoxTable.
*/
void sBox( byte output[ 1 ], byte const input[ SUBKEY_BYTES ], int idx );

/**
 * Computes the f function based on the given 32-bit value R and the given 48-bit subkey, S. 
 * @param result Computaion of the f function.
 * @param R 32 bit value.
 * @param K 48 bit subkey.
*/
void fFunction( byte result[ BLOCK_HALF_BYTES ], byte const R[ BLOCK_HALF_BYTES ], byte const K[ SUBKEY_BYTES ] );

/**
 * Encrypt operation on the byte array in block, using the subkeys in the K array.
 * @param block Byte block being modified.
 * @param K 16 subkeys.
*/
void encryptBlock( DESBlock *block, byte const K[ ROUND_COUNT ][ SUBKEY_BYTES ] );

/**
 * Decrypt operation on the byte array in block, using the subkeys in the K array.
 * @param block Byte block being modified.
 * @param K 16 subkeys.
*/
void decryptBlock( DESBlock *block, byte const K[ ROUND_COUNT ][ SUBKEY_BYTES ] );