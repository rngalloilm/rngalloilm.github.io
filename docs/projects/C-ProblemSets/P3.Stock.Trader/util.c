/**
 * @file util.c
 * @author Nick Gallo (rngallo)
*/

#include "util.h"
#include <limits.h>

// Checking for overflow: The result can never be greater than ULONG_MAX.
// Under addition: (ULONG_MAX - a) < b will cause overflow
// Under subtraction: (a - b) < 0 will cause overflow
// Under multiplication: Find x = ULONG_MAX / a. If b > x it will cause overflow

bool checkAdd( unsigned long a, unsigned long b )
{
  // Get the number b must be less than
  unsigned long buffer = ULONG_MAX - a;
  
  // Valid if b is within the bounds
  if ( b <= buffer ) {
    return true;
  }

  return false;
}

bool checkSub( unsigned long a, unsigned long b )
{
  // Check if the result of a - b would be negative
  return a >= b ? true : false;
}

bool checkMul( unsigned long a, unsigned long b )
{
  // buffer is the most b a can be multiplied by
  unsigned long buffer = 0;
  if ( a != 0 ) {
    buffer = ULONG_MAX / a;
  }
  else {
    return true;
  }

  if ( b <= buffer ) {
    return true;
  }

  return false;
}