package edu.ncsu.csc316.dsa.graph;

import static org.junit.Assert.*;

import org.junit.Test;

import edu.ncsu.csc316.dsa.Weighted;
import edu.ncsu.csc316.dsa.graph.Graph.Edge;
import edu.ncsu.csc316.dsa.graph.Graph.Vertex;
import edu.ncsu.csc316.dsa.list.positional.PositionalList;
import edu.ncsu.csc316.dsa.map.Map;

/**
 * Test class for MinimumSpanningTreeUtil
 * Checks the expected outputs of Prim-Jarnik's algorithm
 * and Kruskal's algorithm
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class MinimumSpanningTreeUtilTest {

    /**
     * Test the output of Prim-Jarnik's algorithm
     */ 
    @Test
    public void testPrimJarnik() {
     // Setup the graph with a known MST
        Graph<String, Weighted> graph = new AdjacencyMapGraph<>(false);
        Vertex<String> v1 = graph.insertVertex("A");
        Vertex<String> v2 = graph.insertVertex("B");
        Vertex<String> v3 = graph.insertVertex("C");
        Vertex<String> v4 = graph.insertVertex("D");

        graph.insertEdge(v1, v2, new WeightedEdge(1));
        graph.insertEdge(v2, v3, new WeightedEdge(3));
        graph.insertEdge(v3, v4, new WeightedEdge(4));
        graph.insertEdge(v4, v1, new WeightedEdge(5));
        graph.insertEdge(v1, v3, new WeightedEdge(6));

        // Compute the MST using Prim-Jarnik's algorithm
        PositionalList<Edge<Weighted>> mst = MinimumSpanningTreeUtil.primJarnik(graph);

        // Assertions
        assertNotNull(mst);
        assertEquals(3, mst.size()); // The tree should contain exactly one less edge than the number of vertices
        int totalWeight = mst.stream().mapToInt(e -> e.getElement().getWeight()).sum();
        assertEquals(8, totalWeight); // The total weight of the MST should be known from the setup
    }
    
    /**
     * Test the output of Kruskal's algorithm
     */ 
    @Test
    public void testKruskal() {
     // Setup the graph with a known MST
        Graph<String, Weighted> graph = new AdjacencyMapGraph<>(false);
        Vertex<String> v1 = graph.insertVertex("A");
        Vertex<String> v2 = graph.insertVertex("B");
        Vertex<String> v3 = graph.insertVertex("C");
        Vertex<String> v4 = graph.insertVertex("D");

        graph.insertEdge(v1, v2, new WeightedEdge(1));
        graph.insertEdge(v2, v3, new WeightedEdge(3));
        graph.insertEdge(v3, v4, new WeightedEdge(4));
        graph.insertEdge(v4, v1, new WeightedEdge(5));
        graph.insertEdge(v1, v3, new WeightedEdge(6));

        // Compute the MST using Kruskal's algorithm
        PositionalList<Edge<Weighted>> mst = MinimumSpanningTreeUtil.kruskal(graph);

        // Assertions
        assertNotNull(mst);
        assertEquals(3, mst.size()); // The tree should contain exactly one less edge than the number of vertices
        int totalWeight = mst.stream().mapToInt(e -> e.getElement().getWeight()).sum();
        assertEquals(8, totalWeight); // The total weight of the MST should be known from the setup
    }
    
}
