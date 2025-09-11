package edu.ncsu.csc411.ps01.agent;

import edu.ncsu.csc411.ps01.environment.Action;
import edu.ncsu.csc411.ps01.environment.Environment;
import edu.ncsu.csc411.ps01.environment.Tile;
import edu.ncsu.csc411.ps01.environment.TileStatus;
import java.util.Map;

/**
  Represents a simple-reflex agent cleaning a particular room.
  The robot only has one sensor - the ability to retrieve the
  the status of all its neighboring tiles, including itself.
 */
public class Robot {
  private Environment env;

  /** Initializes a Robot on a specific tile in the environment. */
  public Robot(Environment env) { 
    this.env = env;
  }

  /*
    Problem Set 01 - Modify the getAction method below in order to
    simulate the passage of a single time-step. At each time-step, the Robot 
    decides whether to clean the current tile or move tiles.

    Your task for this Problem Set is to modify the method below such that
    the Robot agent is able to clean at least 70% of the available tiles on
    a given Environment. 5 out of the 10 graded test cases, with explanations
    on how to create new Environments, are available under the test package.

    This method should return a single Action from the Action class.
      - Action.CLEAN
      - Action.DO_NOTHING
      - Action.MOVE_UP
      - Action.MOVE_DOWN
      - Action.MOVE_LEFT
      - Action.MOVE_RIGHT
   */
  
  // Determines which way the agent sweeps
  int goingRight = 1;

  /**
    This is a zigzag cleaning strategy where the robot alternates between moving right and left across 
    rows while addressing dirty tiles above or below its path.
   */
  public Action getAction() {
    /* This example code demonstrates the available methods and actions, such as
     * retrieving its senses (neighbor tiles), getting the status of those tiles,
     * and returning the different available Actions env.getNeighboringTiles(this)
     * will return a Map with key-value pairs for each neighbor, using a String
     * key for a Tile value
     */
    Map<String, Tile> positions = env.getNeighborTiles(this);
    Tile self = positions.get("self");
    Tile above = positions.get("above"); // Either a Tile object or null
    Tile below = positions.get("below"); // Either a Tile object or null
    Tile left = positions.get("left");   // Either a Tile object or null
    Tile right = positions.get("right"); // Either a Tile object or null

    System.out.println("self: " + self);
    System.out.println("above: " + above);
    System.out.println("left: " + left);
    System.out.println("below: " + below);
    System.out.println("right: " + right);

    // getStatus will return TileStatus of the agent's current Position,
    // which can be either DIRTY, CLEAN, or IMPASSABLE
    
    // 1) Clean if tile is DIRTY
    if (self != null && self.getStatus() == TileStatus.DIRTY) {
      return Action.CLEAN;
    }

    // 2) Move in a simple zigzag
    if (goingRight == 1) {
      // Check if there is a dirty tile above
      if (above != null && above.getStatus() == TileStatus.DIRTY) {
        return Action.MOVE_UP; // Move up to clean the dirty tile
      }

      // Attempt to move right if it's not IMPASSABLE and not null
      if (right != null && right.getStatus() != TileStatus.IMPASSABLE) {
        return Action.MOVE_RIGHT; // Continue moving right
      } 
      
      // Otherwise, try moving down to the next row and switch direction
      else {
        goingRight = 0; // Switch direction to left after moving down
        return Action.MOVE_DOWN;
      }
    } else { 
      // Check if there is a dirty tile above
      if (above != null && above.getStatus() == TileStatus.DIRTY) {
        return Action.MOVE_UP; // Move up to clean the dirty tile
      }
      // Check if there is a dirty tile below when moving left
      if (below != null && below.getStatus() == TileStatus.DIRTY) {
        return Action.MOVE_DOWN; // Move up to clean the dirty tile
      }

      // Attempt to move left if it's not IMPASSABLE and not null
      if (left != null && left.getStatus() != TileStatus.IMPASSABLE) {
        return Action.MOVE_LEFT; // Continue moving left
      } 
      
      // Otherwise, try moving down to the next row and switch direction
      else {
        goingRight = 1; // Switch direction to right after moving down
        return Action.MOVE_DOWN;
      }
    }

  }

  @Override
  public String toString() {
    return "Robot [neighbors=" + env.getNeighborTiles(this) + "]";
  }
}