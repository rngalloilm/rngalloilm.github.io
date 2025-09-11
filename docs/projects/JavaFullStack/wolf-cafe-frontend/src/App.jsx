import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import ListItemsComponent from './components/ListItemsComponent';
import RegisterComponent from './components/RegisterComponent';
import LoginComponent from './components/LoginComponent';
import OrdersComponent from './components/OrdersComponent';
import OrderPickupComponent from './components/OrderPickupComponent';
import OrderPickupGuestComponent from './components/OrderPickupGuestComponent';
import UnauthorizedPage from './components/UnauthorizedPage';

// Staff components
import InventoryComponent from './components/InventoryComponent';
import ListIngredientsComponent from './components/ListIngredientsComponent';

// Admin components
import LocationComponent from './components/LocationComponent';
import CustomerComponent from './components/CustomerComponent';

// Additional documents
import PrivacyPolicy from './components/PrivacyPolicy'; 
import HumanFlourishing from './components/HumanFlourishing';
import DevelopersGuide from  './components/DevelopersGuide';
import UserGuide from './components/UserGuide';


import { isUserLoggedIn, getUserRole, isAdminUser } from './services/AuthService';
import ItemComponent from './components/ItemComponent';
import ListRecipesComponent from './components/ListRecipesComponent';
import RecipeComponent from './components/RecipeComponent';
import IngredientComponent from './components/IngredientComponent';
import ModifyRecipeComponent from './components/ModifyRecipeComponent';
import ListInventoryComponent from './components/ListInventoryComponent';
import ViewUserComponent from './components/ViewUserComponent';
import EditUserComponent from './components/EditUserComponent';
import MenuComponent from './components/MenuComponent';
import CreateStaffComponent from './components/CreateStaffComponent';
import ManageMenuComponent from "./components/ManageMenuComponent"
import OrderHistoryComponent from "./components/OrderHistoryComponent"
import OrderHistoryForStaffComponent from "./components/OrderHistoryForStaffComponent"
import OrderCustomerComponent from './components/OrderCustomerComponent';
import OrderCustomerGuestComponent from './components/OrderCustomerGuestComponent';

export function AuthenticatedRoute({ children, requiredRoles = [], adminOnly = false }) {
  const isAuth = isUserLoggedIn();
  const role = getUserRole();
  const isAdmin = isAdminUser();

  //If the user is not logged in, take them to the log in page
  if (!isAuth) {
    return <Navigate to='/' />;
  }
  
  //If accessing an admin only page and they are not an admin, navigate to the unauthorized page
  if (adminOnly && !isAdmin) {
    return <Navigate to='/Unauthorized' />;
  }

  //If the user requires a specific role but they do not have it, navigate to the unauthorized page
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return <Navigate to='/Unauthorized' />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />
	  <div className="main-content">
      <Routes>
        <Route path='/' element={<LoginComponent />} />
        <Route path='/register' element={<RegisterComponent />} />
        <Route path='/login' element={<LoginComponent />} />
        <Route path='/menu' element={<MenuComponent />} />
			  <Route path="/order-history" element={<OrderHistoryComponent />}/>
        <Route path="/order-pickup-guest" element={<OrderPickupGuestComponent />}/>
    		<Route path="/order-customer-guest" element={<OrderCustomerGuestComponent />}/>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />



        {/* Customer-only routes */}
        <Route path="/order-customer" element={<AuthenticatedRoute requiredRole="ROLE_CUSTOMER">{isUserLoggedIn() ? <OrderCustomerComponent />: <OrderCustomerComponent/>}</AuthenticatedRoute>}/>
        <Route path="/order-pickup" element={<AuthenticatedRoute requiredRole="ROLE_CUSTOMER">{isUserLoggedIn() ? <OrderPickupComponent />: <OrderPickupComponent/>}</AuthenticatedRoute>}/>

        {/* Staff-only routes */}
        <Route path='/items' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><ListItemsComponent /></AuthenticatedRoute>} />
        <Route path='/inventory' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><InventoryComponent /></AuthenticatedRoute>} />
       <Route path='/ingredients' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><ListIngredientsComponent /></AuthenticatedRoute>} />
        <Route path='/add-item' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><ItemComponent /></AuthenticatedRoute>}/>
        <Route path='/update-item/:id' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><ItemComponent /></AuthenticatedRoute>}/>
        <Route path='/add-recipe' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><RecipeComponent /></AuthenticatedRoute>}/>
        <Route path='/add-ingredient' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><IngredientComponent /></AuthenticatedRoute>}/>
        <Route path='/modify-recipe/:recipeName' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><ModifyRecipeComponent /></AuthenticatedRoute>}/>
        <Route path='/add-inventory' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><InventoryComponent /></AuthenticatedRoute>}/>

		    <Route path='/manage-menu' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><ManageMenuComponent /></AuthenticatedRoute>}/>
		    <Route path='/orders' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><OrdersComponent /></AuthenticatedRoute>} />
		    <Route path='/staff-order-history' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><OrderHistoryForStaffComponent /></AuthenticatedRoute>} />
        <Route path='/recipes' element={<AuthenticatedRoute requiredRole="ROLE_STAFF"><ListRecipesComponent /></AuthenticatedRoute>} />


        {/* Admin-only routes */}
        <Route path='/locations' element={<AuthenticatedRoute requiredRole="ROLE_ADMIN"><LocationComponent /></AuthenticatedRoute>} />
        <Route path='/customer' element={<AuthenticatedRoute requiredRole="ROLE_ADMIN"><CustomerComponent /></AuthenticatedRoute>} />
        <Route path='/create-staff' element={<AuthenticatedRoute adminOnly={true}><CreateStaffComponent /></AuthenticatedRoute>} />
        <Route path='/view-users' element={<AuthenticatedRoute requiredRole="ROLE_ADMIN"><ViewUserComponent /></AuthenticatedRoute>} />
        <Route path='/edit-user/:id' element={<AuthenticatedRoute requiredRole="ROLE_ADMIN"><EditUserComponent /></AuthenticatedRoute>} />

        {/* Privacy Policy route */}
        <Route path='/document/PrivacyPolicy' element={<PrivacyPolicy />} /> {/*privacy policy*/}
		{/* Human Flourishing*/}
		<Route path='/document/HumanFlourishing' element={<HumanFlourishing />} /> {/*HumanFlourishing*/}
		{/* Developer Guide*/}
		<Route
		  path='/document/DeveloperGuide'
		  element={
		    <AuthenticatedRoute requiredRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
		      <DevelopersGuide />
		    </AuthenticatedRoute>
		  }
		/>
		{/* User Guide*/}
		<Route path='/document/UserGuide' element={<UserGuide/>} /> {/*User Guide*/}
		

      </Routes>
	  </div>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;