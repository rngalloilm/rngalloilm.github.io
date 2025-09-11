package edu.ncsu.csc326.wolfcafe.controller;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.TestUtils;
import edu.ncsu.csc326.wolfcafe.dto.inventory.IngredientDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeIngredientDto;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import jakarta.transaction.Transactional;

// unit test class for recipe controller
@SpringBootTest
@AutoConfigureMockMvc
public class RecipeControllerTest {
    /** Mock MVC for testing controller */
    @Autowired
    private MockMvc              mvc;

    /** Reference to ingredient repository */
    @Autowired
    private IngredientRepository ingredientRepository;

    private final ModelMapper    modelMapper = new ModelMapper();

    @Autowired
    private DatabaseCleanupUtil  databaseCleanupUtil;

    /**
     * Sets up the test case.
     *
     * @throws java.lang.Exception
     *             if error
     */
    @BeforeEach
    public void setUp () throws Exception {
        databaseCleanupUtil.truncateAllTables();
    }

    /**
     * Tests the retrieval of all recipes and the creation of a new recipe.
     *
     * This test verifies that the GET request to "/api/recipes" initially
     * returns no recipes containing "Mocha". It then creates a new "Mocha"
     * recipe with ingredients and checks that the new recipe is properly added
     * and retrievable.
     *
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform calls.
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Transactional
    public void testGetRecipes () throws Exception {
        final String recipe = mvc.perform( get( "/api/recipes" ) ).andDo( print() ).andExpect( status().isOk() )
                .andReturn().getResponse().getContentAsString();
        assertFalse( recipe.contains( "Mocha" ) );

        final IngredientDto coffeeDto = new IngredientDto( 0L, "Coffee" );
        final Ingredient coffeeIngredient = modelMapper.map( coffeeDto, Ingredient.class );
        final Ingredient savedCoffeeIngredient = ingredientRepository.save( coffeeIngredient );

        final RecipeDto recipeDto = new RecipeDto( 0L, "Mocha", 200, new ArrayList<>() );
        final RecipeIngredientDto coffee = new RecipeIngredientDto( null, null,
                modelMapper.map( savedCoffeeIngredient, IngredientDto.class ), 5 );
        recipeDto.getIngredients().add( coffee );

        System.out.println( TestUtils.asJsonString( recipeDto ) );
        System.out.println( "before /api/recipe create" );
        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( recipeDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.name" ).value( "Mocha" ) )
                .andExpect( jsonPath( "$.price" ).value( 200 ) );

        final String recipe2 = mvc.perform( get( "/api/recipes/Mocha" ) ).andDo( print() ).andExpect( status().isOk() )
                .andReturn().getResponse().getContentAsString();

        assertTrue( recipe2.contains( "Mocha" ) );
    }

    /**
     * Tests the creation of recipes with various scenarios.
     *
     * Verifies that: - A valid "Mocha" recipe is created successfully. - A
     * recipe with a zero price returns a bad request status. - A recipe with a
     * duplicate name returns a conflict status. - A recipe with negative
     * ingredient amounts returns a bad request status. - A recipe with no
     * ingredients returns a bad request status. - Valid recipes "Lemonade",
     * "Water", and "Espresso" are created successfully.
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform calls.
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Transactional
    public void testCreateRecipe () throws Exception {
        final IngredientDto coffeeIngredient = new IngredientDto( "Coffee" );
        final IngredientDto milkIngredient = new IngredientDto( "Milk" );
        final IngredientDto sugarIngredient = new IngredientDto( "Sugar" );
        final IngredientDto lemonsIngredient = new IngredientDto( "Lemons" );

        ingredientRepository.saveAll( List.of( modelMapper.map( coffeeIngredient, Ingredient.class ),
                modelMapper.map( milkIngredient, Ingredient.class ),
                modelMapper.map( sugarIngredient, Ingredient.class ),
                modelMapper.map( lemonsIngredient, Ingredient.class ) ) );

        final RecipeDto recipeDto = new RecipeDto( 0L, "Mocha", 200, new ArrayList<>() );
        final RecipeIngredientDto coffee = new RecipeIngredientDto( null, null, coffeeIngredient, 5 );
        final RecipeIngredientDto milk = new RecipeIngredientDto( null, null, milkIngredient, 3 );
        final RecipeIngredientDto sugar = new RecipeIngredientDto( null, null, sugarIngredient, 10 );
        recipeDto.addIngredient( coffee );
        recipeDto.addIngredient( milk );

        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( recipeDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.name" ).value( "Mocha" ) )
                .andExpect( jsonPath( "$.price" ).value( 200 ) );

        final RecipeDto invalidPriceRecipeDto = new RecipeDto( 1L, "Lemonade", 0, new ArrayList<>() );
        invalidPriceRecipeDto.addIngredient( sugar );
        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( invalidPriceRecipeDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isBadRequest() );

        final RecipeDto duplicateNameRecipeDto = new RecipeDto( 1L, "Mocha", 200, new ArrayList<>() );
        duplicateNameRecipeDto.addIngredient( coffee );
        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( duplicateNameRecipeDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isConflict() );

        final RecipeDto negativeIngredientsRecipeDto = new RecipeDto( 1L, "Lemonade", 200, new ArrayList<>() );
        final RecipeIngredientDto lemons = new RecipeIngredientDto( null, negativeIngredientsRecipeDto.getId(),
                lemonsIngredient, 1 );
        negativeIngredientsRecipeDto.addIngredient( sugar );
        negativeIngredientsRecipeDto.addIngredient( lemons );
        negativeIngredientsRecipeDto.setIngredientAmount( negativeIngredientsRecipeDto.getIngredients().get( 1 ), -1 );
        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( negativeIngredientsRecipeDto ) )
                .accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isBadRequest() );

        final RecipeDto noIngredientsDto = new RecipeDto( 1L, "Lemonade", 200, new ArrayList<>() );
        noIngredientsDto.addIngredient( sugar );
        noIngredientsDto.removeIngredient( sugar.getIngredient() );
        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( noIngredientsDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isBadRequest() );

        final RecipeDto recipeDto2 = new RecipeDto( 2L, "Lemonade", 200, new ArrayList<>() );
        recipeDto2.addIngredient( sugar );
        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( recipeDto2 ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.name" ).value( "Lemonade" ) )
                .andExpect( jsonPath( "$.price" ).value( 200 ) );

        final RecipeDto recipeDto3 = new RecipeDto( 3L, "Water", 50, new ArrayList<>() );
        recipeDto3.addIngredient( sugar );
        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( recipeDto3 ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.name" ).value( "Water" ) )
                .andExpect( jsonPath( "$.price" ).value( 50 ) );

        final RecipeDto recipeDto4 = new RecipeDto( 4L, "Espresso", 50, new ArrayList<>() );
        recipeDto4.addIngredient( coffee );

        mvc.perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( recipeDto4 ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isInsufficientStorage() );

    }

    /**
     * Tests updating an existing recipe.
     *
     * Verifies that an existing recipe can be updated with new details, such as
     * name, price, and ingredients, and that the changes are accurately
     * reflected in the system.
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform calls.
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Transactional
    public void testUpdateRecipe () throws Exception {
        // Create initial recipe with ingredients
        final RecipeDto recipeDto = new RecipeDto( 0L, "Mocha", 200, new ArrayList<>() );

        final IngredientDto coffeeIngredientDto = new IngredientDto( "Coffee" );
        final IngredientDto milkIngredientDto = new IngredientDto( "Milk" );

        ingredientRepository.saveAll( List.of( modelMapper.map( coffeeIngredientDto, Ingredient.class ),
                modelMapper.map( milkIngredientDto, Ingredient.class ) ) );

        final RecipeIngredientDto coffee = new RecipeIngredientDto( null, null, coffeeIngredientDto, 5 );
        final RecipeIngredientDto milk = new RecipeIngredientDto( null, null, milkIngredientDto, 3 );

        recipeDto.addIngredient( coffee );
        recipeDto.addIngredient( milk );

        // Save the recipe and get its ID
        final MvcResult result = mvc
                .perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                        .content( TestUtils.asJsonString( recipeDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.name" ).value( "Mocha" ) )
                .andExpect( jsonPath( "$.price" ).value( "200" ) ).andReturn();

        final String jsonResponse = result.getResponse().getContentAsString();
        final ObjectMapper objectMapper = new ObjectMapper();
        final Long recipeId = objectMapper.readTree( jsonResponse ).get( "id" ).asLong();

        // Update the recipe details
        recipeDto.setId( recipeId );
        recipeDto.setName( "Latte" );
        recipeDto.setPrice( 100 );
        recipeDto.removeIngredient( milk.getIngredient() );

        // Update the recipe and verify the changes
        mvc.perform( put( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( recipeDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.name" ).value( "Latte" ) )
                .andExpect( jsonPath( "$.price" ).value( "100" ) );
    }

    /**
     * Tests the deletion of a recipe.
     *
     * Verifies that a recipe can be created and deleted successfully. After
     * deletion, confirms that the recipe is no longer present in the system.
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform calls.
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Transactional
    public void testDeleteRecipe () throws Exception {
        // Create a new recipe with ingredients
        final RecipeDto recipeDto = new RecipeDto( 0L, "Mocha", 200, new ArrayList<>() );

        final IngredientDto coffeeIngredientDto = new IngredientDto( 1L, "Coffee" );
        final RecipeIngredientDto coffee = new RecipeIngredientDto( null, null, coffeeIngredientDto, 5 );
        recipeDto.addIngredient( coffee );

        // Save the recipe and get its ID
        final String response = mvc
                .perform( post( "/api/recipes" ).contentType( MediaType.APPLICATION_JSON )
                        .content( TestUtils.asJsonString( recipeDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() ).andExpect( jsonPath( "$.name" ).value( "Mocha" ) )
                .andExpect( jsonPath( "$.price" ).value( 200 ) ).andReturn().getResponse().getContentAsString();

        // Get the ID from the response
        final Long recipeId = JsonPath.parse( response ).read( "$.id", Long.class );

        // Execute the delete operation
        mvc.perform( delete( "/api/recipes/" + recipeId ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() );

        // Verify that the recipe no longer exists in the system
        final String recipesAfterDeletion = mvc.perform( get( "/api/recipes" ) ).andDo( print() )
                .andExpect( status().isOk() ).andReturn().getResponse().getContentAsString();

        assertFalse( recipesAfterDeletion.contains( "Mocha" ) );
    }

}
