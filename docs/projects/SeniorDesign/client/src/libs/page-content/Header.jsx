import React, { useEffect } from "react";
import "../style/Header.css";
import brick from "../images/ncsu-brick.png";
import home from "../images/home-button.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Header(props) {
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    if(props.user){
      setUser(props.user);
    }
    
  }, [props.user]);

  return (
    <div className="top-ribbon">
      <div className="left-div">
        <img id="brick" src={brick} alt="ncsu-brick" />
      </div>
      <div className="right-div">
        <div className="user-tag" >
          <span style={{ color: "white", marginRight: "15px"}}>Hello, {user ? user.unityId : "Guest"}</span>
        </div>
        
        {user?.role === "admin" ?
        <>
          <Link title="User Menu" className="user-menu" to="/user-management">
            <FontAwesomeIcon icon={faUsers} className="home-button"/>
          </Link>
          <Link title="View Logs" className="log-button" to="logs">
            <FontAwesomeIcon icon={faFileAlt} className="home-button" style={{marginRight: '3px'}}/>
          </Link>
        </>
          : null
        }
        <Link title="Home" className="home-link" to="/">
            <input
              type="image"
              src={home}
              alt="home-button"
              className="home-button"
              style={{marginRight: '3px'}}
            />
          </Link>
      </div>
    </div>

    // <div className="top-ribbon">
    //   <img id="brick" src={brick} alt="ncsu-brick" />
    // <a className="home-link" href="/">
    //   <input
    //     type="image"
    //     src={home}
    //     alt="home-button"
    //     className="home-button"
    //   />
    // </a>
    // </div>
  );
}

export default Header;
