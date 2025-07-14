import React, { useState, useEffect } from "react";
import "../../libs/style/ConeMaterial.css";
import ProgenyHover from "../hover-info/ProgenyHover";
import GenericHover from "../hover-info/GenericHover";
import PopulationHover from "../hover-info/PopulationHover";
import GeneticHover from "../hover-info/GeneticHover";
import DateHarvestInfo from "../hover-info/DateHarvestInfo";
import LocationHover from "../hover-info/LocationHover";
import { addCone, getCone, editCone } from "../services/api-client/coneService";
import Select from "react-select";
import { getPopulations } from "../services/api-client/populationService";
import { getId } from "../services/api-client/idService";
import {
  getIdsByPopulation,
  getIdsByPopulationAndFamily,
  getIdsByPopulationAndFamilyAndRamet,
  getIdsByPopulationAndFamilyAndRametAndGenetic,
} from "../services/api-client/idService";
import { useNavigate } from "react-router-dom";
import PopulationForm from "./PopulationForm";
import GeneticIdForm from "./GeneticIdForm";
import { getLocations } from "../services/api-client/locationService";
import { getMotherTrees } from "../services/api-client/motherTreeService";
import { getTrees } from "../services/api-client/treeService";

function ConeMaterial(props) {
  const [coneId, setConeId] = useState("");
  const [motherTreeIdOptions, setMotherTreeIdOptions] = useState([]);
  const [fatherTreeIdOptions, setFatherTreeIdOptions] = useState([]);
  const [motherTreeId, setMotherTreeId] = useState({value:"", label:""});
  const [fatherTreeId, setFatherTreeId] = useState({value:"", label:""});
  const [geneticId, setGeneticId] = useState({ value: "", label: "" });
  const [familyId, setFamilyId] = useState({ value: "", label: "" });
  const [rametId, setRametId] = useState({ value: "", label: "" });
  const [progenyId, setProgenyId] = useState({ value: "", label: "" });
  const [population, setPopulation] = useState({ value: "", label: "" });
  const [location, setLocation] = useState({ value: "", label: "" });
  const [dateHarvested, setDateHarvested] = useState("");
  const [error, setError] = useState("");
  const [popOptions, setPopOptions] = useState([]);
  const [famOptions, setFamOptions] = useState([]);
  const [rametOptions, setRametOptions] = useState([]);
  const [genOptions, setGenOptions] = useState([]);
  const [proOptions, setProOptions] = useState([]);
  const [changeId, setChangeId] = useState(true);
  const navigate = useNavigate();
  const [isPopulationFormOpen, setPopulationFormOpen] = useState(false);
  const [isGeneticIdFormOpen, setGeneticIdFormOpen] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  
  const handleOpenPopulationForm = () => {
    setPopulationFormOpen(true);
  };

  const handleClosePopulationForm = () => {
    setPopulationFormOpen(false);
  };

  const addPopulationOption = (newOption) => {
    // Update the options with the newly added value
    let newValue = {value: newOption, label: newOption}
    setPopOptions([...popOptions, newValue]);
    setGeneticIdFormOpen(true);
  };

  const newPopulationButtonOption = { label: "Add new population", value: "add" };

  const handleCloseGenIdForm = () => {
    setGeneticIdFormOpen(false);
  };

  const addGenIdOption = (newOption) => {
    // Update the options with the newly added value
    let newValue = {value: newOption, label: newOption}
    setGenOptions([...genOptions, newValue]);
  };

  useEffect(() => {
    getExistingLocations();
  }, []);


  useEffect(() => {
    if (props.operation === "edit") {
      setChangeId(false);

      // const id = window.location.href.split("/")[5];
      // console.log("id: " + id);

      //get cone from id
      console.log("cone id", props.coneId);
      getCone(props.coneId).then((cone) => {
      console.log("cone found")

        console.log(cone.data.id);
        setConeId(cone.data.id);

        console.log(cone.data.motherTreeId);
        setMotherTreeId(cone.data.motherTreeId);

        console.log(cone.data.fatherTreeId);
        setFatherTreeId(cone.data.fatherTreeId);
        
        getId(cone.data.coneGeneticId).then((id) => {
          setPopulation(id.data.populationId);
          setFamilyId(id.data.familyId);
          setGeneticId(id.data.geneticId);
          setProgenyId(id.data.progenyId);
          setRametId(id.data.rametId);
        });

        console.log(cone.data.locationId);
        setLocation(cone.data.locationId);

        console.log(cone.data.dateHarvested);
        setDateHarvested(cone.data.dateHarvested);
      });
    }
  }, [props.operation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.operation === "add") {
      addCone(
        coneId,
        motherTreeId.value,
        fatherTreeId.value,
        rametId.value,
        geneticId.value,
        familyId.value,
        progenyId.value,
        population.value,
        dateHarvested,
        location.value,
        true,
        false,
        null
      )
        .then(() => {
          props.handleFilesSubmit(coneId);
          clearForm();
          navigate(-1);
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.message);
        });

    }
    else if(props.operation === "edit") {
      editCone(
        coneId,
        motherTreeId.value,
        fatherTreeId.value,
        rametId.value,
        geneticId.value,
        familyId.value,
        progenyId.value,
        population.value,
        dateHarvested,
        location.value,
        true,
        props.user
      )
        .then(() => {
          props.handleFilesSubmit(coneId);
          clearForm();
          navigate(-1);
        })
        .catch((error) => {
          console.log(error);
          alert(`An error occurred: ${error.message || "Unknown error"}`);
          setError(error.response.data.message);
        });

    }
  };

  const clearForm = () => {
    if(props.operation === "add") {
      setConeId("");
    }
    
    setMotherTreeId({value:"", label:""});
    setFatherTreeId({value:"", label:""});
    setGeneticId({ value: "", label: "" });
    setFamilyId({ value: "", label: "" });
    setProgenyId({ value: "", label: "" });
    setPopulation({ value: "", label: "" });
    setRametId({ value: "", label: "" });
    setDateHarvested("");
    setLocation({ value: "", label: "" });
    setPopOptions([]);
    setFamOptions([]);
    setRametOptions([]);
    setGenOptions([]);
    setProOptions([]);
    getPopulationsOptions();
  };

  // function to get the mother tree options
  const getMotherTreeOptions = async () => {
    getTrees().then((motherTrees) => {
      const options = motherTrees.data.map((motherTree) => {
        return {
          value: motherTree.treeId,
          label: motherTree.treeId,
        };
      });
      setMotherTreeIdOptions(options);
    });
  };

  // function to get the father tree options
  const getFatherTreeOptions = async () => {
    getTrees().then((fatherTrees) => {
      const options = fatherTrees.data.map((fatherTree) => {
        return {
          value: fatherTree.treeId,
          label: fatherTree.treeId,
        };
      });
      setFatherTreeIdOptions(options);
    });
  };

  // function to get the population options
  const getPopulationsOptions = async () => {
    getPopulations().then((populations) => {
      const options = populations.data.map((population) => {
        return {
          value: population.id,
          label: population.id,
        };
      });
      setPopOptions(options);
    });
  };

  // On load, get the population options.
  useEffect(() => {
    getPopulationsOptions();
    getMotherTreeOptions();
    getFatherTreeOptions();
  }, []);

  // When changing the population, get the family options
  const handlePopulationChange = async (e) => {
    if (e.value === "add") {
      handleOpenPopulationForm();
    }
    else {
      setError("");
      setPopulation({ value: e.value, label: e.value });
      await getIdsByPopulation(e.value).then((ids) => {
        const options = ids.data.map((id) => {
          return {
            value: id.familyId,
            label: id.familyId,
          };
        });
        setFamOptions(options);
      });
    }
  };

  // When changing the family, get the ramet options
  const handleFamilyChange = async (e) => {
    setError("");
    setFamilyId({ value: e.value, label: e.value });
    await getIdsByPopulationAndFamily(population?.value, e.value).then(
      (ids) => {
        let options = ids.data.map((id) => {
          return {
            value: id.rametId,
            label: id.rametId ? id.rametId : "N/A",
          };
        });
        if (options.length < 1) {
          options = [{ value: null, label: "No Ramet Id (select)" }];
        }
        setRametOptions(options);
      }
    );
  };

  const handleRametChange = async (e) => {
    setError("");
    const ram = e.value === null ? 'null' : e.value;
    setRametId({ value: e.value, label: e.value === null ? "N/A" : e.value });
    await getIdsByPopulationAndFamilyAndRamet(
      population.value,
      familyId.value,
      ram
    ).then((ids) => {
      const options = ids.data.map((id) => {
        return {
          value: id.geneticId,
          label: id.geneticId,
        };
      });
      setGenOptions(options);
    });
  };

  const handleGeneticChange = async (e) => {
    setError("");
    setGeneticId({ value: e.value, label: e.value });

    await getIdsByPopulationAndFamilyAndRametAndGenetic(
      population?.value,
      familyId?.value,
      rametId.value,
      e.value
    ).then((ids) => {
      const options = ids.data.map((id) => {
        return {
          value: id.progenyId,
          label: id.progenyId,
        };
      });
      setProOptions(options);
    });
  };

  const handleProgenyChange = (e) => {
    setError("");
    setProgenyId({ value: e.value, label: e.value });
  };

  const getExistingLocations = async () => {
    getLocations().then((locations) => {
      const options = locations.data.map((loc) => {
        return {
          value: loc.location,
          label: loc.location
        };
      });
      setLocationOptions(options);
      console.log(options);
    });
  };

  const handleLocationChange = (e) => {
    setError("");
    setLocation({value: e.value, label: e.value});
  }

  return (
    <div className="form-div">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {props.operation === 'add' ?
        <h1>Add Cone</h1> :
        <h1>Edit Cone</h1>
      }

      <div className="input-div">
        <label className="entry-label">Cone ID:</label>
        <input
          type="text"
          disabled={!changeId}
          value={coneId}
          onChange={(e) => setConeId(e.target.value)}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">Mother Tree ID:</label>
        <Select
          options={motherTreeIdOptions}
          onChange={(e) => setMotherTreeId({value:e.value,label: e.value})}
          value={motherTreeId ? motherTreeId : ""}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">Father Tree ID:</label>
        <Select
          options={fatherTreeIdOptions}
          onChange={(e) => setFatherTreeId({value:e.value,label: e.value})}
          value={fatherTreeId ? fatherTreeId : ""}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <PopulationHover />
          Population ID:
        </label>
        <Select
          options={[newPopulationButtonOption, ...popOptions]}
          onChange={handlePopulationChange}
          value={population ? population : ""}
        />
        {isPopulationFormOpen &&
          <PopulationForm 
            isOpen={isPopulationFormOpen}
            onClose={handleClosePopulationForm}
            addPopOption={addPopulationOption}
            operation={"add"}
          />
        }
        {isGeneticIdFormOpen && 
          <GeneticIdForm
            isOpen={isGeneticIdFormOpen}
            onClose={handleCloseGenIdForm}
            addGenIdOption={addGenIdOption}
            operation={"add"}
          />
        }
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The family ID of the genetic ID" />
          Family ID:
        </label>
        <Select
          options={famOptions}
          onChange={handleFamilyChange}
          value={familyId ? familyId : ""}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The Ramet Id that can be associated with this id (can be blank)" />
          Ramet ID:
        </label>
        <Select
          options={rametOptions}
          onChange={handleRametChange}
          value={rametId ? rametId : ""}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GeneticHover /> Genetic ID:
        </label>
        <Select
          options={genOptions}
          onChange={handleGeneticChange}
          value={geneticId ? geneticId : ""}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <ProgenyHover /> Progeny ID:
        </label>
        <Select
          options={proOptions}
          onChange={handleProgenyChange}
          value={progenyId ? progenyId : ""}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <DateHarvestInfo /> Date Harvested:
        </label>
        <input
          type="date"
          value={dateHarvested}
          onChange={(e) => setDateHarvested(e.target.value)}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <LocationHover /> Location:
        </label>
        <Select
            options={locationOptions}
            onChange={handleLocationChange}
            value={location ? location : ""}
          />
      </div>
      <div className="button-div">
        <button className="form-button" id="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button className="form-button" id="clear" onClick={clearForm}>
          Clear
        </button>
      </div>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

export default ConeMaterial;
