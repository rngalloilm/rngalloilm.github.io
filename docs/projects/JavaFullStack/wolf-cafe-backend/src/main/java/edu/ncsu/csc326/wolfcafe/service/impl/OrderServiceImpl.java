package edu.ncsu.csc326.wolfcafe.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import edu.ncsu.csc326.wolfcafe.dto.orders.OrderDto;
import edu.ncsu.csc326.wolfcafe.dto.orders.OrderItemDto;
import edu.ncsu.csc326.wolfcafe.entity.Role;
import edu.ncsu.csc326.wolfcafe.entity.User;
import edu.ncsu.csc326.wolfcafe.entity.inventory.Inventory;
import edu.ncsu.csc326.wolfcafe.entity.inventory.InventoryItem;
import edu.ncsu.csc326.wolfcafe.entity.inventory.RecipeIngredient;
import edu.ncsu.csc326.wolfcafe.entity.orders.Order;
import edu.ncsu.csc326.wolfcafe.entity.orders.OrderItem;
import edu.ncsu.csc326.wolfcafe.exception.GeneralErrorException;
import edu.ncsu.csc326.wolfcafe.exception.ResourceNotFoundException;
import edu.ncsu.csc326.wolfcafe.repositories.UserRepository;
import edu.ncsu.csc326.wolfcafe.repositories.inventory.InventoryRepository;
import edu.ncsu.csc326.wolfcafe.repositories.orders.OrderRepository;
import edu.ncsu.csc326.wolfcafe.service.OrderService;
import edu.ncsu.csc326.wolfcafe.service.UserService;

/**
 * service class for an order
 */
@Service
public class OrderServiceImpl implements OrderService {
    /** Repository for accessing order data. */
    @Autowired
    private OrderRepository     orderRepository;
    /** Repository for accessing user data. */
    @Autowired
    private UserRepository      userRepository;
    /** Service for user-specific actions. */

    @Autowired
    private InventoryRepository inventoryRepository;
    /** the user service */
    @Autowired
    private UserService         userService;
    private final ModelMapper   modelMapper = new ModelMapper();
    /** SendGrid email service instance. */
    private final SendGrid      sendGrid;

    /**
     * Constructor to initialize SendGrid with the provided API key.
     *
     * @param apiKey
     *            the API key for SendGrid email service.
     */
    public OrderServiceImpl ( @Value ( "${sendgrid.api-key:DEFAULT_API_KEY}" ) final String apiKey ) {
        if ( apiKey.equals( "DEFAULT_API_KEY" ) ) {
            System.out.println(
                    "WARNING: API Key from SendGrid was not provided in applications.properties. Please define as sendgrid.api-key" );
            this.sendGrid = null;
        }
        else {
            this.sendGrid = new SendGrid( apiKey );
        }
    }

    /**
     * Creates a new order and saves it to the database.
     *
     * @param orderDto
     *            the order data transfer object containing order details.
     * @return the created order as a DTO.
     */
    @Override
    @Transactional
    public OrderDto createOrder ( final OrderDto orderDto ) {
        User customer = null;

        // Validate the user ID if provided
        if ( orderDto.getUserId() != null ) {
            customer = userRepository.findById( orderDto.getUserId() ).orElseThrow(
                    () -> new ResourceNotFoundException( "User not found with ID " + orderDto.getUserId() ) );

            final String existingRoles = customer.getRoles().stream().map( Role::getName )
                    .reduce( ( role1, role2 ) -> role1 + ", " + role2 ).orElse( "No roles assigned" );

            // Added role check to ensure the user has the role "Customer"
            if ( customer.getRoles() == null || customer.getRoles().stream()
                    .noneMatch( role -> role.getName().equalsIgnoreCase( "ROLE_CUSTOMER" ) ) ) {
                throw new GeneralErrorException(
                        "User must have the role 'Customer' to place an order. Roles: " + existingRoles );
            }
        }

        // Check if the email belongs to an existing user for anonymous orders
        if ( customer == null && orderDto.getEmail() != null ) {
            // Use findByUsernameOrEmail to check if email belongs to a
            // registered user
            final Optional<User> existingUser = userRepository.findByUsernameOrEmail( null, orderDto.getEmail() );
            if ( existingUser.isPresent() ) {
                throw new GeneralErrorException(
                        "The provided email already belongs to a registered user. Please log in to place an order." );
            }
        }

        // Validate location
        if ( orderDto.getLocation() == null ) {
            throw new GeneralErrorException( "Location must be provided!" );
        }

        // Validate tipRate (must be >= 0)
        if ( orderDto.getTipRate() < 0 ) {
            throw new GeneralErrorException( "Tip rate must be at least 0." );
        }

        // Map the DTO to the entity
        final Order order = modelMapper.map( orderDto, Order.class );

        // Rebuild the orderedItems list to ensure proper linkage
        final List<OrderItem> attachedItems = new ArrayList<>();
        for ( final OrderItem item : order.getOrderedItems() ) {
            final OrderItem newItem = new OrderItem();
            newItem.setItem( item.getItem() );
            newItem.setRecipe( item.getRecipe() );
            newItem.setQuantity( item.getQuantity() );
            newItem.setOrder( order ); // Link to the parent order
            attachedItems.add( newItem );
        }
        order.setOrderedItems( attachedItems );

        // Save the order and cascade save the items
        final Order savedOrder = orderRepository.save( order );

        // Update customer with the new order, if applicable
        if ( customer != null ) {
            customer.getOrders().add( savedOrder );
            userRepository.save( customer );
        }

        return modelMapper.map( savedOrder, OrderDto.class );
    }

    /**
     * Deletes an order by its ID.
     *
     * @param orderId
     *            the ID of the order to delete.
     */
    @Override
    public void deleteOrder ( final long orderId ) {
        final Order foundOrder = orderRepository.findById( orderId )
                .orElseThrow( () -> new ResourceNotFoundException( "Order does not exist with id " + orderId ) );
        orderRepository.delete( foundOrder );
    }

    /**
     * Retrieves an order by its ID.
     *
     * @param orderId
     *            the ID of the order to retrieve.
     * @return the order as a DTO.
     */

    @Override
    public OrderDto getOrder ( final long orderId ) {
        final Order foundOrder = orderRepository.findById( orderId )
                .orElseThrow( () -> new ResourceNotFoundException( "Order does not exist with id " + orderId ) );
        return modelMapper.map( foundOrder, OrderDto.class );
    }

    /**
     * Retrieves all orders with their associated ordered items.
     *
     * @return a list of all orders as DTOs.
     */

    @Override
    public List<OrderDto> getAllOrders () {
        return orderRepository.findAllWithOrderedItems().stream().map( order -> {
            final OrderDto orderDto = modelMapper.map( order, OrderDto.class );

            System.out.println( order.getOrderedItems().size() );

            final List<OrderItemDto> orderItemDtos = order.getOrderedItems().stream()
                    .map( orderItem -> modelMapper.map( orderItem, OrderItemDto.class ) )
                    .collect( Collectors.toList() );

            orderDto.setOrderedItems( orderItemDtos );

            return orderDto;
        } ).collect( Collectors.toList() );
    }

    /**
     * Updates the status of an order.
     *
     * @param id
     *            the ID of the order to update.
     * @param status
     *            the new status to set.
     * @return the updated order as a DTO.
     */

    @Override
    @Transactional
    public OrderDto updateOrderStatus ( final Long id, final String status ) {
        final Order order = orderRepository.findById( id )
                .orElseThrow( () -> new ResourceNotFoundException( "Order not found with id " + id ) );

        // Validate the status
        final List<String> validStatuses = Arrays.asList( "INVALIDATED", "IN_PROGRESS", "READY_FOR_PICKUP",
                "COMPLETED" );
        if ( !validStatuses.contains( status ) ) {
            throw new GeneralErrorException( "Invalid status update." );
        }

        // Fetch the current user (can be null for guests)
        User user = null;
        try {
            user = userService.fetchCurrentUser();
        }
        catch ( final Exception e ) {
            // User is not authenticated (guest)
        }

        if ( user != null ) {
            // Authenticated user
            final boolean isStaff = user.getRoles().stream().anyMatch( role -> "ROLE_STAFF".equals( role.getName() ) );
            final boolean isOrderOwner = order.getUser() != null && order.getUser().getId().equals( user.getId() );

            if ( !isStaff && !isOrderOwner ) {
                throw new GeneralErrorException( "You are not authorized to update this order." );
            }
        }
        else {
            // Guest user
            if ( order.getUser() != null ) {
                // Order belongs to a registered user; guests cannot modify it
                throw new GeneralErrorException( "You are not authorized to update this order." );
            }
            // Allow guest to update the status
        }

        if ( status.equals( "READY_FOR_PICKUP" ) ) {
            // Create a list of items / recipes that we can return to the user
            // in an email to create a better visual format to show their order
            // is ready
            final Inventory inventory = inventoryRepository.findAll().getLast();
            for ( final OrderItem oi : order.getOrderedItems() ) {
                if ( oi.getRecipe() != null ) {
                    for ( final RecipeIngredient ri : oi.getRecipe().getIngredients() ) {
                        final List<InventoryItem> iis = inventory.getInventoryItems();
                        for ( final InventoryItem ii : iis ) {
                            if ( ii.getIngredient() != null ) {
                                if ( ii.getIngredient().getName().equals( ri.getIngredient().getName() ) ) {
                                    if ( ii.getAmount() - ri.getAmount() * oi.getQuantity() >= 0 ) {
                                        ii.setAmount( ii.getAmount() - ri.getAmount() * oi.getQuantity() );
                                    }
                                    else {
                                        throw new IllegalArgumentException( "Not Enough Ingredients" );
                                    }
                                }
                            }
                        }
                        inventory.setInventoryItems( iis );

                    }
                }

                // Handle standalone items
                if ( oi.getItem() != null ) {
                    final List<InventoryItem> iis = inventory.getInventoryItems();
                    boolean itemFound = false;

                    for ( final InventoryItem ii : iis ) {
                        if ( ii.getItem() != null && ii.getItem().getName().equals( oi.getItem().getName() ) ) {
                            itemFound = true;
                            System.out.println( ii.getAmount() + " " + oi.getQuantity() );
                            if ( ii.getAmount() - oi.getQuantity() >= 0 ) {
                                ii.setAmount( ii.getAmount() - oi.getQuantity() );
                            }
                            else {
                                throw new IllegalArgumentException( "Not Enough Items" );
                            }
                            break;
                        }
                    }

                    if ( !itemFound ) {
                        throw new IllegalArgumentException( "Item not found in inventory: " + oi.getItem().getName() );
                    }
                }
            }
            inventoryRepository.save( inventory );
            final String itemsList = order.getOrderedItems().stream().map( orderItem -> {
                if ( orderItem.getRecipe() != null ) {
                    return orderItem.getRecipe().getName() + " (x" + orderItem.getQuantity() + ")";
                }
                else if ( orderItem.getItem() != null ) {
                    return orderItem.getItem().getName() + " (x" + orderItem.getQuantity() + ")";
                }
                else {
                    return "";
                }
            } ).filter( item -> !item.isEmpty() ).collect( Collectors.joining( ", " ) );

            final String emailBody = "Thank you for your order! Here are the items in your order: " + itemsList
                    + ". We hope to serve you again soon!";

            String recipientEmail = null;
            if ( order.getUser() != null ) {
                recipientEmail = order.getUser().getEmail();
            }
            else if ( order.getEmail() != null ) {
                recipientEmail = order.getEmail();
            }

            if ( recipientEmail != null && sendGrid != null ) {
                sendEmail( recipientEmail, "Your order #" + order.getId() + " is ready!", emailBody );
            }
            else if ( recipientEmail == null ) {
                System.out.println( "No email available to send notification for order #" + order.getId() );
            }
            else {
                System.out.println( "WARNING: Unable to send email, API key not defined." );
            }
        }

        // Update the order status
        order.setStatus( status );
        final Order updatedOrder = orderRepository.save( order );

        return modelMapper.map( updatedOrder, OrderDto.class );
    }

    /**
     * this is completed using https://sendgrid.com really nice national email
     * service, 100 free emails a day, no payment or anything needed
     **/
    public String sendEmail ( final String to, final String subject, final String body ) {
        final Email from = new Email( "jkaczma@ncsu.edu" );
        final Email toEmail = new Email( to );
        final Content content = new Content( "text/plain", body );
        final Mail mail = new Mail( from, subject, toEmail, content );

        final Request request = new Request();
        try {
            request.setMethod( Method.POST );
            request.setEndpoint( "mail/send" );
            request.setBody( mail.build() );
            final Response response = sendGrid.api( request );

            return "Email sent with status code: " + response.getStatusCode();
        }
        catch ( final IOException ex ) {
            return "Error sending email: " + ex.getMessage();
        }
    }
}
