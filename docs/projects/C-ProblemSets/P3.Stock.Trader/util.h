/**
 * Header file for the util component. Detects overflow in the unsigned long type.
*/

#include <stdio.h>
#include <stdbool.h>

/**
 * Checks for overflow in adding two unsigned long values.
 * @param a unsigned long value one
 * @param b unsigned long value two
 * @return True if the two numbers can be added without an overflow occurring
*/
bool checkAdd( unsigned long a, unsigned long b );

/**
 * Checks for overflow in subtracting two unsigned long values.
 * @param a unsigned long value one
 * @param b unsigned long value two
 * @return True if b can be subtracted from a without an overflow occurring
*/
bool checkSub( unsigned long a, unsigned long b );

/**
 * Checks for overflow in multiplying two unsigned long values.
 * @param a unsigned long value one
 * @param b unsigned long value two
 * @return True if a and b can be multiplied without an overflow occurring
*/
bool checkMul( unsigned long a, unsigned long b );