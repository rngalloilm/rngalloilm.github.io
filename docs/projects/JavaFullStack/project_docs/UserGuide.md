# User Guide: WolfCafe

WolfCafe is an application with four user roles: Administrator, Staff, Customer, and Anonymous Customer. This application allows customers to easily order their favorite recipes and items from WolfCafe, enables staff to manage inventory, ingredients, recipes, and orders, and provides administrators with tools to manage users, locations, and tax rates. This user guide explains how to use the application, organized by each user role.

## ADMIN

First the administrator must login into the system using their unique credentials and select a WolfCafe location. Finally click submit. If there are no locations in the system, then the login screen will not have an option to select location. Locations first must be added.

![Image description](http://localhost:3000/UserGuideImg1.png)


![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/project_docs/design/UserGuideImg%231.png)

## Admin Can View Users

The admin can view users by clicking the "View Users" tab. On the "User" tab, the default option shows all users. The admin also has the option to view only staff members by clicking the "View Staff" button located directly below the "List of Users" heading, and the option to view only customers by clicking the "View Customers" button directly below the "List of Users" heading.


![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%232.png)

![Image description](http://localhost:3000/UserGuideImg2.png)


## Admin Can Delete Users

The admin can delete a user by clicking the delete button located in the actions column next to the respective user they wish to delete.

![Image description](http://localhost:3000/UserGuideImg3.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%233.png)


## Admin Can Modify Users

The admin can modify a user by clicking the modify button located in the actions column next to the respective user they wish to modify.

![Image description](http://localhost:3000/UserGuideImg4.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%234.png)


Once the user clicks "Modify," the admin will be taken to a page titled "Edit User." The fields will already be populated, and the admin can modify any field they wish. When finished, the admin can click the "Update User" button at the bottom of the page. If the admin does not wish to save their changes, they can click "Cancel," which is also located at the bottom of the page.

![Image description](http://localhost:3000/UserGuideImg5.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%235.png)


Note that if the admin tries to update the admin user, the error message below will appear, and the admin will have the option to return to the user list.

![Image description](http://localhost:3000/UserGuideImg6.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%236.png)

## Admin Can Create Users

If the admin wishes to create staff, they should click the "Create Staff" tab.

![Image description](http://localhost:3000/UserGuideImg7.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%237.png)


The admin needs to fill out the corresponding information about the staff member and click "Submit." If the admin does not want to save their progress, they can click "Cancel." After a new staff member is created, they should appear in the "List of Users."

![Image description](http://localhost:3000/UserGuideImg8.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%238.png)


## Admin Can Add Locations

Admin should click the "Locations" tab.

![Image description](http://localhost:3000/UserGuideImg9.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%239.png)


The admin can view a list of all locations. The admin needs to fill out the corresponding information at the top of the screen and then click the green "Add Location" button to add a location. The location will be added to the list below. Note that the tax rate must be above 0.02 to be valid; otherwise, an error message will be displayed.



![Image description](http://localhost:3000/UserGuideImg10.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2310.png)

## Admin Can Delete Locations

The admin can delete a location by clicking the red delete button in the actions column for the corresponding location.

## Admin Can Adjust the Tax Rate

Admin should click the Locations tab. Then for each individual location, the user can adjust the tax rate by adjusting the textbox.  
![Image description](http://localhost:3000/UserGuideImg29.png)

## Admin can set the End of Day Time
This program automatically cancels orders that are not picked up at the end of the day. The admin can select what the end of the day time is going to the Locations tab, and then typing the end of the day time, in the “End Of day Time” field. 

![Image description](http://localhost:3000/UserGuideImg30.png)

## Staff

First the staff must login into the system using their unique credentials and select a Wolfcafe location. Finally click submit.

![Image description](http://localhost:3000/UserGuideImg11.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2311.png)


## Staff Can Add Ingredients

Staff goes to the "Ingredient" tab and clicks the "Add Ingredient" button at the top.

![Image description](http://localhost:3000/UserGuideImg12.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2312.png)


Then the staff member can fill in the information: ingredient name and amount to add an ingredient into the system.

![Image description](http://localhost:3000/UserGuideImg13.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2313.png)


## Staff Can Delete Ingredients

On the "Ingredients" tab, the user can click the red button located under "Actions" to delete an ingredient.

![Image description](http://localhost:3000/UserGuideImg14.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2314.png)

## Staff Can Add Inventory

The staff member should navigate to the "Inventory" tab. There will be a page that lists existing ingredients in the inventory along with the current amounts of each ingredient. The staff can enter a different number for the ingredient they wish to update and click the green "Update Inventory" button.

![Image description](http://localhost:3000/UserGuideImg15.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2315.png)

## Staff Can Add Recipes

Staff go to the "Recipes" tab, where a list of recipes will appear. To add a recipe, click the large blue "Add Recipe" button. The recipe must use ingredients already in the system. If a staff member wants to create a recipe with ingredients that are not yet in the system, those ingredients must be added first.

![Image description](http://localhost:3000/UserGuideImg16.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2316.png)


The staff member will then be taken to the "Add Recipe" tab, where they must fill out the appropriate fields. Adding and removing ingredients is done using a dropdown menu. Once the staff member is finished, they should click "Submit." The recipe will then appear in the "Recipes List."

![Image description](http://localhost:3000/UserGuideImg17.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2317.png)


## Staff Can Modify Recipes

Once a recipe is already in the system, the staff member can modify a recipe by clicking the "Modify" button located under "Actions."

![Image description](http://localhost:3000/UserGuideImg18.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2318.png)


The staff member is then taken to a separate page where the fields are already populated with the existing values. The staff member can adjust the values and then click "Submit."

![Image description](http://localhost:3000/UserGuideImg19.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2319.png)


## Staff Can Delete a Recipe

In the "Recipes" tab, within the "List of Recipes" table under "Actions," the staff member can click the red "Delete" button to remove the recipe.

## Staff Can Add Items

A staff member can go to the "Items" tab at the top and click the big blue button below the "Items" header that says "Add Item."

![Image description](http://localhost:3000/UserGuideImg20.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2320.png)


This will take the staff member to a separate page where they can enter the item credentials and then click "Submit" once they are done.

![Image description](http://localhost:3000/UserGuideImg21.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2321.png)


## Staff Can Delete Items

In the items tab, the staff can go to the actions column and the staff can click the delete button and the item will be removed from the system. 


## Staff Can Modify Items

In the items tab, the staff can go to the actions column and the staff can click the modify button and the user can edit the pre populated fields, name, description, and price. 

## Staff Can Make a Recipe

Staff should navigate to the "Make Recipes" tab. The amount paid should be entered in the appropriate field. For recipes already in the system, the staff member can select the desired recipe by clicking the blue "Make Recipe" button in the "Actions" column for that recipe. If there are not enough ingredients or insufficient payment, an error message will appear.

![Image description](http://localhost:3000/UserGuideImg22.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2322.png)


## Staff Can Add Orders

The staff will go to the "Order" tab. The staff member's location will be pre-populated. The staff member will fill out the remaining sections. Note that for anonymous orders, the customer ID should be left blank.

![Image description](http://localhost:3000/UserGuideImg23.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2323.png)


Finally, click the blue "Add Order" button at the bottom. The order should be added to the system, and a green message should appear for a successful order.

![Image description](http://localhost:3000/UserGuideImg24.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2324.png)


![Image description](http://localhost:3000/UserGuideImg25.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2325.png)


## Staff Can Delete Order

To delete an order, the staff member clicks the red "Delete Order" button. Before deleting the order, a message should be displayed, confirming once more that the staff is certain they want to delete the order.

![Image description](http://localhost:3000/UserGuideImg26.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2326.png)


## Staff Can Fulfill Orders

For each individual order box on the order’s tab, the staff member can click the fullfill order box to fulfill an order. 

## Staff Can Add Recipes and Items to the Menu

First, navigate to the "Menu" tab.

![Image description](http://localhost:3000/UserGuideImg27.png)
![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2327.png)


## Staff Can Add Recipes and Items to the Menu

The items should already be populated. You can add a recipe by clicking the blue "Add New Recipe" button. You can add a new item by clicking the grey "Add New Item" button. And finally, to save changes to the menu, click the green "Save Changes" button.

## Viewing Order History 
A staff member can go to the order history tab and see the history of orders and the total revenue. 
![Image description](http://localhost:3000/UserGuideImg31.png)


## Customer

## Customer can see their order history 
First a customer must login using their credentials. Then a customer can see their order history by going to the order history tab. 

![Image description](http://localhost:3000/UserGuideImg32.png)


### Customer Can Place an Order

The customer can go to the order tab. And fill in the required information: location, item, and recipes. 

![Image description](http://localhost:3000/UserGuideImg33.png)

After the customer clicks the add order tab. Next they can view the status of their order by going to the Order Pickup tab. 

## Customer Can add Tip 
The customer with their order, can select the tip amount, 15%, 20%, 25%, or custom tip.


### Customer Can Pickup Order

![Image description](http://localhost:3000/UserGuideImg34.png)


Once the staff fullfill their order, a button will appear to pick up the order. 

## Anonymous Customer

Without logging in, an anonymous customer can navigate to the order tab on the login screen.


![](https://github.ncsu.edu/engr-csc326-fall2024/csc326-TP-204-1/blob/userGuide_images/project_docs/design/UserGuideImg%2328.png)


The anonymous customer will follow the same process as a regular customer, except they won’t be logged in. And at the end they will be instructed to enter their email and they will be given an id, so they can pick up their order correctly. 

## Anonymous order tip 
The customer with their order, can select the tip amount, 15%, 20%, 25%, or custom tip.


## Anonymous Customer Can Pickup Order
The process will be the same as a regular customer. 

## Any User 
There are hyperlinks at the bottom of the application that will take the user to the privacy policy, user guide, and the human flourishing. 

![Image description](http://localhost:3000/UserGuideImg38.png)


