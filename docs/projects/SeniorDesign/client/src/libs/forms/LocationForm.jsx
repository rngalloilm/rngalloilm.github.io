import React, { useEffect, useState } from "react";
import "../../libs/style/LocationForm.css";
import { addLocation, editLocation, getLocationByName } from "../services/api-client/locationService";
import LocationHover from "../hover-info/LocationHover";
import { useNavigate } from "react-router-dom";
import LocationShorthandHover from "../hover-info/LocationShorthandHover";

function LocationForm(props) {

  const [location, setLocation] = useState("");
  const [shorthand, setShorthand] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [error, setError] = useState("");
  const [changeId, setChangeId] = useState(true);
  const navigate = useNavigate();
  // State to store the original location name for editing lookup
  const [originalLocationName, setOriginalLocationName] = useState("");

  useEffect(() => {
    if (props.operation === "edit") {
      setChangeId(false);
      const locName = window.location.href.split("/")[5];
      // props.locationId from the route is the location name
      const locNameFromRoute = props.locationId;
      console.log("location: " + locNameFromRoute);
      setOriginalLocationName(locNameFromRoute);

      getLocationByName(locNameFromRoute).then((res) => {
        if (res.data) {
          console.log(res.data);
          setLocation(res.data.location); // Set current name for the input field
          setShorthand(res.data.shorthand);
          setUniqueId(res.data.uniqueId);
        } else {
          setError(`Location "${locNameFromRoute}" not found.`);
        }
        
      }).catch(err => {
        console.error("Error fetching location details:", err);
        setError("Failed to fetch location details.");
      });

    } else { // operation === 'add'
      setChangeId(true);
      setOriginalLocationName(""); // Ensure no original name when adding
      setLocation(""); // Clear fields for adding
      setShorthand("");
      setUniqueId("");
    }
  }, [props.operation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (props.operation === "add") {
      await addLocation(location, shorthand, true, false, null);
      await props.handleFilesSubmit(uniqueId)
        .then(() => {
          clearForm();
          navigate(-1);
        })
        .catch((error) => {
          console.error("Error adding location:", error);
          setError(error.response?.data?.message || "Failed to add location.");
        });
    }
    else if(props.operation === "edit") {
      console.log("Editing submission:");
      console.log("Original Name:", originalLocationName);
      console.log("New Name:", location);
      console.log("New Shorthand:", shorthand);
      try {
        await editLocation(originalLocationName, location, shorthand, true, props.user)
        .then(() => {
          props.handleFilesSubmit(uniqueId);
          clearForm();
          navigate(-1);
        })
        .catch((error) => {
          alert(`An error occurred: ${error.message || "Unknown error"}`);
          console.log(error);
        });

      } catch (error) {
        console.log(error);
        console.error("Error editing location:", error);
        alert(`An error occurred: ${error.message || "Unknown error"}`);
        setError(error.response?.data?.message || "Failed to edit location.");
      }
    }
  };

  const clearForm = () => {
    // Don't clear location name if editing, just shorthand
    // Or clear all if adding
    if (props.operation === "add") {
      setLocation("");
    }
    setShorthand("");
    setError("");
  };

  return (
    <div className="form-div">
      {/* Add type="button" for clear to prevent accidental form submission? */}
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {props.operation === 'add' ?
        <h1>Add Location</h1> :
        <h1>Edit Location</h1>
      }
      <form onSubmit={handleSubmit}>
        <div className="input-div">
          <label className="entry-label">
            <LocationHover /> Location:
          </label>
          <input
            type="text"
            value={location}
            id="location"
            onChange={(e) =>{
              setLocation(e.target.value );
              setError("");
            }}
          />
        </div>
        <div className="input-div">
          <label className="entry-label">
            <LocationShorthandHover /> Shorthand:
          </label>
          <input
            type="text"
            value={shorthand}
            id="shorthand"
            onChange={(e) =>{
              setShorthand(e.target.value );
            }}
          />
        </div>
        <div className="button-div">
          {/* Change onClick to type="submit"? */}
          <button className="form-button" id="submit" onClick={handleSubmit}>
            Submit
          </button>
          {/* Add type="button"? */}
          <button className="form-button" id="clear" onClick={clearForm}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default LocationForm;
