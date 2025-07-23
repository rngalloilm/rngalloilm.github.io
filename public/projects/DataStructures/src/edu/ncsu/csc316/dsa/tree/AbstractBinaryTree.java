package edu.ncsu.csc316.dsa.tree;

import edu.ncsu.csc316.dsa.Position;

/**
 * A skeletal implementation of the Binary Tree abstract data type. This class
 * provides implementation for common methods that can be implemented the same
 * no matter what specific type of concrete data structure is used to implement
 * the binary tree abstract data type.
 * 
 * @author Dr. King
 * @author // Your Name Here
 *
 * @param <E> the type of elements stored in the binary tree
 */
public abstract class AbstractBinaryTree<E> extends AbstractTree<E> implements BinaryTree<E> {
    
    
    @Override
    public Iterable<Position<E>> inOrder() {
        PositionCollection traversal = new PositionCollection();
        
        if (!isEmpty()) {
            inOrderHelper(root(), traversal);
        }
        
        return traversal;
    }
    
    private void inOrderHelper(Position<E> p, PositionCollection traversal) {
        if (left(p) != null) {
            inOrderHelper(left(p), traversal);
        }
        if(p.getElement() != null) {  // do not add sentinel nodes to the traversal
            traversal.add(p);
        }
        if (right(p) != null) {
            inOrderHelper(right(p), traversal);
        }
    }
    
    @Override
    public int numChildren(Position<E> p) {
        int count = 0;
        
        // If there is a left child, increment count
        if (left(p) != null) count++;
        // If there is a right child, increment count
        if (right(p) != null) count++;
        
        return count;
    }
    
    @Override
    public Position<E> sibling(Position<E> p) {
        // Get the parent of the position p
        Position<E> parent = parent(p);
        // If p is the root, it has no sibling
        if (parent == null) return null;

        if (p == left(parent)) {
            // p is a left child, so return its sibling on the right
            return right(parent);
        }
        else {
            // p is a right child, so return its sibling on the left
            return left(parent);
        }
    }
    
    @Override
    public Iterable<Position<E>> children(Position<E> p) {
        AbstractTreeNode<E> node = validate(p);
        PositionCollection childrenCollection = new PositionCollection();
        if (left(node) != null) {
            childrenCollection.add(left(node));
        }
        if (right(node) != null) {
            childrenCollection.add(right(node));
        }
        return childrenCollection;
    }
}
