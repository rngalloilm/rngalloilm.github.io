package edu.ncsu.csc411.ps04.agent;

import java.util.ArrayList;
import java.util.List;

import edu.ncsu.csc411.ps04.environment.Environment;
import edu.ncsu.csc411.ps04.environment.Position;
import edu.ncsu.csc411.ps04.environment.Status;

public class StudentRobot extends Robot {

    // Depth limit for the minimax search.
    private final int DEPTH_LIMIT = 4;

    public StudentRobot(Environment env) {
        super(env);
    }

    /**
     * Minimax search with alpha-beta pruning
     * I started with super high level pseudocode including the helper methods and then implemented over time.
     * 
     * Algorithm:
     * - For each valid move (column from env.getValidActions), simulate the move on a cloned board.
     * - Use minimax search (with a fixed depth limit) to evaluate the board state:
     *   - If a terminal state is reached (win, loss, or draw), the evaluation function returns a large positive or negative score.
     *   - Otherwise, evaluate all possible 4-cell windows (horizontal, vertical, and diagonal) to assign a heuristic value.
     * - Alpha-beta pruning is used to cut off branches that cannot affect the final decision, increasing efficiency.
     * - Finally, the column with the highest score is returned as the chosen action.
     * 
     * @return the column (an integer 0-6) where the agent chooses to drop its marker.
     */
    @Override
    public int getAction() {
        int bestScore = Integer.MIN_VALUE;
        int bestMove = -1;
        List<Integer> validActions = env.getValidActions();
        // Iterate over each valid move.
        for (Integer col : validActions) {
            // Simulate the move on a cloned board.
            Position[][] boardAfterMove = simulateMove(env.clonePositions(), col, this.role);
            // Start minimax search with the opponent's turn.
            int score = minimax(boardAfterMove, DEPTH_LIMIT - 1, false, Integer.MIN_VALUE, Integer.MAX_VALUE);
            if (score > bestScore) {
                bestScore = score;
                bestMove = col;
            }
        }
        // If no move was found (should not happen), return 0.
        return (bestMove == -1) ? 0 : bestMove;
    }

    /**
     * The minimax method recursively evaluates the board.
     * 
     * @param board the current board state
     * @param depth the remaining search depth
     * @param maximizingPlayer true if the current move is for this agent, false if for the opponent
     * @param alpha the best already explored option along the path to the root for the maximizer
     * @param beta the best already explored option along the path to the root for the minimizer
     * @return the evaluated score of the board
     */
    private int minimax(Position[][] board, int depth, boolean maximizingPlayer, int alpha, int beta) {
        Status status = checkGameStatus(board);
        // Terminal state or maximum depth reached.
        if (status != Status.ONGOING || depth == 0) {
            return evaluateBoard(board);
        }
        List<Integer> validActions = getValidActions(board);
        if (maximizingPlayer) {
            int maxEval = Integer.MIN_VALUE;
            for (Integer col : validActions) {
                Position[][] child = simulateMove(board, col, this.role);
                int eval = minimax(child, depth - 1, false, alpha, beta);
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break; // Beta cut-off.
            }
            return maxEval;
        } else {
            // Determine opponent's role.
            Status opponent = (this.role == Status.RED) ? Status.YELLOW : Status.RED;
            int minEval = Integer.MAX_VALUE;
            for (Integer col : validActions) {
                Position[][] child = simulateMove(board, col, opponent);
                int eval = minimax(child, depth - 1, true, alpha, beta);
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break; // Alpha cut-off.
            }
            return minEval;
        }
    }

    /**
     * Evaluates the board state heuristically.
     * A winning board is assigned a large positive or negative score.
     * Otherwise, the function evaluates every possible group of four cells (window)
     * in horizontal, vertical, and diagonal directions and scores them based on:
     * - How many markers belong to the agent.
     * - How many markers belong to the opponent.
     * 
     * @param board the board state to evaluate
     * @return the heuristic score of the board
     */
    private int evaluateBoard(Position[][] board) {
        Status status = checkGameStatus(board);
        if (status == Status.RED_WIN) {
            return (this.role == Status.RED) ? 100000 : -100000;
        } else if (status == Status.YELLOW_WIN) {
            return (this.role == Status.YELLOW) ? 100000 : -100000;
        } else if (status == Status.DRAW) {
            return 0;
        }
        // Heuristic: difference between agent's and opponent's potential.
        int score = evaluateBoardForPlayer(board, this.role);
        Status opponent = (this.role == Status.RED) ? Status.YELLOW : Status.RED;
        score -= evaluateBoardForPlayer(board, opponent);
        return score;
    }

    /**
     * Evaluates the board for a specific player by checking every window of 4 cells.
     * 
     * @param board the board state
     * @param player the player's status (RED or YELLOW)
     * @return a score representing the player's advantage in the board
     */
    private int evaluateBoardForPlayer(Position[][] board, Status player) {
        int score = 0;
        int rows = board.length;
        int cols = board[0].length;
        // Evaluate horizontal windows.
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col <= cols - 4; col++) {
                int countPlayer = 0;
                int countBlank = 0;
                for (int i = 0; i < 4; i++) {
                    if (board[row][col + i].getStatus() == player)
                        countPlayer++;
                    else if (board[row][col + i].getStatus() == Status.BLANK)
                        countBlank++;
                }
                score += scoreWindow(countPlayer, countBlank);
            }
        }
        // Evaluate vertical windows.
        for (int col = 0; col < cols; col++) {
            for (int row = 0; row <= rows - 4; row++) {
                int countPlayer = 0;
                int countBlank = 0;
                for (int i = 0; i < 4; i++) {
                    if (board[row + i][col].getStatus() == player)
                        countPlayer++;
                    else if (board[row + i][col].getStatus() == Status.BLANK)
                        countBlank++;
                }
                score += scoreWindow(countPlayer, countBlank);
            }
        }
        // Evaluate diagonal (bottom-right) windows.
        for (int row = 0; row <= rows - 4; row++) {
            for (int col = 0; col <= cols - 4; col++) {
                int countPlayer = 0;
                int countBlank = 0;
                for (int i = 0; i < 4; i++) {
                    if (board[row + i][col + i].getStatus() == player)
                        countPlayer++;
                    else if (board[row + i][col + i].getStatus() == Status.BLANK)
                        countBlank++;
                }
                score += scoreWindow(countPlayer, countBlank);
            }
        }
        // Evaluate diagonal (top-right) windows.
        for (int row = 3; row < rows; row++) {
            for (int col = 0; col <= cols - 4; col++) {
                int countPlayer = 0;
                int countBlank = 0;
                for (int i = 0; i < 4; i++) {
                    if (board[row - i][col + i].getStatus() == player)
                        countPlayer++;
                    else if (board[row - i][col + i].getStatus() == Status.BLANK)
                        countBlank++;
                }
                score += scoreWindow(countPlayer, countBlank);
            }
        }
        return score;
    }

    /**
     * Scores a window of 4 cells based on the number of cells occupied by the player and blanks.
     * 
     * @param countPlayer the number of player's markers in the window
     * @param countBlank the number of blank cells in the window
     * @return a score for this window configuration
     */
    private int scoreWindow(int countPlayer, int countBlank) {
        int score = 0;
        if (countPlayer == 4) {
            score += 100;
        } else if (countPlayer == 3 && countBlank == 1) {
            score += 10;
        } else if (countPlayer == 2 && countBlank == 2) {
            score += 5;
        }
        return score;
    }

    /**
     * Checks the board state to see if a winning condition or draw has been reached.
     * 
     * @param board the board state to check
     * @return Status.RED_WIN, Status.YELLOW_WIN, Status.DRAW, or Status.ONGOING
     */
    private Status checkGameStatus(Position[][] board) {
        int rows = board.length;
        int cols = board[0].length;
        // Check all board positions for a win.
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                Status current = board[row][col].getStatus();
                if (current == Status.BLANK)
                    continue;
                // Check horizontal.
                if (col + 3 < cols &&
                    current == board[row][col + 1].getStatus() &&
                    current == board[row][col + 2].getStatus() &&
                    current == board[row][col + 3].getStatus()) {
                    return (current == Status.RED) ? Status.RED_WIN : Status.YELLOW_WIN;
                }
                // Check vertical.
                if (row + 3 < rows &&
                    current == board[row + 1][col].getStatus() &&
                    current == board[row + 2][col].getStatus() &&
                    current == board[row + 3][col].getStatus()) {
                    return (current == Status.RED) ? Status.RED_WIN : Status.YELLOW_WIN;
                }
                // Check diagonal (bottom-right).
                if (row + 3 < rows && col + 3 < cols &&
                    current == board[row + 1][col + 1].getStatus() &&
                    current == board[row + 2][col + 2].getStatus() &&
                    current == board[row + 3][col + 3].getStatus()) {
                    return (current == Status.RED) ? Status.RED_WIN : Status.YELLOW_WIN;
                }
                // Check diagonal (top-right).
                if (row - 3 >= 0 && col + 3 < cols &&
                    current == board[row - 1][col + 1].getStatus() &&
                    current == board[row - 2][col + 2].getStatus() &&
                    current == board[row - 3][col + 3].getStatus()) {
                    return (current == Status.RED) ? Status.RED_WIN : Status.YELLOW_WIN;
                }
            }
        }
        // Check for any blank spaces; if none, it's a draw.
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (board[row][col].getStatus() == Status.BLANK)
                    return Status.ONGOING;
            }
        }
        return Status.DRAW;
    }

    /**
     * Simulates dropping a marker in the given column on the provided board.
     * 
     * @param board the board state before the move
     * @param col the column in which to drop the marker
     * @param player the player's marker (Status.RED or Status.YELLOW)
     * @return a new board state after the move is applied
     */
    private Position[][] simulateMove(Position[][] board, int col, Status player) {
        Position[][] newBoard = cloneBoard(board);
        int rows = newBoard.length;
        // Drop the marker into the lowest available row in the column.
        for (int row = rows - 1; row >= 0; row--) {
            if (newBoard[row][col].getStatus() == Status.BLANK) {
                newBoard[row][col] = new Position(row, col, player);
                break;
            }
        }
        return newBoard;
    }

    /**
     * Creates a deep copy of the board.
     * 
     * @param board the board state to copy
     * @return a cloned board
     */
    private Position[][] cloneBoard(Position[][] board) {
        int rows = board.length;
        int cols = board[0].length;
        Position[][] newBoard = new Position[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                newBoard[i][j] = new Position(i, j, board[i][j].getStatus());
            }
        }
        return newBoard;
    }

    /**
     * Retrieves the list of valid columns for a move based on the board state.
     * A move is valid if the top row of that column is blank.
     * 
     * @param board the board state
     * @return a list of valid column indices
     */
    private List<Integer> getValidActions(Position[][] board) {
        List<Integer> validActions = new ArrayList<>();
        int cols = board[0].length;
        for (int col = 0; col < cols; col++) {
            if (board[0][col].getStatus() == Status.BLANK) {
                validActions.add(col);
            }
        }
        return validActions;
    }
}
