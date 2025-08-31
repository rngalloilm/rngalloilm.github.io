package edu.ncsu.csc326.wolfcafe.controller;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ncsu.csc326.wolfcafe.DatabaseCleanupUtil;
import edu.ncsu.csc326.wolfcafe.TestUtils;
import edu.ncsu.csc326.wolfcafe.dto.LocationDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.ItemDto;
import edu.ncsu.csc326.wolfcafe.dto.inventory.RecipeDto;
import edu.ncsu.csc326.wolfcafe.dto.menu.MenuDto;
import edu.ncsu.csc326.wolfcafe.dto.menu.MenuItemDto;
import edu.ncsu.csc326.wolfcafe.dto.menu.MenuRecipeDto;
import edu.ncsu.csc326.wolfcafe.dto.requests.CreateItemRequest;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Ingredient;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Item;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Recipe;
import edu.ncsu.csc326.wolfcafe.entity.inventory.RecipeIngredient;
import edu.ncsu.csc326.wolfcafe.entity.menu.MenuItem;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.IngredientRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.ItemRepository;
import edu.ncsu.csc326.wolfcafe.repositories.menu.MenuItemRepository;
import edu.ncsu.csc326.wolfcafe.service.LocationService;
import edu.ncsu.csc326.wolfcafe.service.MenuService;
import edu.ncsu.csc326.wolfcafe.service.RecipeService;
import jakarta.transaction.Transactional;

// Test class for Menu Controller
@SpringBootTest
@AutoConfigureMockMvc
class MenuControllerTest {

    @Autowired
    private MockMvc                   mvc;

    /** Reference to recipe service */
    @Autowired
    private RecipeService             recipeService;

    /** Reference to ingredient repository */
    @Autowired
    private IngredientRepository      ingredientRepository;

    @Autowired
    private ItemRepository            itemRepository;

    @Autowired
    private LocationService           locationService;

    @Autowired
    private MenuItemRepository        menuItemRepository;

    @Autowired
    private MenuService               menuService;

    @Autowired
    private DatabaseCleanupUtil       databaseCleanupUtil;

    private final ModelMapper         modelMapper      = new ModelMapper();
    private static final ObjectMapper mapper           = new ObjectMapper();
    private static final String       API_PATH         = "/api/menu";
    private static final String       ENCODING         = "utf-8";
    private static final String       ITEM_NAME        = "Coffee";
    private static final String       ITEM_DESCRIPTION = "Coffee is life";
    private static final double       ITEM_PRICE       = 3.25;

    private Long                      locationId;

    /**
     * Sets up the test case.
     *
     * @throws java.lang.Exception
     *             if error
     */
    @BeforeEach
    public void setUp () throws Exception {
        // Clean up the database before each test
        databaseCleanupUtil.truncateAllTables();

        // Create and save a single location
        LocationDto locationDto = new LocationDto( null, "Downtown", "123 Main St", 0.07, null, null,
                LocalTime.of( 18, 0 ) );
        locationDto = locationService.createLocation( locationDto );
        locationId = locationDto.getId();

        // Ensure a menu exists for this location
        MenuDto existingMenu = null;
        try {
            existingMenu = menuService.getMenu( locationId );
        }
        catch ( final Exception e ) {
            // If no menu exists, create one
            final MenuDto newMenu = new MenuDto();
            newMenu.setLocation( modelMapper.map( locationService.getLocation( locationId ), LocationDto.class ) );
            newMenu.setRecipeList( new ArrayList<>() );
            newMenu.setItemList( new ArrayList<>() );
            existingMenu = menuService.updateMenuForLocation( newMenu, locationId );
        }
    }

    /**
     * Tests the creation of recipes and associating them with the menu.
     *
     * Verifies that: - Valid recipes are created and included/excluded
     * correctly in the menu.
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform calls.
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    @Transactional
    public void testAddRecipeToMenu () throws Exception {
        // Create Ingredients
        final Ingredient coffee = new Ingredient( "Coffee" );
        final Ingredient milk = new Ingredient( "Milk" );
        final Ingredient sugar = new Ingredient( "Sugar" );

        ingredientRepository.saveAll( List.of( coffee, milk, sugar ) );

        // Create Recipes
        final Recipe recipe1 = new Recipe( null, "Mocha", 200, new ArrayList<>() );
        recipe1.addIngredient( new RecipeIngredient( null, recipe1, coffee, 5 ) );
        recipe1.addIngredient( new RecipeIngredient( null, recipe1, milk, 3 ) );
        final RecipeDto savedRecipe1 = recipeService.createRecipe( modelMapper.map( recipe1, RecipeDto.class ) );

        final Recipe recipe2 = new Recipe( null, "Lemonade", 150, new ArrayList<>() );
        recipe2.addIngredient( new RecipeIngredient( null, recipe2, sugar, 10 ) );
        final RecipeDto savedRecipe2 = recipeService.createRecipe( modelMapper.map( recipe2, RecipeDto.class ) );

        final Recipe recipe3 = new Recipe( null, "Espresso", 100, new ArrayList<>() );
        recipe3.addIngredient( new RecipeIngredient( null, recipe3, coffee, 10 ) );
        final RecipeDto savedRecipe3 = recipeService.createRecipe( modelMapper.map( recipe3, RecipeDto.class ) );

        assertNotNull( savedRecipe1.getId() );
        assertNotNull( savedRecipe2.getId() );
        assertNotNull( savedRecipe3.getId() );

        // Create Item
        final ItemDto itemDto = new ItemDto();
        itemDto.setName( "Coffee" );
        itemDto.setDescription( "Coffee is life" );
        itemDto.setPrice( 5.00 );
        final ItemDto savedItem = modelMapper.map( itemRepository.save( modelMapper.map( itemDto, Item.class ) ),
                ItemDto.class );

        // Create MenuDto with Recipe and Item associations
        final MenuDto menuDto = new MenuDto();
        menuDto.setLocation( modelMapper.map( locationService.getLocation( locationId ), LocationDto.class ) );
        menuDto.setRecipeList( List.of( new MenuRecipeDto( null, savedRecipe1, locationId, true ), // Included
                new MenuRecipeDto( null, savedRecipe2, locationId, false ), // Excluded
                new MenuRecipeDto( null, savedRecipe3, locationId, true ) // Included
        ) );

        // Associate saved item with the menu
        final MenuItemDto menuItemDto = new MenuItemDto( null, savedItem, locationId, true );
        menuDto.setItemList( List.of( menuItemDto ) );

        // Perform PUT request to update menu
        mvc.perform( put( API_PATH + "/" + locationId ).contentType( MediaType.APPLICATION_JSON )
                .content( TestUtils.asJsonString( menuDto ) ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() );

        // Perform GET request to verify the menu
        mvc.perform( get( API_PATH + "/" + locationId ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.recipeList[?(@.recipe.name == 'Mocha')].included" ).value( true ) )
                .andExpect( jsonPath( "$.recipeList[?(@.recipe.name == 'Lemonade')].included" ).value( false ) )
                .andExpect( jsonPath( "$.recipeList[?(@.recipe.name == 'Espresso')].included" ).value( true ) )
                .andExpect( jsonPath( "$.itemList[?(@.item.name == 'Coffee')].included" ).value( true ) );
    }

    /**
     * Tests the creation of an item and associating it with the menu.
     *
     * Verifies that: - The item is created successfully. - The item is
     * correctly associated with the menu.
     *
     * @throws Exception
     *             if there is an error during the mockMvc perform calls.
     */
    @Test
    @WithMockUser ( username = "staff", roles = "STAFF" )
    public void testCreateItem () throws Exception {
        // Create Item DTO
        final ItemDto itemDto = new ItemDto();
        itemDto.setName( "Coffee" );
        itemDto.setDescription( "Coffee is life" );
        itemDto.setPrice( 3.25 );

        final CreateItemRequest ir = new CreateItemRequest();

        ir.setItemDto( itemDto );
        ir.setInitialAmount( 10 );
        ir.setLocationId( 1 );
        final String json = mapper.writeValueAsString( ir );

        // Perform POST request to create item
        mvc.perform( post( "/api/items" ).contentType( MediaType.APPLICATION_JSON ).characterEncoding( ENCODING )
                .content( json ).accept( MediaType.APPLICATION_JSON ) ).andExpect( status().isCreated() )
                .andExpect( jsonPath( "$.name", Matchers.equalTo( ITEM_NAME ) ) )
                .andExpect( jsonPath( "$.description", Matchers.equalTo( ITEM_DESCRIPTION ) ) )
                .andExpect( jsonPath( "$.price", Matchers.equalTo( ITEM_PRICE ) ) );

        // Retrieve the saved item entity to get its ID
        final Item savedItem = itemRepository.findAll().stream()
                .filter( queryItem -> queryItem.getName().equals( ITEM_NAME ) ).findAny()
                .orElseThrow( () -> new RuntimeException( "Could not find item!" ) );

        // Associate item with the menu
        final MenuItemDto menuItemDto = new MenuItemDto();
        menuItemDto.setItem( modelMapper.map( savedItem, ItemDto.class ) );
        menuItemDto.setIncluded( true );
        menuItemDto.setMenuId( locationId );
        final MenuItem menuItem = menuItemRepository.save( modelMapper.map( menuItemDto, MenuItem.class ) );

        // Fetch the menu, add the item, and update the menu
        final MenuDto menu = menuService.getMenu( locationId );
        menu.getItemList().add( modelMapper.map( menuItem, MenuItemDto.class ) );

        menuService.updateMenuForLocation( menu, locationId );

        // Perform GET request to verify the menu
        mvc.perform( get( API_PATH + "/" + locationId ).accept( MediaType.APPLICATION_JSON ) )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.itemList[?(@.item.name == '" + ITEM_NAME + "')].item.description" )
                        .value( ITEM_DESCRIPTION ) )
                .andExpect(
                        jsonPath( "$.itemList[?(@.item.name == '" + ITEM_NAME + "')].item.price" ).value( ITEM_PRICE ) )
                .andExpect( jsonPath( "$.location.name" ).value( "Downtown" ) )
                .andExpect( jsonPath( "$.location.address" ).value( "123 Main St" ) )
                .andExpect( jsonPath( "$.location.taxRate" ).value( 0.07 ) );
    }

}
