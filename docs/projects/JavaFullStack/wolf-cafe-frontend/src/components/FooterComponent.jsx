//necessary imports 
import React from 'react';
import {NavLink} from 'react-router-dom';
import {Tooltip as ReactTooltip} from 'react-tooltip';
import { isUserLoggedIn } from '../services/AuthService';
import { isAdminUser } from '../services/AuthService';

//the footer componet for Wolfcare, displays the hyperlinks to documents such as privacy policy 
// human flourishing, User Guide, and Developer Guide
const FooterComponent = () => {
    return (
        <div>
            <footer className='footer bg-dark text-white py-3'>
                <div className='text-center'>
                    <p data-tooltip-id="privacy-policy-footer-tt"
                       data-tooltip-content="View our privacy policy">
                        <ReactTooltip id="privacy-policy-footer-tt" place="top"/>
                        <NavLink to='/document/PrivacyPolicy' className='text-white'>
                            Privacy Policy
                        </NavLink>
                    </p>
                    <p data-tooltip-id="human-flourishing-footer-tt"
                       data-tooltip-content="View our human flourishing statement">
                        <ReactTooltip id="human-flourishing-footer-tt" place="top"/>
                        <NavLink to='/document/HumanFlourishing' className='text-white'>
                            Human Flourishing
                        </NavLink>
                    </p>
					{isUserLoggedIn() && isAdminUser() &&(
                    <p data-tooltip-id="developer-guide-footer-tt"
                       data-tooltip-content="View our developer guide">
						
                        <ReactTooltip id="developer-guide-footer-tt" place="top"/>
                        <NavLink to='/document/DeveloperGuide' className='text-white'>
                            Developer Guide
                        </NavLink>
                    </p>)}
                    <p data-tooltip-id="user-guide-footer-tt"
                       data-tooltip-content="View our user guide">
                        <ReactTooltip id="user-guide-footer-tt" place="top"/>
                        <NavLink to='/document/UserGuide' className='text-white'>
                            User Guide
                        </NavLink>
                    </p>
                    <p>WolfCafe &copy; 2024</p>
                </div>
            </footer>
        </div>
    );
};

export default FooterComponent;



