package edu.ncsu.csc316.dsa.graph;

import static org.junit.Assert.*;

import org.junit.Test;

import edu.ncsu.csc316.dsa.Weighted;
import edu.ncsu.csc316.dsa.graph.Graph.Edge;
import edu.ncsu.csc316.dsa.graph.Graph.Vertex;
import edu.ncsu.csc316.dsa.map.Map;

/**
 * Test class for ShortestPathUtil
 * Checks the expected outputs of Dijksra's algorithm
 * and the shortest path tree construction method
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class ShortestPathUtilTest {

    /**
     * Test the output of Dijkstra's algorithm
     */ 
    @Test
    public void testDijkstra() {
     // Setup the graph
        Graph<String, Weighted> graph = new AdjacencyMapGraph<>(false);
        Vertex<String> v1 = graph.insertVertex("A");
        Vertex<String> v2 = graph.insertVertex("B");
        Vertex<String> v3 = graph.insertVertex("C");
        Vertex<String> v4 = graph.insertVertex("D");

        graph.insertEdge(v1, v2, new WeightedEdge(1));
        graph.insertEdge(v1, v3, new WeightedEdge(1));
        graph.insertEdge(v2, v4, new WeightedEdge(1));
        graph.insertEdge(v3, v4, new WeightedEdge(1));

        // Execute Dijkstra
        Map<Vertex<String>, Integer> distances = ShortestPathUtil.dijkstra(graph, v1);

        // Assertions to check correct distances
        assertNotNull(distances);
        assertEquals(Integer.valueOf(0), distances.get(v1));  // Distance to itself
        assertEquals(Integer.valueOf(1), distances.get(v2));  // Direct edge A-B
        assertEquals(Integer.valueOf(2), distances.get(v3));  // Direct edge A-C
        assertEquals(Integer.valueOf(4), distances.get(v4));  // A-B-D (1+3)
    }
    
    /**
     * Test the output of the shortest path tree construction method
     */ 
    @Test
    public void testShortestPathTree() {
     // Setup the graph
        Graph<String, Integer> graph = new AdjacencyMapGraph<>(false); // Adjust based on your graph's constructor for directed/undirected graphs
        Vertex<String> v1 = graph.insertVertex("A");
        Vertex<String> v2 = graph.insertVertex("B");
        Vertex<String> v3 = graph.insertVertex("C");
        Vertex<String> v4 = graph.insertVertex("D");

        Edge<Integer> e1 = graph.insertEdge(v1, v2, 1);
        Edge<Integer> e2 = graph.insertEdge(v1, v3, 2);
        Edge<Integer> e3 = graph.insertEdge(v2, v4, 3);
        Edge<Integer> e4 = graph.insertEdge(v3, v4, 4);

        // First compute distances using Dijkstra's
        Map<Vertex<String>, Integer> distances = ShortestPathUtil.dijkstra(graph, v1);

        // Now compute the shortest path tree
        Map<Vertex<String>, Edge<Integer>> tree = ShortestPathUtil.shortestPathTree(graph, v1, distances);

        // Assertions to check correct edges in the tree
        assertNotNull(tree);
        assertEquals(3, tree.size()); // Expecting three edges (for three other vertices)
        assertTrue(tree.get(v2) == e1);  // Edge A-B should be part of the tree
        assertTrue(tree.get(v3) == e2);  // Edge A-C should be part of the tree
        assertTrue(tree.get(v4) == e3);  // Edge B-D should be part of the tree (since A-B-D is the shortest path to D)
    }
    
}
