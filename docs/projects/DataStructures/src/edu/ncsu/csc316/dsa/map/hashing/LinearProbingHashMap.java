package edu.ncsu.csc316.dsa.map.hashing;

import edu.ncsu.csc316.dsa.map.Map;

/**
 * The LinearProbingHashMap is implemented as a hash table that uses linear
 * probing for collision resolution.
 * 
 * The hash map uses a multiply-and-divide compression strategy for calculating
 * hash functions. The hash map ensures expected O(1) performance of
 * {@link Map#put}, {@link Map#get}, and {@link Map#remove}.
 * 
 * The hash table resizes if the load factor exceeds 0.5.
 * 
 * The LinearProbingHashMap class is based on the implementation developed for
 * use with the textbook:
 *
 * Data Structures and Algorithms in Java, Sixth Edition Michael T. Goodrich,
 * Roberto Tamassia, and Michael H. Goldwasser John Wiley and Sons, 2014
 * 
 * @author Dr. King
 * @author // Your Name Here 
 *
 * @param <K> the type of keys stored in the hash map
 * @param <V> the type of values associated with keys in the hash map
 */
public class LinearProbingHashMap<K, V> extends AbstractHashMap<K, V> {

    private TableEntry<K, V>[] table;
    private int size;

    /**
     * Constructs a new linear probing hash map that uses natural ordering of keys
     * when performing comparisons. The created hash table uses the
     * {@link AbstractHashMap#DEFAULT_CAPACITY}
     */
    public LinearProbingHashMap() {
        this(AbstractHashMap.DEFAULT_CAPACITY);
    }

    /**
     * Constructs a new linear probing hash map that uses natural ordering of keys
     * when performing comparisons. The created hash table is initialized to have
     * the provided capacity.
     * 
     * @param capacity the initial capacity of the hash table
     */
    public LinearProbingHashMap(int capacity) {
        this(capacity, false);
    }

    /**
     * FOR TESTING PURPOSES ONLY! Constructs a new linear probing hash map that uses
     * natural ordering of keys when performing comparisons. The created hash table
     * is initialized to have the provided capacity.
     * 
     * @param capacity  the initial capacity of the hash table
     * @param isTesting if true, the hash table uses a predictable series of random
     *                  values for deterministic and repeatable testing
     */
    public LinearProbingHashMap(int capacity, boolean isTesting) {
        super(capacity, isTesting);
        size = 0;
    }

    @Override
    public Iterable<Entry<K, V>> entrySet() {
        EntryCollection collection = new EntryCollection();
        
        for (int i = 0; i < table.length; i++) {
            if (table[i] != null && !table[i].isDeleted()) {
                // Add the entry to the collection if it is not marked as deleted
                collection.add(table[i]);
            }
        }
        
        return collection;
    }

    @SuppressWarnings("unchecked")
    @Override
    public void createTable(int capacity) {
        table = (TableEntry<K, V>[]) new TableEntry[capacity];
        size = 0;
    }

    private boolean isAvailable(int index) {
        return (table[index] == null || table[index].isDeleted());
    }

    @Override
    public V bucketGet(int hash, K key) {
        int index = findBucket(hash, key);
        
        if (index < 0) return null; // Key not found
        
        // Key was found, return the value
        return table[index].getValue();
    }

    @Override
    public V bucketPut(int hash, K key, V value) {
        int index = findBucket(hash, key);
        
        if (index >= 0) { // key exists, update value
            V oldValue = table[index].getValue();
            
            table[index].setValue(value);
            
            return oldValue;
        }
        
        else { // new key, insert here
            index = -index - 1; // convert to proper index
            
            // If the slot is available (null or deleted), use it
            if (isAvailable(index)) {
                table[index] = new TableEntry<>(key, value);
                size++;
                
                return null; // no old value
            }
            
            else {
                // This situation should not occur as findBucket should return a valid index
                throw new IllegalStateException("Bucket is neither empty nor available for insertion.");
            }
        }
    }

    private int findBucket(int index, K key) {
        int avail = -1;
        int j = index;
        
        do {
            if (isAvailable(j)) {
                if (avail == -1) {
                    avail = j; // First available slot
                }
                if (table[j] == null) {
                    return -(avail + 1); // Key is not in the table
                }
            }
            
            else if (table[j].getKey().equals(key)) {
                return j; // Key found
            }
            
            j = (j + 1) % table.length; // Linear probing
        } while (j != index); // Stop if we loop back to the start index

        return -(avail + 1); // Key is not in the table, return insertion point
    }

    @Override
    public V bucketRemove(int hash, K key) {
        int index = findBucket(hash, key);
        
        if (index < 0) return null; // Key not found
        
        V oldValue = table[index].getValue();
        
        // Mark the entry as deleted
        table[index].setDeleted(true);
        size--;
        
        return oldValue; // Return the old value
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    protected int capacity() {
        return table.length;
    }

    private static class TableEntry<K, V> extends MapEntry<K, V> {

        private boolean isDeleted;

        public TableEntry(K key, V value) {
            super(key, value);
            setDeleted(false);
        }

        public boolean isDeleted() {
            return isDeleted;
        }

        public void setDeleted(boolean deleted) {
            isDeleted = deleted;
        }
    }
}
