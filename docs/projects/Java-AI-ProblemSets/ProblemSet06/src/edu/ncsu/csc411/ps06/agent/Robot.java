package edu.ncsu.csc411.ps06.agent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

import edu.ncsu.csc411.ps06.environment.Action;
import edu.ncsu.csc411.ps06.environment.Environment;
import edu.ncsu.csc411.ps06.environment.Position;
import edu.ncsu.csc411.ps06.environment.Tile;
import edu.ncsu.csc411.ps06.environment.TileStatus;

/**
Represents a planning agent within an environment modeled after
the Chip's Challenge Windows 95 game. This agent must develop a
plan for navigating the environment to collect chips and keys
in order to reach the environment's portal (goal condition).

Problem Set 06 - In this problem set, you will be developing a planning
  agent to navigate the environment to collect chips scattered across the
  map. In order to reach the portal (goal condition), the agent must collect
  all the chips first. In order to do this, the agent will also need to collect
  assorted keys that can be used to unlock doors blocking some of the chips.

  Map difficulties increase by the number of subgoals that the agent must complete.
  While I will be able to assist in getting started debugging, planning is not a
  simple algorithm and still a complex task for even the most advanced AIs.
  This of this as one of those "unsolvable" math problems scrawled in chalk on some
  abandoned blackboard.

  That is to say, you are on your own in this "mostly uncharted" territory.
*/

public class Robot {
	private Environment env;

	// Stores the sequence of actions the robot is currently executing.
	private LinkedList<Action> currentPlan;
    // Keeps track of the last target the robot tried to pathfind to, avoids infinite loops.
    private Position lastTarget = null;

	/** Initializes a Robot on a specific tile in the environment.
   * @param env - The Environment object containing the map and game state.
   */
  public Robot (Environment env) {
	  this.env = env;
	  // Initialize an empty plan when the robot is created.
	  this.currentPlan = new LinkedList<>();
  }

	/**	The method called by Environment at each time step to retrieve the agent's next action.
	 *  This method implements the core planning logic.
	    @return should return a single Action from the Action enum.
	*/
	public Action getAction () {
		// If we have a plan with remaining steps, execute the next step.
        if (!currentPlan.isEmpty()) {
            return currentPlan.poll();
        }

        // Plan is empty, generate a new one
        Position currentPos = env.getRobotPosition(this); // Get robot's current location.
        ArrayList<String> currentInventory = env.getRobotHoldings(this); // Get keys the robot holds.
        Map<TileStatus, ArrayList<Position>> currentEnvPos = env.getEnvironmentPositions(); // Get locations of all items.

        Position target = null; // The position the robot will try to reach.
        boolean seekingKey = false; // Flag to indicate if the immediate goal is a key.

        // Step 1: Determine the Primary Target
        // Check if all chips have been collected.
        if (env.getNumRemainingChips() == 0) {
            // If yes, the primary target is the DOOR_GOAL.
            if (currentEnvPos.get(TileStatus.DOOR_GOAL) != null && !currentEnvPos.get(TileStatus.DOOR_GOAL).isEmpty()) {
                target = currentEnvPos.get(TileStatus.DOOR_GOAL).get(0); // Assuming only one DOOR_GOAL.
            } else if (currentEnvPos.get(TileStatus.GOAL) != null && !currentEnvPos.get(TileStatus.GOAL).isEmpty()) {
                // Fallback: If DOOR_GOAL is already gone, target the actual GOAL tile.
                target = currentEnvPos.get(TileStatus.GOAL).get(0);
            }
            // If already at the final target, do nothing.
            if (target != null && target.equals(currentPos)) return Action.DO_NOTHING;
        } else {
            // If chips remain, the primary target is the closest reachable chip.
            target = findClosestReachableTarget(currentPos, currentEnvPos.get(TileStatus.CHIP), currentInventory);
        }

        // Step 2: Calculate Path to Primary Target using A*
        if (target != null) {
            // Attempt to find a path from current position to the determined target.
            currentPlan = calculatePathAStar(currentPos, target, currentInventory);

            // Check if we are stuck trying to reach the same target repeatedly.
            if (target.equals(lastTarget) && (currentPlan == null || currentPlan.isEmpty())) {
                 // If the target is the same as last time and no path was found, assume stuck.
                 // System.out.println("Stuck trying to reach primary target: " + target);
                 target = null; // Nullify the target to force seeking an alternative.
                 currentPlan = new LinkedList<>(); // Ensure the plan is empty.
            } else {
                 // Remember the target we are currently attempting to reach.
                 lastTarget = target;
            }
        } else {
            // No primary target or couldn't find one.
            lastTarget = null; // Reset last target since no primary target was selected.
            currentPlan = new LinkedList<>(); // Ensure plan is empty.
        }


        // Step 3: Handle Unreachability - Target a Necessary Key
        // If no primary target was set, or if A* failed to find a path to the primary target
        if (target == null || currentPlan == null || currentPlan.isEmpty()) {
            // The primary target is unreachable (behind a locked door).
            // We need to find a key that might unlock the path.
            // System.out.println("Primary target unreachable or not found. Seeking keys.");

            // Create a list of all key positions on the map that the robot doesn't already have.
            List<Position> allKeyPositions = new ArrayList<>();
            addKeysToList(allKeyPositions, currentEnvPos.get(TileStatus.KEY_BLUE), "KEY_BLUE", currentInventory);
            addKeysToList(allKeyPositions, currentEnvPos.get(TileStatus.KEY_GREEN), "KEY_GREEN", currentInventory);
            addKeysToList(allKeyPositions, currentEnvPos.get(TileStatus.KEY_RED), "KEY_RED", currentInventory);
            addKeysToList(allKeyPositions, currentEnvPos.get(TileStatus.KEY_YELLOW), "KEY_YELLOW", currentInventory);

            // If there are potential keys to collect
            if (!allKeyPositions.isEmpty()) {
                // Find the closest reachable key among the needed keys.
                Position keyTarget = findClosestReachableTarget(currentPos, allKeyPositions, currentInventory);

                // If a reachable key was found
                if (keyTarget != null) {
                    // System.out.println("Found reachable key target: " + keyTarget);
                    target = keyTarget; // Set this key as the new immediate target.
                    seekingKey = true; // Set flag indicating we're going for a key.
                    // Calculate the path to the key.
                    currentPlan = calculatePathAStar(currentPos, target, currentInventory);
                    lastTarget = target; // Update the last target pursued.
                } else {
                     // No keys are reachable from the current position with the current inventory.
                     // System.out.println("No reachable keys found.");
                     lastTarget = null; // Reset last target as we couldn't find a key path.
                     currentPlan = new LinkedList<>(); // Ensure plan is empty.
                }
            } else {
                // No keys left on the map that we need.
                // System.out.println("No keys left on map to seek.");
                lastTarget = null; // Reset last target.
                 currentPlan = new LinkedList<>(); // Ensure plan is empty.
            }
        }

        // Step 4: Execute the First Step of the New Plan
        if (currentPlan != null && !currentPlan.isEmpty()) {
             // If the target is a key, we are right next to it, and the plan
             // is just one step, execute that step to pick up the key.
             // Ensures the key is acquired immediately.
             if (seekingKey && isAdjacent(currentPos, target) && currentPlan.size() == 1) {
                 // Get and remove the action from the plan.
                 return currentPlan.poll();
             }
            // Execute the next step in the calculated plan.
            return currentPlan.poll();
        }

        // Step 5: Fallback - No Plan Possible
        // If after all checks, no path could be found.
        // System.out.println("No path found to any target. Doing nothing.");
        return Action.DO_NOTHING; // Agent is stuck or finished.
	}

	/**
	 * Helper method to add key positions to a list, but only if the keys
	 * actually exist on the map and
	 * the robot doesn't already have that key type.
	 *
	 * @param list The list to add key positions to.
	 * @param keyPositions A list of positions where a specific key type might be.
	 * @param keyType The string identifier of the key type.
	 * @param inventory The robot's current inventory of keys.
	 */
    private void addKeysToList(List<Position> list, ArrayList<Position> keyPositions, String keyType, ArrayList<String> inventory) {
        // Check if the list of positions for this key type is valid and if the robot needs this key.
        if (keyPositions != null && !keyPositions.isEmpty() && !inventory.contains(keyType)) {
            // Add all positions of this needed key type to the target list.
            list.addAll(keyPositions);
        }
    }

    /**
     * Finds the closest target position from a given list of potential targets
     * that is actually reachable from the start position, considering the robot's inventory.
     * It uses A* to check reachability and path length for each potential target.
     *
     * @param start The starting position of the robot.
     * @param targets A list of potential target positions (e.g., all chip positions).
     * @param inventory The robot's current inventory (needed for A* passability check).
     * @return The position of the closest reachable target, or null if none are reachable.
     */
    private Position findClosestReachableTarget(Position start, List<Position> targets, ArrayList<String> inventory) {
        // If there are no targets to consider, return null.
        if (targets == null || targets.isEmpty()) {
            return null;
        }

        Position closestTarget = null; // Store the best target found so far.
        int minPathLength = Integer.MAX_VALUE; // Store the length of the shortest path found.

        // Iterate through all potential target positions.
        for (Position target : targets) {
            // Calculate the path from the start to this potential target.
            LinkedList<Action> path = calculatePathAStar(start, target, inventory);
            // Check if a valid path was found.
            if (path != null && !path.isEmpty()) {
                // If this path is shorter than the best one found so far
                if (path.size() < minPathLength) {
                    minPathLength = path.size(); // Update minimum path length.
                    closestTarget = target; // Update the closest target position.
                }
            }
        }
        // System.out.println("Closest reachable target: " + closestTarget + " with path length " + minPathLength);
        // Return the position of the closest target that had a valid path, or null if none were reachable.
        return closestTarget;
    }

    // A* Implementation

    /**
     * Inner class representing a node in the A* search space.
     * Contains the position, cost from start (gScore), estimated total cost (fScore),
     * and a reference to the parent node for path reconstruction.
     * Implements Comparable to be used in the PriorityQueue based on fScore.
     */
    private static class Node implements Comparable<Node> {
        Position position; // The (row, col) coordinate of this node.
        double gScore;     // Cost of the path from the start node to this node.
        double fScore;     // Estimated total cost (gScore + heuristic estimate to goal).
        Node parent;       // The node from which we reached this node.

        /** Constructor for a Node. */
        Node(Position position, double gScore, double fScore, Node parent) {
            this.position = position;
            this.gScore = gScore;
            this.fScore = fScore;
            this.parent = parent;
        }

        /** Compares nodes based on their fScore. Lower fScore is higher priority. */
        @Override
        public int compareTo(Node other) {
            return Double.compare(this.fScore, other.fScore);
        }

        /** Checks if two nodes represent the same position. Used for checking visited nodes. */
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Node node = (Node) o;
            // Equality is based solely on the row and column of the position.
            return position.getRow() == node.position.getRow() && position.getCol() == node.position.getCol();
        }

        /** Generates a hash code based on the node's position. Used for HashMap storage. */
        @Override
        public int hashCode() {
            // Combining row and column.
            return 31 * position.getRow() + position.getCol();
        }
    }

    /**
     * Implements the A* search algorithm to find the shortest path between a start and goal position.
     * Considers walls, locked doors (based on inventory), and water as obstacles.
     *
     * @param start The starting position.
     * @param goal The target position.
     * @param inventory The robot's current inventory, used by isPassable.
     * @return A LinkedList of Actions representing the path, or null if no path is found.
     */
    private LinkedList<Action> calculatePathAStar(Position start, Position goal, ArrayList<String> inventory) {
        // Basic null checks and check if already at the goal.
        if (start == null || goal == null) return null;
        if (start.equals(goal)) return new LinkedList<>(); // Return empty path if already there.

        // The set of discovered nodes that are not yet evaluated (ordered by fScore).
        PriorityQueue<Node> openSet = new PriorityQueue<>();
        // Stores all nodes encountered, mapping Position to the Node object.
        // This helps retrieve existing nodes and update them if a shorter path is found.
        Map<Position, Node> allNodes = new HashMap<>();

        // Create the starting node with gScore=0 and fScore=heuristic estimate.
        Node startNode = new Node(start, 0, getManhattanDistance(start, goal), null);
        openSet.add(startNode); // Add start node to the open set.
        allNodes.put(start, startNode); // Record the start node.

        // Loop while there are still nodes to evaluate in the open set.
        while (!openSet.isEmpty()) {
            // Get the node with the lowest fScore from the priority queue.
            Node current = openSet.poll();

            // If the current node is the goal, we've found the path.
            if (current.position.equals(goal)) {
                // Reconstruct the path from the goal node back to the start node.
                return reconstructPath(current);
            }

            // Get the valid neighbor positions.
            Map<String, Position> neighbors = env.getNeighborPositions(current.position);
            // Iterate through each neighbor.
            for (Map.Entry<String, Position> entry : neighbors.entrySet()) {
                Position neighborPos = entry.getValue();

                // Check if the neighbor position is valid and passable given the current inventory.
                if (neighborPos != null && isPassable(neighborPos, inventory, goal)) {
                    // Calculate the cost to reach this neighbor from the start through the current node.
                    // Assume cost of moving between adjacent tiles is 1.
                    double tentativeGScore = current.gScore + 1;

                    // Get the Node object for the neighbor if it exists.
                    Node neighborNode = allNodes.get(neighborPos);

                    // If this neighbor hasn't been visited before, or
                    // if the new path to this neighbor is shorter than the previous best path
                    if (neighborNode == null || tentativeGScore < neighborNode.gScore) {
                        // Update the path information for the neighbor.
                        double fScore = tentativeGScore + getManhattanDistance(neighborPos, goal);
                        Node newNeighborNode = new Node(neighborPos, tentativeGScore, fScore, current); // Set current as parent.

                        // If the neighbor was already in the open set with a higher cost, remove the old one.
                         if(neighborNode != null) {
                              openSet.remove(neighborNode);
                         }

                        // Add the updated neighbor node to the open set and record it in allNodes.
                        openSet.add(newNeighborNode);
                        allNodes.put(neighborPos, newNeighborNode);
                    }
                }
            }
        }

        // No path exists.
        return null;
    }

    /**
     * Checks if a given tile position is passable for the robot.
     * Considers walls, water, locked doors (requires corresponding key in inventory),
     * and the goal door (requires all chips to be collected).
     *
     * @param pos The position to check.
     * @param inventory The robot's current key inventory.
     * @param goal The ultimate goal position.
     * @return true if the tile at pos is passable, false otherwise.
     */
    private boolean isPassable(Position pos, ArrayList<String> inventory, Position goal) {
        // Basic null check for the position.
        if (pos == null) return false;
        // Get the tile object at the position.
        Tile tile = env.getTiles().get(pos);
        // Check if the tile exists.
        if (tile == null) return false;

        // Get the type of the tile.
        TileStatus status = tile.getStatus();

        // Handle different tile types.
        switch (status) {
        	// Impassable
            case WALL:
            case WATER:
                return false;
            // Keys
            case DOOR_BLUE:
                return inventory.contains("KEY_BLUE");
            case DOOR_GREEN:
                return inventory.contains("KEY_GREEN");
            case DOOR_RED:
                return inventory.contains("KEY_RED");
            case DOOR_YELLOW:
                return inventory.contains("KEY_YELLOW");
            // All chips    
            case DOOR_GOAL:
                 boolean allChipsCollected = env.getNumRemainingChips() == 0;
                return allChipsCollected;
            // Other status
            case BLANK:
            case CHIP:
            case KEY_BLUE:
            case KEY_GREEN:
            case KEY_RED:
            case KEY_YELLOW:
            case GOAL:
                return true;
            default:
                return false;
        }
    }

    /**
     * Calculates the Manhattan distance between two positions.
     * This is used as the heuristic (h) in the A* algorithm.
     * h(n) = |n.x - goal.x| + |n.y - goal.y|
     *
     * @param p1 The first position.
     * @param p2 The second position.
     * @return The Manhattan distance, or positive infinity if either position is null.
     */
    private double getManhattanDistance(Position p1, Position p2) {
        if (p1 == null || p2 == null) return Double.POSITIVE_INFINITY; // Handle null inputs.
        // Calculate the absolute difference in rows plus the absolute difference in columns.
        return Math.abs(p1.getRow() - p2.getRow()) + Math.abs(p1.getCol() - p2.getCol());
    }

    /**
     * Reconstructs the path from the goal node back to the start node
     * by following the parent references stored in each A* Node.
     *
     * @param targetNode The goal node found by A*.
     * @return A LinkedList of Actions representing the path from start to goal.
     */
    private LinkedList<Action> reconstructPath(Node targetNode) {
        LinkedList<Action> path = new LinkedList<>(); // Initialize the list to store actions.
        Node current = targetNode; // Start from the goal node.
        Node parent = current.parent; // Get the node we came from to reach the current node.

        // Traverse backwards from the goal until we reach the start node.
        while (parent != null) {
            Position currentPos = current.position; // Position of the current node in the backward traversal.
            Position parentPos = parent.position;   // Position of the parent node.

            // Determine the action taken to move from the parent to the current node.
            if (currentPos.getRow() < parentPos.getRow()) path.addFirst(Action.MOVE_UP);
            else if (currentPos.getRow() > parentPos.getRow()) path.addFirst(Action.MOVE_DOWN);
            else if (currentPos.getCol() < parentPos.getCol()) path.addFirst(Action.MOVE_LEFT);
            else if (currentPos.getCol() > parentPos.getCol()) path.addFirst(Action.MOVE_RIGHT);

            // Move to the next node in the backward traversal.
            current = parent;
            parent = current.parent;
        }
        // The path list now contains the sequence of actions from start to goal.
        return path;
    }

	/**
	 * Checks if two positions are adjacent.
	 *
	 * @param p1 The first position.
	 * @param p2 The second position.
	 * @return true if the positions are adjacent, false otherwise.
	 */
	private boolean isAdjacent(Position p1, Position p2) {
	    // Uses the Manhattan distance helper; adjacent if distance is 1.
	    return getManhattanDistance(p1, p2) == 1.0;
	}

	@Override
	public String toString() {
		return "Robot [pos=" + env.getRobotPosition(this) + "]";
	}
}