#define _GNU_SOURCE

#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <unistd.h>
#include <sys/syscall.h>

static void usage() {
  printf( "usage: maxpalindrome <workers>\n" );
  printf( "       maxpalindrome <workers> report\n" );
  exit( 1 );
}

typedef struct {
  int startIdx;
  int workers;
  int maxLen;
  char *maxPalin;
  bool report;
} ThreadData;

char *vList;
int vCount = 0;
int vCap = 0;

void readList() {
  // Set up initial list and capacity.
  vCap = 5;
  vList = ( char * ) malloc( vCap * sizeof( char ) );

  // Keep reading as many values as we can.
  char v;
  while ( scanf( "%c\n", &v ) == 1 ) {
    // Grow the list if needed.
    if ( vCount >= vCap ) {
      vCap *= 2;
      vList = (char *) realloc( vList, vCap * sizeof( char ) );
    }

    // Store the latest value in the next array slot.
    vList[ vCount++ ] = v;
  }
}

bool checkPalindrome(int i, int j) {
  while ( i < j ) {
    if ( vList[ i ] != vList[ j ] ) {
      return false;
    }

    i++;
    j--;
  }

  return true;
}

void *workerFunction( void *arg ) {
  ThreadData *data = ( ThreadData * )arg;
  int maxLen = 0;
  char *maxPalin = NULL;

  // Determine the segment of work for each thread
  int segmentSize = vCount / data->workers;
  int start = data->startIdx * segmentSize;
  int end = ( data->startIdx == data->workers - 1 ) ? vCount : ( start + segmentSize );

  for ( int i = start; i < end; i++ ) {
    for ( int j = i; j < vCount; j++ ) {
      if ( checkPalindrome( i, j ) ) {
        int len = j - i + 1;

        if ( len > maxLen ) {
          maxLen = len;
          maxPalin = &vList[ i ];
        }
      }
    }
  }

  data->maxLen = maxLen;
  data->maxPalin = maxPalin;

  if ( data->report ) {
    pid_t threadId = syscall( __NR_gettid );
    printf( "I'm thread %d. Max length found: %d. Sequence is: %.*s.\n", threadId, maxLen, maxLen, maxPalin );
  }

  return NULL;
}

int main( int argc, char *argv[] ) {
  bool report = false;
  int workers;

  // Parse command-line arguments.
  if ( argc < 2 || argc > 3 )
    usage();

  if ( sscanf( argv[ 1 ], "%d", &workers ) != 1 || workers < 1 )
    usage();

  // If there's a second argument, it better be the word, report
  if ( argc == 3 ) {
    if ( strcmp( argv[ 2 ], "report" ) != 0 )
      usage();
    report = true;
  }

  readList();

  pthread_t threads[ workers ];
  ThreadData data[ workers ];

  for ( int w = 0; w < workers; w++ ) {
    data[ w ].startIdx = w;
    data[ w ].workers = workers;
    data[ w ].report = report;

    pthread_create( &threads[ w ], NULL, workerFunction, &data[ w ] );
  }

  int finalMaxLen = 0;
  
  for ( int w = 0; w < workers; w++ ) {
    pthread_join( threads[ w ], NULL );

    if ( data[ w ].maxLen > finalMaxLen ) {
      finalMaxLen = data[ w ].maxLen;
    }
  }

  printf( "Maximum Length: %d\n", finalMaxLen );

  free( vList );

  return 0;
}
