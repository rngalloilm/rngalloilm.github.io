package edu.ncsu.csc316.dsa.graph;

import static org.junit.Assert.*;

import org.junit.Test;

import edu.ncsu.csc316.dsa.graph.Graph.Edge;
import edu.ncsu.csc316.dsa.graph.Graph.Vertex;
import edu.ncsu.csc316.dsa.map.Map;

/**
 * Test class for GraphTraversalUtil
 * Checks the expected outputs of depth first search
 * and breadth first search
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class GraphTraversalUtilTest {

    /**
     * Test the output of depth first search on a graph
     */ 
    @Test
    public void testDepthFirstSearch() {
     // Setup the graph
        Graph<String, Integer> graph = new AdjacencyMapGraph<>(false); // Adjust based on your graph's constructor for directed/undirected graphs
        Vertex<String> v1 = graph.insertVertex("A");
        Vertex<String> v2 = graph.insertVertex("B");
        Vertex<String> v3 = graph.insertVertex("C");
        Vertex<String> v4 = graph.insertVertex("D");

        graph.insertEdge(v1, v2, 1);
        graph.insertEdge(v1, v3, 2);
        graph.insertEdge(v2, v4, 3);
        graph.insertEdge(v3, v4, 4);

        // Perform DFS
        Map<Vertex<String>, Edge<Integer>> result = GraphTraversalUtil.depthFirstSearch(graph, v1);

        // Check the expected output
        assertNotNull(result);
        assertEquals(3, result.size());
        assertTrue(result.get(v2) != null);
        assertTrue(result.get(v3) != null);
        assertTrue(result.get(v4) != null);
    }
    
    /**
     * Test the output of the breadth first search
     */ 
    @Test
    public void testBreadthFirstSearch() {
     // Setup the graph
        Graph<String, Integer> graph = new AdjacencyMapGraph<>(false); // Use false for undirected graph
        Vertex<String> v1 = graph.insertVertex("A");
        Vertex<String> v2 = graph.insertVertex("B");
        Vertex<String> v3 = graph.insertVertex("C");
        Vertex<String> v4 = graph.insertVertex("D");

        graph.insertEdge(v1, v2, 1);
        graph.insertEdge(v1, v3, 2);
        graph.insertEdge(v2, v4, 3);
        graph.insertEdge(v3, v4, 4);

        // Perform BFS
        Map<Vertex<String>, Edge<Integer>> result = GraphTraversalUtil.breadthFirstSearch(graph, v1);

        // Check the expected output
        assertNotNull(result);
        assertEquals(3, result.size());
        assertTrue(result.get(v2) != null);
        assertTrue(result.get(v3) != null);
        assertTrue(result.get(v4) != null);

        // Additional checks for the correct structure of the BFS tree
        // Depending on BFS specifics, it's important to ensure that the BFS covers all edges correctly
        assertEquals(Integer.valueOf(1), result.get(v2).getElement());
        assertEquals(Integer.valueOf(2), result.get(v3).getElement());
        // The edge to v4 should be either from v2 or v3, depending on the BFS order
        assertTrue(Integer.valueOf(3).equals(result.get(v4).getElement()) || Integer.valueOf(4).equals(result.get(v4).getElement()));
    }
    
}
