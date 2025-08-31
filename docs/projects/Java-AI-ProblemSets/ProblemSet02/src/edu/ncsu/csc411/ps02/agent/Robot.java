package edu.ncsu.csc411.ps02.agent;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;

import edu.ncsu.csc411.ps02.environment.Tile;
import edu.ncsu.csc411.ps02.environment.TileStatus;
import edu.ncsu.csc411.ps02.environment.Action;
import edu.ncsu.csc411.ps02.environment.Environment;
import edu.ncsu.csc411.ps02.environment.Position;

/**
	Represents an intelligent agent moving through a particular room.	
	The robot only has two sensors - the ability to retrieve the 
	the status of all its neighboring tiles, including itself, and the
	ability to retrieve to location of the TARGET tile.
	
	Your task is to modify the getAction method below so that it reaches
	TARGET with a minimal number of steps.
*/

public class Robot {
	private Environment env;
	
	/** Initializes a Robot on a specific tile in the environment. */
	public Robot (Environment env) { this.env = env; }
	
	/**
    Problem Set 02 - Modify the getAction method below in order to simulate
    the passage of a single time-step. At each time-step, the Robot decides
    which tile to move to.
    
    Your task for this Problem Set is to modify the method below such that
    the Robot agent is able to reach the TARGET tile on a given Environment. 
    5 out of the 10 graded test cases, with explanations on how to create new
    Environments, are available under the test package.
    
    This method should return a single Action from the Action class.
    	- Action.DO_NOTHING
    	- Action.MOVE_UP
    	- Action.MOVE_DOWN
    	- Action.MOVE_LEFT
    	- Action.MOVE_RIGHT
	 */
	
	// BFS
	private int algorithm = 1;
	// A*
//	private int algorithm = 1;

	/**
	 * I implemented a Breadth-First Search algorithm to find the shortest path 
	 * from the robot's current position to the target position. BFS guarantees 
	 * the shortest path in an unweighted grid environment. The robot explores all possible paths, level 
	 * by level, ensuring that the first time the target is reached it is via the shortest path.
	 * 
	 * The algorithm first checks if the robot is already at the target. Otherwise, it initializes a queue,  
	 * a parent map for path reconstruction, and a set of visited positions. BFS starts from the robot's 
	 * current position, exploring valid, unvisited, and passable neighbors. If the target is found, the path 
	 * is reconstructed, and the first move is returned. If no path exists, the robot does nothing.
	 * 
	 * Alternatively you can use the A* algorithm with algorithm = 1.
	 * Code is commented.
	 */
	public Action getAction() {
		
		// -------------- 0 is BFS --------------
		
		if (algorithm == 0) {
			// Get the current position of the robot and the target position
		    Position selfPos = env.getRobotPosition(this);
		    Position targetPos = env.getTarget();

		    // If the robot is already on the target position, do nothing
		    if (selfPos.equals(targetPos)) {
		        return Action.DO_NOTHING;
		    }

		    // BFS setup
		    // Queue to manage the positions to be explored
		    Queue<Position> queue = new LinkedList<>();
		    // Map to store the parent of each position for path reconstruction
		    Map<Position, Position> parentMap = new HashMap<>();
		    // Set to keep track of visited positions to avoid reprocessing
		    Set<Position> visited = new HashSet<>();

		    // Start BFS from the robot's current position
		    queue.add(selfPos);
		    visited.add(selfPos);

		    // Continue BFS until the queue is empty
		    while (!queue.isEmpty()) {
		        // Dequeue the current position to explore its neighbors
		        Position current = queue.poll();

		        // Explore neighbors of the current position
		        Map<String, Position> neighbors = env.getNeighborPositions(current);
		        for (Position neighbor : neighbors.values()) {
		            // Check if the neighbor is valid and not visited
		            if (neighbor != null && !visited.contains(neighbor)) {
		                // Get the tile at the neighbor position
		                Tile neighborTile = env.getTiles().get(neighbor);
		                // Check if the neighbor tile is not impassable
		                if (neighborTile != null && neighborTile.getStatus() != TileStatus.IMPASSABLE) {
		                    // Record the parent of the neighbor for path reconstruction
		                    parentMap.put(neighbor, current);
		                    // If the neighbor is the target, reconstruct the path and return the first move
		                    if (neighbor.equals(targetPos)) {
		                        return getFirstMove(selfPos, neighbor, parentMap);
		                    }
		                    // Enqueue the neighbor for further exploration
		                    queue.add(neighbor);
		                    // Mark the neighbor as visited
		                    visited.add(neighbor);
		                }
		            }
		        }
		    }

		    // If no path to the target is found, do nothing
		    return Action.DO_NOTHING;
		}
		
		// -------------- 1 is A* --------------
		
		else {
			// Get the current position of the robot and the target position
			Position selfPos = env.getRobotPosition(this);
			Position targetPos = env.getTarget();

			// If the robot is already at the target, do nothing
			if (selfPos.equals(targetPos)) {
			    return Action.DO_NOTHING;
			}

			// A* setup
			// PriorityQueue to store nodes to be explored, ordered by their fScore (total estimated cost)
			PriorityQueue<Node> openSet = new PriorityQueue<>();
			// Set to keep track of nodes that have already been explored
			Set<Position> closedSet = new HashSet<>();
			// Map to store the parent of each node for path reconstruction
			Map<Position, Position> parentMap = new HashMap<>();
			// Map to store the gScore (cost from start to the current node) for each node
			Map<Position, Integer> gScore = new HashMap<>();

			// Initialize the start node
			// The cost to reach the start node is 0
			gScore.put(selfPos, 0);
			// Add the start node to the open set with its gScore and heuristic value (fScore)
			openSet.add(new Node(selfPos, 0, heuristic(selfPos, targetPos)));

			// Continue exploring until there are no more nodes to explore
			while (!openSet.isEmpty()) {
			    // Get the node with the lowest f(n) = g(n) + h(n) from the open set
			    Node current = openSet.poll();
			    Position currentPos = current.position;

			    // If the current position is the target, reconstruct the path and return the first move
			    if (currentPos.equals(targetPos)) {
			        return getFirstMove(selfPos, currentPos, parentMap);
			    }

			    // Mark the current node as explored by adding it to the closed set
			    closedSet.add(currentPos);

			    // Explore neighbors of the current node
			    Map<String, Position> neighbors = env.getNeighborPositions(currentPos);
			    for (Position neighbor : neighbors.values()) {
			        // Skip invalid or already processed nodes
			        if (neighbor == null || closedSet.contains(neighbor)) {
			            continue;
			        }

			        // Get the tile at the neighbor position
			        Tile neighborTile = env.getTiles().get(neighbor);
			        // Skip impassable tiles
			        if (neighborTile == null || neighborTile.getStatus() == TileStatus.IMPASSABLE) {
			            continue;
			        }

			        // Calculate tentative gScore (cost from start to the neighbor)
			        int tentativeGScore = gScore.getOrDefault(currentPos, Integer.MAX_VALUE) + 1;

			        // If this path to the neighbor is better than any previous one
			        if (tentativeGScore < gScore.getOrDefault(neighbor, Integer.MAX_VALUE)) {
			            // Update the parent of the neighbor to reconstruct the path later
			            parentMap.put(neighbor, currentPos);
			            // Update the gScore of the neighbor
			            gScore.put(neighbor, tentativeGScore);

			            // Add the neighbor to the open set if it's not already there
			            if (!openSet.contains(new Node(neighbor, 0, 0))) {
			                openSet.add(new Node(neighbor, tentativeGScore, heuristic(neighbor, targetPos)));
			            }
			        }
			    }
			}

			// If no path is found, do nothing
			return Action.DO_NOTHING;
		}
	}

	/** 
	 * The getFirstMove method is used to determine the first move in the shortest path by backtracking 
	 * from the target to the start using the parent map. It compares the coordinates of the start position 
	 * and the first step towards the target to determine the direction of movement.
	 */
	private Action getFirstMove(Position start, Position target, Map<Position, Position> parentMap) {
	    // Start from the target position
	    Position current = target;
	    // Backtrack from the target to the start using the parent map
	    while (!parentMap.get(current).equals(start)) {
	        current = parentMap.get(current);
	    }

	    // Determine the direction from the start position to the first step towards the target
	    if (current.getRow() < start.getRow()) {
	        // If the first step is above the start, move up
	        return Action.MOVE_UP;
	    } else if (current.getRow() > start.getRow()) {
	        // If the first step is below the start, move down
	        return Action.MOVE_DOWN;
	    } else if (current.getCol() < start.getCol()) {
	        // If the first step is to the left of the start, move left
	        return Action.MOVE_LEFT;
	    } else if (current.getCol() > start.getCol()) {
	        // If the first step is to the right of the start, move right
	        return Action.MOVE_RIGHT;
	    }

	    // If no valid move is found, do nothing
	    return Action.DO_NOTHING;
	}
	
	/**
	 * For A*
     * Heuristic function: Manhattan distance.
     * Estimates the cost from the current position to the target.
     */
    private int heuristic(Position a, Position b) {
        return Math.abs(a.getRow() - b.getRow()) + Math.abs(a.getCol() - b.getCol());
    }
    
    /**
     * For A*
     * Represents a node in the A* algorithm, with a position, gScore, and fScore.
     */
    private static class Node implements Comparable<Node> {
        Position position;
        int gScore; // Cost from start to this node
        int fScore; // Estimated total cost (gScore + heuristic)

        Node(Position position, int gScore, int hScore) {
            this.position = position;
            this.gScore = gScore;
            this.fScore = gScore + hScore;
        }

        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.fScore, other.fScore);
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            Node node = (Node) obj;
            return position.equals(node.position);
        }

        @Override
        public int hashCode() {
            return position.hashCode();
        }
    }
}