/**
  @file map.c
  @author Nick Gallo (rngallo)
  Implementation for the map component, a hash map.
*/

#include "map.h"
#include <stdlib.h>

typedef struct MapPairStruct MapPair;

/** Key/Value pair to put in a hash map. */
struct MapPairStruct {
  /** Key part of this node, stored right in the node to improve locality. */
  Value key;
  
  /** Value part of this node, stored right in the node to improve locality. */
  Value val;
  
  /** Pointer to the next node at the same element of this table. */
  MapPair *next;
};

/** Representation of a hash table implementation of a map. */
struct MapStruct {
  /** Table of key / value pairs. */
  MapPair **table;

  /** Length of the table. */
  int tlen;
  
  /** Number of key / value pairs in the map. */
  int size;
};

/**
 * Makes an empty map, initializing its fields and  it.
 * @param len Gives the initial size of the hash table used inside the map.
 * @return Pointer to the dynamically allocated Map.
*/
Map *makeMap( int len )
{
   Map *m = (Map *)malloc( sizeof( Map ) ); // Allocate memory for the Map struct
  m->table = (MapPair **)calloc( len, sizeof( MapPair * ) ); // Allocate and zero-initialize the hash table
  m->tlen = len; // Set the length of the table
  m->size = 0;   // Initialize the size of the map to 0

  return m; // Return the newly created map
}

/**
 * Gets the current number of key / value pairs.
 * @param m Current map.
 * @return Number of key / value pairs.
*/
int mapSize( Map *m )
{
  return m->size; // Return the current size of the map
}

/**
 * Adds (or replaces) the given key / value pair to the given map.
 * @param m Map to add a key/value pair to.
 * @param key Key to add to map.
 * @param val Value to associate with the key.
*/
void mapSet( Map *m, Value *key, Value *val )
{
  unsigned int hash = key->hash( key ); // Compute the hash of the key
  int index = hash % m->tlen;           // Calculate the index in the table

  MapPair *current = m->table[ index ]; // Start at the head of the list at the calculated index
  // Loop to find if the key already exists in the map
  while ( current != NULL ) {
    // If key is found, replace its value and return
    if ( current->key.equals( &current->key, key ) ) {
      current->val.empty( &current->val ); // Free the old value
      key->move( val, &current->val );     // Move the new value into place

      return; // Exit the function after replacing the value
    }

    current = current->next; // Move to the next MapPair in the list
  }

  // Code for inserting a new key/value pair if the key was not found
  MapPair *newPair = (MapPair *)malloc( sizeof( MapPair ) ); // Allocate memory for a new MapPair
  key->move( key, &newPair->key ); // Move the key into the new pair
  val->move( val, &newPair->val ); // Move the value into the new pair
  newPair->next = m->table[ index ]; // Insert the new pair at the head of the list
  m->table[ index ] = newPair;       // Update the head of the list
  m->size++; // Increment the size of the map
}

/**
 * Returns the value associated with the given key.
 * @param m Map to query.
 * @param key Key to look for in the map.
 * @return Value associated with the given key, or NULL if the key isn't in the map.
*/
Value *mapGet( Map *m, Value *key )
{
  unsigned int hash = key->hash( key ); // Compute the hash of the key
  int index = hash % m->tlen;           // Calculate the index in the table

  MapPair *current = m->table[ index ]; // Start at the head of the list at the calculated index
  // Loop to find the key in the map
  while ( current != NULL ) {
    if ( current->key.equals( &current->key, key ) ) {
      return &current->val; // Return the value if the key is found
    }

    current = current->next; // Move to the next MapPair in the list
  }

  return NULL; // Return NULL if the key is not found
}

/**
 * Removes the key / value pair for the given key from the map.
 * @param m Map to remove a key from.
 * @param key Key to look for and remove in the map.
 * @return True if there was a matching key in the map.
*/
bool mapRemove( Map *m, Value *key )
{
  unsigned int hash = key->hash( key ); // Compute the hash of the key
  int index = hash % m->tlen;           // Calculate the index in the table

  MapPair *current = m->table[ index ]; // Start at the head of the list at the calculated index
  MapPair *prev = NULL;                 // Keep track of the previous MapPair

  // Loop to find the key in the map
  while ( current != NULL ) {
    // If the key is found, remove the MapPair from the list
    if ( current->key.equals( &current->key, key ) ) {
      // Handle the case where the MapPair is not at the head of the list
      if ( prev != NULL ) {
        prev->next = current->next;
      } else {
        m->table[ index ] = current->next; // Update the head of the list if the MapPair is at the head
      }

      // Free the key and value in the MapPair and then free the MapPair itself
      current->key.empty( &current->key );
      current->val.empty( &current->val );
      free( current );
      m->size--; // Decrement the size of the map

      return true; // Return true indicating that the key was found and removed
    }
    prev = current; // Update the previous MapPair
    current = current->next; // Move to the next MapPair in the list
  }

  return false; // Return false indicating that the key was not found
}

/**
 * Frees all the memory used to store the given map.
 * @param m The map to free.
*/
void freeMap( Map *m )
{
  // Loop through each bucket of the hash table
  for ( int i = 0; i < m->tlen; i++ ) {
    MapPair *current = m->table[ i ]; // Start at the head of the list in the current bucket

    // Loop to free each MapPair in the list
    while ( current != NULL ) {
      MapPair *next = current->next; // Store the next MapPair

      // Free the key and value in the current MapPair and then free the MapPair itself
      current->key.empty( &current->key );
      current->val.empty( &current->val );
      free( current );

      current = next; // Move to the next MapPair in the list
    }
  }

  // Free the hash table and then the Map struct itself
  free( m->table );
  free( m );
}