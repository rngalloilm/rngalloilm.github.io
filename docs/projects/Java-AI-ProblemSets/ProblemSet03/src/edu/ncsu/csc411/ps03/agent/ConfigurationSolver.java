package edu.ncsu.csc411.ps03.agent;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import edu.ncsu.csc411.ps03.environment.Environment;

/**
	Represents a linear assignment problem where N workers must be assigned
	to N tasks. Each worker/task combination is further associated with some
	value. The goal of this task is the produce an optimal configuration that
	maximizes (or minimizes) the sum of the assigned worker/task values.
*/

public class ConfigurationSolver {
	private Environment env;
	private int[] configuration;
	private int[] bestConfiguration;
	
	// New fields for simulated annealing
    private double temperature;
    private double coolingRate;
    private Random rand;
	
	/** Initializes a Configuration Solver for a specific environment. */
	public ConfigurationSolver (Environment env) { 
		this.env = env;
		this.configuration = new int[this.env.getNumWorkers()];
		// Initializing by assigning work to an arbitrary task
		for(int i = 0; i < this.configuration.length; i++) {
			this.configuration[i] = i;
		}
		// Need to clone because of how Java handles assigning arrays
		// as values (relative referencing). Recall this is similar to
		// that one lecture in CSC 116 where if we don't duplicate the second
		// array, it will constantly change as this.configuration changes.
		// Cloning the array resolves this issue.
		this.bestConfiguration = this.configuration.clone();
		
		// Initialize parameters for simulated annealing.
        this.temperature = 100.0;     // starting temperature
        this.coolingRate = 0.995;       // cooling factor
        this.rand = new Random();
	}
	
	/**
    	Problem Set 03 - For this Problem Set, you will be exploring search
    	methods for optimal configurations. In this exercise, you are given
    	a linear assignment problem, where you must determine the appropriate
    	configuration assignments for persons to tasks. Specifically, you are
    	seeking to MAXIMIZE the fitness score of this configuration. While brute
    	forcing your search will provide you with the optimal solution, you run
    	into the issue that there are N! possible permutations, which can increase
    	your search space as N increases. Instead, utilize one of the search methods
    	presented in class to tackle this problem.
    	
    	For the updateSearch(), design an algorithm that will iterate through an
    	iterative optimization algorithm, updating the current configuration as it
    	traverses its search space. The updateSearch() method should also return this
    	configuration back to the environment. For example, in an N=5 problem space, 
    	updateSearch() may return {4,1,2,3,0}, where Worker #4 is assigned Task #3.
    	
    	NOTE - simply doing random search, while it "will" work, is not permitted. If we
    	see you implementation is just random search, you will receive a -40% penalty to
    	your submission. Instead, think about the meta-heuristics presented in class, which
    	use "controlled" randomization.
	 */

	/**
	 * updateSearch implements a simulated annealing algorithm to search
     * through the configuration space for the linear assignment problem.
     *
     * The algorithm works as follows:
     *   -Generate a neighboring configuration by randomly swapping two tasks.
     *   -Compute the candidate score and compare it to the current score.
     *   -If the candidate is better, accept it; otherwise, accept it with a probability
     *   that decreases as the difference in score becomes more negative and as the temperature
     *   decreases.
     *   -Update the best observed configuration if the new configuration is the best seen so far.
     *   -Finally, lower the temperature according to a cooling schedule.
     * This approach enables controlled randomization, allowing occasional moves to worse configurations
     * while generally moving toward higher-scoring configurations.
     * 
     * @return the updated configuration.
	 */
	public int[] updateSearch () {
		// Create a candidate by cloning the current configuration
        int[] candidate = this.configuration.clone();
        int n = candidate.length;
        
        // Generate two distinct random indices to swap
        int i = rand.nextInt(n);
        int j = rand.nextInt(n);
        while (j == i) {
            j = rand.nextInt(n);
        }
        // Swap the two elements to form a neighbor configuration
        int temp = candidate[i];
        candidate[i] = candidate[j];
        candidate[j] = temp;
        
        // Calculate the scores
        double currentScore = env.calcScore(configuration);
        double candidateScore = env.calcScore(candidate);
        
        // Decide whether to accept the candidate configuration
        // If candidate is better, accept it outright
        // Otherwise, accept it with a probability that depends on the temperature
        if (candidateScore > currentScore) {
            this.configuration = candidate;
        } else {
            double acceptanceProbability = Math.exp((candidateScore - currentScore) / temperature);
            if (rand.nextDouble() < acceptanceProbability) {
                this.configuration = candidate;
            }
        }
        
        // Update the best configuration seen so far
        if (env.calcScore(configuration) > env.calcScore(bestConfiguration)) {
            bestConfiguration = configuration.clone();
        }
        
        // Lower the temperature
        temperature *= coolingRate;
        
        // Debug print
        System.out.println(Arrays.toString(configuration) + " = " + env.calcScore(configuration));
        s
        return this.configuration;
	}
	
	/**
	 * In addition to updateSearch, you should also track you BEST OBSERVED CONFIGURATION.
	 * While your search may move to worse configurations (since that's what the algorithm
	 * needs to do), getBestConfiguration will return the best observed configuration by your
	 * agent.
	 * You do not need to change this method. Update bestConfiguration in updateSearch.
	*/
	public int[] getBestConfiguration() {
		return this.bestConfiguration;
	}
	
}