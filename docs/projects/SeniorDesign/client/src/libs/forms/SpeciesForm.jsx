import React, { useState, useEffect } from "react";

import "../../libs/style/SpeciesForm.css";
import SpeciesHover from "../hover-info/SpeciesHover";
import SpeciesShorthandHover from "../hover-info/SpeciesShorthandHover";
import { addSpecies, getSpeciesByName, updateSpecies} from "../services/api-client/speciesService";
import { useNavigate } from "react-router-dom";

function SpeciesForm(props) {
  const [species, setSpecies] = useState("");
  const [shorthand, setShorthand] = useState("");
  const [error, setError] = useState("");
  const [changeId, setChangeId] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.operation === "edit") {
      setChangeId(false);
      const speciesName = window.location.href.split("/")[6];

      getSpeciesByName(speciesName).then((response) => {
        console.log(response.data);

        setSpecies(response.data.species);
        setShorthand(response.data.shorthand);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      setChangeId(true);
    }
  }, [props.operation]);

  const handleSubmit = async (e) => {
    if(props.operation === "add") {
      e.preventDefault();
      await addSpecies(species, shorthand, true, false, null)
      .then(() => {
        clear();
        navigate(-1);
      }).catch((error) => {
        console.log(error);
      });
    } else if(props.operation === "edit") {
      console.log("operation: " + props.operation);
      console.log(species);
      console.log(shorthand);
      e.preventDefault();

      await updateSpecies(species, shorthand, props.user)
      .then(() => {
        clear();
        navigate(-1);
      }).catch((error) => {
        console.log(error);
        alert(`An error occurred: ${error.message || "Unknown error"}`);
      });
    }
  }

  const clear = () => {
    if (props.operation === "add") {
      setSpecies("");
    }

    setShorthand("");
  };

  return (
    <div className="form-div">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {props.operation === 'add' ?
        <h1>Add Species</h1> :
        <h1>Edit Species</h1>
      }
      <form onSubmit={handleSubmit}>
        
      <div className="input-div">
        <label className="entry-label">
          <SpeciesHover /> Species:
        </label>
        <input 
        type="text"
        value={species}
        id="species"
        onChange={(e) =>{
          setSpecies(e.target.value);
          setError("");
        }}
        />
      </div>
      <div className="input-div">
        <label className="entry-label">
          <SpeciesShorthandHover/> Shorthand:
        </label>
        <input 
        type="text" 
        value={shorthand}
        id="shorthand"
        onChange={(e) =>{
          setShorthand(e.target.value);
        }}
        />
      </div>
      <div className="button-div">
          <input
            type="submit"
            className="form-button"
            id="submit"
            value="Submit"
            onClick={handleSubmit}
          ></input>
          <button className="form-button" id="clear" onClick={clear}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default SpeciesForm;
