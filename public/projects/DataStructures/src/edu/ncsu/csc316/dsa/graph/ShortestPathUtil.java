package edu.ncsu.csc316.dsa.graph;

import edu.ncsu.csc316.dsa.Weighted;
import edu.ncsu.csc316.dsa.graph.Graph.Edge;
import edu.ncsu.csc316.dsa.graph.Graph.Vertex;
import edu.ncsu.csc316.dsa.map.Map;
import edu.ncsu.csc316.dsa.map.UnorderedLinkedMap;
import edu.ncsu.csc316.dsa.priority_queue.AbstractPriorityQueue.PQEntry;
import edu.ncsu.csc316.dsa.priority_queue.AdaptablePriorityQueue;
import edu.ncsu.csc316.dsa.priority_queue.HeapAdaptablePriorityQueue;
import edu.ncsu.csc316.dsa.set.HashSet;
import edu.ncsu.csc316.dsa.set.Set;

/**
 * ShortestPathUtil provides a collection of behaviors for computing shortest
 * path spanning trees for a given graph.
 * 
 * The ShortestPathUtil class is based on the textbook:
 *
 * Data Structures and Algorithms in Java, Sixth Edition Michael T. Goodrich,
 * Roberto Tamassia, and Michael H. Goldwasser John Wiley and Sons, 2014
 * 
 * @author Dr. King
 * @author Nick Gallo 
 *
 */
public class ShortestPathUtil {
    
    /**
     * For a connected graph, returns a map that represents shortest path costs to
     * all vertices computed using Dijkstra's single-source shortest path algorithm.
     * 
     * @param <V>   the type of data in the graph vertices
     * @param <E>   the type of data in the graph edges
     * @param graph the graph for which to compute the shortest path spanning tree
     * @param start the vertex at which to start computing the shorest path spanning
     *              tree
     * @return a map that represents the shortest path costs to all vertices in the
     *         graph
     */ 
    public static <V, E extends Weighted> Map<Vertex<V>, Integer> dijkstra(Graph<V, E> graph, Vertex<V> start) {
        AdaptablePriorityQueue<Integer, Vertex<V>> pq = new HeapAdaptablePriorityQueue<>();
        Map<Vertex<V>, Integer> costs = new UnorderedLinkedMap<>();
        Map<Vertex<V>, PQEntry<Integer, Vertex<V>>> entries = new UnorderedLinkedMap<>();
        Set<Vertex<V>> known = new HashSet<>();

        // Initialize costs and priority queue entries
        for (Vertex<V> v : graph.vertices()) {
            int initialCost = (v.equals(start) ? 0 : Integer.MAX_VALUE);
            costs.put(v, initialCost);
            entries.put(v, (PQEntry<Integer, Vertex<V>>) pq.insert(initialCost, v));
        }

        // Process the priority queue
        while (!pq.isEmpty()) {
            PQEntry<Integer, Vertex<V>> entry = (PQEntry<Integer, Vertex<V>>) pq.deleteMin();
            Vertex<V> u = entry.getValue();
            known.add(u);

            // Relaxation step for all outgoing edges of u
            for (Edge<E> edge : graph.outgoingEdges(u)) {
                Vertex<V> z = graph.opposite(u, edge);
                
                if (!known.contains(z)) {
                    int r = edge.getElement().getWeight() + costs.get(u);
                    
                    if (r < costs.get(z)) {
                        costs.put(z, r);
                        pq.replaceKey(entries.get(z), r);
                    }
                }
            }
        }

        return costs;
    }
    
    /**
     * For a connected graph, returns a map that represents shortest path spanning
     * tree edges computed using Dijkstra's single-source shortest path algorithm.
     * 
     * @param <V>       the type of data in the graph vertices
     * @param <E>       the type of data in the graph edges
     * @param graph         the graph for which to compute the shortest path spanning
     *                  tree
     * @param start         the vertex at which to start computing the shortest path
     *                  spanning tree
     * @param costs the map of shortest path costs to reach each vertex in the
     *                  graph
     * @return a map that represents the shortest path spanning tree edges
     */ 
    public static <V, E extends Weighted> Map<Vertex<V>, Edge<E>> shortestPathTree(Graph<V, E> graph, Vertex<V> start, Map<Vertex<V>, Integer> costs) {
        Map<Vertex<V>, Edge<E>> tree = new UnorderedLinkedMap<>();
        
        // Construct the tree by checking incoming edges of each vertex
        for (Vertex<V> v : graph.vertices()) {
            if (!v.equals(start)) {
                for (Edge<E> e : graph.incomingEdges(v)) {
                    Vertex<V> u = graph.opposite(v, e);
                    if (costs.get(v).equals(costs.get(u) + e.getElement().getWeight())) {
                        tree.put(v, e);
                        break;
                    }
                }
            }
        }

        return tree;
    }
}
