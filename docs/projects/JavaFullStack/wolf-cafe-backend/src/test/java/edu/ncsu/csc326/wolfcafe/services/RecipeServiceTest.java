
/**
 *
 */
package edu.ncsu.csc326.wolfcafe.services;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeIngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.menu.MenuDto;
import edu.ncsu.csc326.wolfcafe.dto.menu.MenuRecipeDto;
import edu.ncsu.csc326.wolfcafe.dto.orders.OrderDto;
import edu.ncsu.csc326.wolfcafe.dto.orders.OrderItemDto;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Recipe;
import edu.ncsu.csc326.wolfcafe.entity.inventory.RecipeIngredient;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import edu.ncsu.csc326.wolfcafe.service.IngredientService;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
import edu.ncsu.csc326.wolfcafe.service.MenuService;
import edu.ncsu.csc326.wolfcafe.service.OrderService;
import edu.ncsu.csc326.wolfcafe.service.RecipeService;

// units test for RecipeService
@SpringBootTest
class RecipeServiceTest {

    /** Links in the RecipeService for usage in our tests **/
    @Autowired
    private RecipeService        recipeService;

    /** Links in the ingredient repository for usage in our tests **/
    @Autowired
    private IngredientService    ingredientService;

    @Autowired
    private MenuService          menuService;

    @Autowired
    private OrderService         orderService;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private LocationService      locationService;

    @Autowired
    private DatabaseCleanupUtil  databaseCleanupUtil;

    private final ModelMapper    modelMapper = new ModelMapper();

    /**
     * @throws java.lang.Exception
     */
    @BeforeEach
    void setUp () throws Exception {
        databaseCleanupUtil.truncateAllTables();
    }

    /**
     * Test method for
     * {@link edu.ncsu.csc326.coffee_maker.services.RecipeService#createRecipe(edu.ncsu.csc326.wolfcafe.dto.inventory.coffee_maker.dto.RecipeDto)}.
     */
    @Test
    @Transactional
    public void testCreateRecipe () {
        final RecipeDto recipeDto = new RecipeDto( 0L, "Coffee", 50, new ArrayList<>() );
        final RecipeDto savedRecipe = recipeService.createRecipe( recipeDto );
        assertAll( "Recipe contents", () -> assertTrue( savedRecipe.getId() >= 1L ),
                () -> assertEquals( "Coffee", savedRecipe.getName() ),
                () -> assertEquals( 50, savedRecipe.getPrice() ) );

        final RecipeDto retrievedRecipe = recipeService.getRecipeById( savedRecipe.getId() );
        assertAll( "Recipe contents", () -> assertEquals( savedRecipe.getId(), retrievedRecipe.getId() ),
                () -> assertEquals( "Coffee", retrievedRecipe.getName() ),
                () -> assertEquals( 50, retrievedRecipe.getPrice() ) );
    }

    /**
     * Test method for
     * {@link edu.ncsu.csc326.coffee_maker.services.RecipeService#isDuplicateName(java.lang.String)}.
     */
    @Test
    void testIsDuplicateName () {
        final RecipeDto recipeDto = new RecipeDto( 0L, "Coffee", 50, new ArrayList<>() );
        final RecipeDto savedRecipe = recipeService.createRecipe( recipeDto );

        assertTrue( recipeService.isDuplicateName( "Coffee", -1 ) );
        assertFalse( recipeService.isDuplicateName( "Latte", -1 ) );
    }

    /**
     * Test method for
     * {@link edu.ncsu.csc326.coffee_maker.services.RecipeService#getAllRecipes()}.
     */
    @Test
    void testGetAllRecipes () {
        final RecipeDto recipeDto = new RecipeDto( 0L, "Coffee", 50, new ArrayList<>() );
        final RecipeDto savedRecipe = recipeService.createRecipe( recipeDto );
        final RecipeDto recipeDto2 = new RecipeDto( 0L, "Latte", 50, new ArrayList<>() );
        final RecipeDto savedRecipe2 = recipeService.createRecipe( recipeDto2 );
        final List<RecipeDto> recipeList = recipeService.getAllRecipes();
        final RecipeDto listRecipe = recipeList.get( 0 );
        final RecipeDto listRecipe2 = recipeList.get( 1 );
        assertAll( "Recipe contents", () -> assertTrue( listRecipe.getId() >= 1L ),
                () -> assertEquals( "Coffee", listRecipe.getName() ), () -> assertEquals( 50, listRecipe.getPrice() ) );

        assertAll( "Recipe contents", () -> assertTrue( listRecipe2.getId() >= 1L ),
                () -> assertEquals( "Latte", listRecipe2.getName() ),
                () -> assertEquals( 50, listRecipe2.getPrice() ) );

    }

    /**
     * Test method for
     * {@link edu.ncsu.csc326.coffee_maker.services.RecipeService#updateRecipe(java.lang.Long, edu.ncsu.csc326.wolfcafe.dto.inventory.coffee_maker.dto.RecipeDto)}.
     */
    @Test
    void testUpdateRecipe () {
        final Recipe recipeDto = new Recipe( null, "Coffee", 50, new ArrayList<>() );
        final Ingredient milk = new Ingredient( "Milk" );
        final Ingredient sugar = new Ingredient( "Sugar" );

        ingredientRepository.saveAll( List.of( milk, sugar ) );

        recipeDto.addIngredient( new RecipeIngredient( null, recipeDto, sugar, 5 ) );
        final RecipeDto savedRecipe = recipeService.createRecipe( modelMapper.map( recipeDto, RecipeDto.class ) );
        assertAll( "Recipe contents", () -> assertTrue( savedRecipe.getId() >= 1L ),
                () -> assertEquals( "Coffee", savedRecipe.getName() ),
                () -> assertEquals( 50, savedRecipe.getPrice() ) );
        assertEquals( "Sugar", savedRecipe.getIngredients().get( 0 ).getIngredient().getName() );
        assertEquals( 5, savedRecipe.getIngredients().get( 0 ).getAmount() );

        recipeDto.addIngredient( milk, 3 );
        recipeDto.setName( "Tea" );
        recipeDto.setPrice( 20 );
        recipeDto.removeIngredient( sugar );
        recipeDto.setId( savedRecipe.getId() );

        final RecipeDto savedRecipe2 = recipeService.updateRecipe( modelMapper.map( recipeDto, RecipeDto.class ) );
        assertAll( "Recipe contents", () -> assertTrue( savedRecipe2.getId() >= 1L ),
                () -> assertEquals( "Tea", savedRecipe2.getName() ),
                () -> assertEquals( 20, savedRecipe2.getPrice() ) );
        assertEquals( "Milk", savedRecipe2.getIngredients().get( 0 ).getIngredient().getName() );
        assertEquals( 3, savedRecipe2.getIngredients().get( 0 ).getAmount() );
    }

    /**
     * Test method for
     * {@link edu.ncsu.csc326.coffee_maker.services.RecipeService#deleteRecipe(java.lang.Long)}.
     */
    @Test
    void testDeleteRecipe () {
        final RecipeDto recipeDto = new RecipeDto( 0L, "Coffee", 50, new ArrayList<>() );
        final RecipeDto savedRecipe = recipeService.createRecipe( recipeDto );
        assertAll( "Recipe contents", () -> assertTrue( savedRecipe.getId() >= 1L ),
                () -> assertEquals( "Coffee", savedRecipe.getName() ),
                () -> assertEquals( 50, savedRecipe.getPrice() ) );
        recipeService.deleteRecipe( savedRecipe.getId() );
        assertThrows( ResourceNotFoundException.class, () -> recipeService.getRecipeByName( "Coffee" ) );
        assertThrows( ResourceNotFoundException.class, () -> recipeService.getRecipeById( savedRecipe.getId() ) );

    }

    @Test
    @Transactional
    void testUpdateRecipeIllegalAccessError () {
        // Create and save an ingredient
        IngredientDto sugar = new IngredientDto( "Sugar" );
        sugar = modelMapper.map( ingredientRepository.save( modelMapper.map( sugar, Ingredient.class ) ),
                IngredientDto.class );

        // Create and save a recipe
        final RecipeDto recipe = new RecipeDto( null, "Coffee", 50, new ArrayList<>() );
        recipe.addIngredient( new RecipeIngredientDto( null, null, sugar, 5 ) );
        final RecipeDto savedRecipe = recipeService.createRecipe( modelMapper.map( recipe, RecipeDto.class ) );

        // Create and save a location
        LocationDto location = new LocationDto();
        location.setName( "Downtown Cafe" );
        location.setAddress( "123 Main St" );
        location.setTaxRate( 7.5 );
        location.setEndOfDayTime( LocalTime.of( 18, 0 ) );
        location = locationService.createLocation( location );

        // Create and save an order with the location
        final OrderDto order = new OrderDto();
        order.setStatus( "FINISHED" );
        order.setLocation( location );

        // Add the recipe to the order
        final OrderItemDto orderItem = new OrderItemDto();
        orderItem.setRecipe( savedRecipe );
        order.setOrderedItems( new ArrayList<>() );
        order.getOrderedItems().add( orderItem );
        orderService.createOrder( order );

        // Attempt to update the recipe
        savedRecipe.setName( "Updated Coffee" );
        savedRecipe.setPrice( 60 );

        final RecipeDto updatedRecipeDto = modelMapper.map( savedRecipe, RecipeDto.class );

        // Verify that an IllegalAccessError is thrown
        final IllegalAccessError exception = assertThrows( IllegalAccessError.class, () -> {
            recipeService.updateRecipe( updatedRecipeDto );
        } );

        assertEquals( null, exception.getMessage() );
    }

    @Transactional
    @Test
    void testDeleteMenuRecipe () {

        LocationDto location = new LocationDto( 1L, "Test Cafe", "456 Test St", 7.5, null, null,
                LocalTime.of( 18, 0 ) );

        location = locationService.createLocation( location );

        final IngredientDto ingredientDto = new IngredientDto( 0L, "Tomato" ); // Example
                                                                               // ingredient
        final IngredientDto savedIngredient = ingredientService.createIngredientZeroQuantity( ingredientDto );

        final RecipeDto recipeDto = new RecipeDto( 0L, "Pizza", 120, new ArrayList<>() );
        recipeDto.addIngredient( new RecipeIngredientDto( null, null, savedIngredient, 3 ) );
        final RecipeDto savedRecipe = recipeService.createRecipe( recipeDto );

        final MenuDto newMenu = menuService.getMenu( location.getId() );
        final MenuRecipeDto newMenuRecipe = new MenuRecipeDto();
        newMenuRecipe.setIncluded( true );
        newMenuRecipe.setMenuId( location.getMenuId() );
        newMenuRecipe.setRecipe( savedRecipe );
        newMenu.getRecipeList().add( newMenuRecipe );
        newMenu.setItemList( new ArrayList<>() );

        menuService.updateMenuForLocation( newMenu, location.getId() );

        assertFalse( menuService.getMenu( location.getId() ).getRecipeList().isEmpty() );

        recipeService.deleteRecipe( savedRecipe.getId() );

        assertTrue( menuService.getMenu( location.getId() ).getRecipeList().isEmpty() );

    }
}
