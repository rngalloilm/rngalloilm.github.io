/**
 * @file formatter.c
 * @author Nick Gallo (rngallo)
 * Top level component and contains main(). Reads and outputs lines
 * of text until end of input with help from other components.
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "name.h"
#include "date.h"
#include "ssn.h"

/** Birthday for people who will be 21 on the day this assignment is due. */
#define AGE_CUTOFF "2002-09-22"

static void print_summary( int total, int max_name_length, int over_21, int no_ssn ) 
{
  printf( "\nSummary\n%s\n", "-----------------------------------" );
  printf( "%-26s %8d\n", "Total individuals", total );
  printf( "%-26s %8d\n", "Maximum name length", max_name_length );
  printf( "%-26s %8d\n", "Individuals 21 or over", over_21 );
  printf( "%-26s %8d\n", "Individuals without an SS#", no_ssn );
}

int main() 
{
    char name[ FIELD_MAX + 1 ];
    char date[ FIELD_MAX + 1 ];
    char ssn[ FIELD_MAX + 1 ];

    int total_individuals = 0;
    int max_name_length = 0;
    int individuals_over_21 = 0;
    int individuals_without_ssn = 0;

    while (true) {
      if (!read_name(name)) {
        break;
      }

      total_individuals++;

      if ( strlen(name) > max_name_length ) {
        max_name_length = strlen(name);
      }
      read_date(date);
      read_ssn(ssn);
      fix_name(name);
      fix_date(date);
      fix_ssn(ssn);

      // Check if the individual is over 21
      if ( strcmp( date, AGE_CUTOFF ) <= 0 ) {
        individuals_over_21++;
      }

      if ( strcmp( ssn, "N/A" ) == 0 ) {
        individuals_without_ssn++;
      }

      // Print formatted output
      printf( "%-30s %10s %11s\n", name, date, ssn );
    }

    print_summary( total_individuals, max_name_length, individuals_over_21, individuals_without_ssn );

    return 0;
}