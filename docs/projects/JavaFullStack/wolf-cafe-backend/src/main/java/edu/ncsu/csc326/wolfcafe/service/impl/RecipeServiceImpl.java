package edu.ncsu.csc326.wolfcafe.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.InventoryItemDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeIngredientDto;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Recipe;
import edu.ncsu.csc326.wolfcafe.entity.inventory.RecipeIngredient;
import edu.ncsu.csc326.wolfcafe.entity.menu.Menu;
import edu.ncsu.csc326.wolfcafe.entity.menu.MenuRecipe;
import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import edu.ncsu.csc326.wolfcafe.entity.orders.OrderItem;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.RecipeRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRecipeRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuRepository;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderRepository;
import edu.ncsu.csc326.wolfcafe.service.InventoryService;
import edu.ncsu.csc326.wolfcafe.service.RecipeService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

/**
 * Implementation of the RecipeService interface.
 */
@Service
public class RecipeServiceImpl implements RecipeService {

    /** Connection to the repository to work with the DAO + database */
    @Autowired
    private RecipeRepository     recipeRepository;

    /** Connection to the repository to work with the DAO + database */
    @Autowired
    private IngredientRepository ingredientRepository;

    /** Connection to the repository to work with the DAO + database */
    @Autowired
    private MenuRepository       menuRepository;

    /** Connection to the repository to work with the DAO + database */
    @Autowired
    private MenuRecipeRepository menuRecipeRepository;

    /** Connection to the service to work with the DAO + database */
    @Autowired
    private InventoryService     inventoryService;

    /** Autowires the order repository */
    @Autowired
    private OrderRepository      orderRepository;

    @Autowired
    private EntityManager        entityManager;

    private final ModelMapper    modelMapper = new ModelMapper();

    /**
     * Creates a recipe with the given information.
     *
     * @param recipeDto
     *            recipe to create
     * @return created recipe
     */
    @Override
    @Transactional
    public RecipeDto createRecipe ( final RecipeDto recipeDto ) {
        final Recipe recipe = modelMapper.map( recipeDto, Recipe.class );

        final List<RecipeIngredient> attachedIngredients = new ArrayList<>();
        for ( final RecipeIngredientDto ingredientDto : recipeDto.getIngredients() ) {
            final RecipeIngredient ingredient = new RecipeIngredient();
            ingredient.setIngredient( modelMapper.map( ingredientDto.getIngredient(), Ingredient.class ) );
            ingredient.setAmount( ingredientDto.getAmount() );
            ingredient.setRecipe( recipe ); // Link to the parent recipe
            attachedIngredients.add( ingredient );
        }
        recipe.setIngredients( attachedIngredients );

        final Recipe savedRecipe = recipeRepository.save( recipe );
        return modelMapper.map( savedRecipe, RecipeDto.class );
    }

    /**
     * Returns the recipe with the given id.
     *
     * @param recipeId
     *            recipe's id
     * @return the recipe with the given id
     * @throws ResourceNotFoundException
     *             if the recipe doesn't exist
     */
    @Override
    public RecipeDto getRecipeById ( final Long recipeId ) {
        final Recipe recipe = recipeRepository.findById( recipeId )
                .orElseThrow( () -> new ResourceNotFoundException( "Recipe does not exist with id " + recipeId ) );
        return modelMapper.map( recipe, RecipeDto.class );
    }

    /**
     * Returns the recipe with the given name
     *
     * @param recipeName
     *            recipe's name
     * @return the recipe with the given name.
     * @throws ResourceNotFoundException
     *             if the recipe doesn't exist
     */
    @Override
    public RecipeDto getRecipeByName ( final String recipeName ) {
        final Recipe recipe = recipeRepository.findByName( recipeName )
                .orElseThrow( () -> new ResourceNotFoundException( "Recipe does not exist with name " + recipeName ) );
        return modelMapper.map( recipe, RecipeDto.class );
    }

    /**
     * Returns true if the recipe already exists in the database.
     *
     * @param recipeName
     *            recipe's name to check
     * @return true if already in the database
     */
    @Override
    public boolean isDuplicateName ( final String recipeName, final long existingRecipeId ) {
        for ( final RecipeDto dto : getAllRecipes() ) {
            if ( dto.getId() != existingRecipeId && dto.getName().equalsIgnoreCase( recipeName ) ) {
                return true;
            }
        }

        return false;

    }

    /**
     * Returns a list of all the recipes
     *
     * @return all the recipes
     */
    @Override
    public List<RecipeDto> getAllRecipes () {
        final List<Recipe> recipes = recipeRepository.findAll();
        return recipes.stream().map( ( recipe ) -> modelMapper.map( recipe, RecipeDto.class ) )
                .collect( Collectors.toList() );
    }

    /**
     * Updates the recipe with the given id with the recipe information
     *
     * @param recipeId
     *            id of recipe to update
     * @param recipeDto
     *            values to update
     * @return updated recipe
     * @throws ResourceNotFoundException
     *             if the recipe doesn't exist
     */
    @Override
    public RecipeDto updateRecipe ( final RecipeDto recipeDto ) {
        // Check if the recipe exists
        final Recipe existingRecipe = recipeRepository.findById( recipeDto.getId() ).orElseThrow(
                () -> new ResourceNotFoundException( "Recipe does not exist with id " + recipeDto.getId() ) );

        for ( final Order order : orderRepository.findAll() ) {
            for ( final OrderItem oi : order.getOrderedItems() ) {
                if ( oi.getRecipe() != null && oi.getRecipe().getName().equals( existingRecipe.getName() ) ) {
                    throw new IllegalAccessError();
                }
            }
        }
        // Update recipe fields
        existingRecipe.setName( recipeDto.getName() );
        existingRecipe.setPrice( recipeDto.getPrice() );

        // Clear existing ingredients and set new ones
        existingRecipe.getIngredients().clear();
        for ( final RecipeIngredientDto ingredientDto : recipeDto.getIngredients() ) {
            // Check if the ingredient already exists in the repository by ID
            final Ingredient ingredient = ingredientRepository.findById( ingredientDto.getIngredient().getId() )
                    .orElseThrow( () -> new ResourceNotFoundException(
                            "Ingredient does not exist with id " + ingredientDto.getIngredient().getId() ) );

            // Create a new RecipeIngredient entity
            final RecipeIngredient recipeIngredient = new RecipeIngredient( null, existingRecipe, ingredient,
                    ingredientDto.getAmount() );

            // Add the RecipeIngredient entity to the existing recipe
            existingRecipe.getIngredients().add( recipeIngredient );
        }

        // Save updated recipe
        final Recipe savedRecipe = recipeRepository.save( existingRecipe );

        // Return updated RecipeDto
        return modelMapper.map( savedRecipe, RecipeDto.class );
    }

    /**
     * Deletes the recipe with the given id
     *
     * @param recipeId
     *            recipe's id
     * @throws ResourceNotFoundException
     *             if the recipe doesn't exist
     */
    @Transactional
    @Override
    public void deleteRecipe ( final Long recipeId ) {
        final Recipe recipe = recipeRepository.findById( recipeId )
                .orElseThrow( () -> new ResourceNotFoundException( "Recipe does not exist with id " + recipeId ) );
        for ( final Order order : orderRepository.findAll() ) {
            for ( final OrderItem oi : order.getOrderedItems() ) {
                if ( oi.getRecipe() != null && oi.getRecipe().getName().equals( recipe.getName() ) ) {
                    throw new IllegalAccessError();
                }
            }
        }

        for ( final InventoryDto inventory : inventoryService.getAllInventories() ) {
            final List<InventoryItemDto> iis = inventory.getItems();
            for ( int i = 0; i < iis.size(); i++ ) {
                final InventoryItemDto ii = iis.get( i );
                if ( ii.getItem() != null && ii.getItem().getName().equals( recipe.getName() ) ) {
                    iis.remove( i );
                    i--;
                }
            }
            inventoryService.updateInventory( inventory );
        }

        for ( final Menu menu : menuRepository.findAll() ) {
            final List<MenuRecipe> menuRecipes = menu.getRecipeList();
            for ( int i = 0; i < menuRecipes.size(); i++ ) {
                final MenuRecipe menuRecipe = menuRecipes.get( i );
                if ( menuRecipe.getRecipe() != null && menuRecipe.getRecipe().getName().equals( recipe.getName() ) ) {
                    menuRecipes.remove( i );
                    i--;
                    menuRecipeRepository.deleteById( menuRecipe.getId() );
                }
            }
            menu.setRecipeList( menuRecipes );
            menuRepository.save( menu );
        }

        entityManager.joinTransaction();
        entityManager.createNativeQuery( "SET FOREIGN_KEY_CHECKS = 0" ).executeUpdate();
        recipeRepository.delete( recipe );
    }

    /**
     * @Override public RecipeDto addIngredient ( final long recipeId, final
     *           IngredientDto ingredientDto ) { final Recipe recipe =
     *           recipeRepository.findById( recipeId ) .orElseThrow( () -> new
     *           ResourceNotFoundException( "Recipe does not exist with id " +
     *           recipeId ) );
     *
     *           final Ingredient ingredient = IngredientMapper.mapToIngredient(
     *           ingredientDto ); recipe.addIngredient( ingredient ); final
     *           Recipe savedRecipe = recipeRepository.save( recipe ); return
     *           RecipeMapper.mapToRecipeDto( savedRecipe ); }
     *
     * @Override public RecipeDto editIngredient ( final long recipeId, final
     *           IngredientDto ingredientDto ) { final Recipe recipe =
     *           recipeRepository.findById( recipeId ) .orElseThrow( () -> new
     *           ResourceNotFoundException( "Recipe does not exist with id " +
     *           recipeId ) ); final Ingredient ingredient =
     *           IngredientMapper.mapToIngredient( ingredientDto );
     *
     *           recipe.setIngredientAmount( ingredient,
     *           ingredientDto.getAmount() ); final Recipe savedRecipe =
     *           recipeRepository.save( recipe ); return
     *           RecipeMapper.mapToRecipeDto( savedRecipe ); }
     *
     * @Override public RecipeDto deleteIngredient ( final long recipeId, final
     *           IngredientDto ingredientDto ) { final Recipe recipe =
     *           recipeRepository.findById( recipeId ) .orElseThrow( () -> new
     *           ResourceNotFoundException( "Recipe does not exist with id " +
     *           recipeId ) ); final Ingredient ingredient =
     *           IngredientMapper.mapToIngredient( ingredientDto );
     *
     *           recipe.removeIngredient( ingredient ); final Recipe savedRecipe
     *           = recipeRepository.save( recipe ); return
     *           RecipeMapper.mapToRecipeDto( savedRecipe ); }
     */

}
