import React, { useState, useEffect } from "react";
import "../../libs/style/TreeMaterial.css";
import GeneticHover from "../hover-info/GeneticHover";
import GPSHover from "../hover-info/GPSHover";
import PopulationHover from "../hover-info/PopulationHover";
import ProgenyHover from "../hover-info/ProgenyHover";
import LocationHover from "../hover-info/LocationHover";
import GenericHover from "../hover-info/GenericHover";
import { addTree, editTree, getTree } from "../services/api-client/treeService";
import Select from "react-select";
import { getPopulations } from "../services/api-client/populationService";
import { getId } from "../services/api-client/idService";
import {
  getIdsByPopulation,
  getIdsByPopulationAndFamily,
  getIdsByPopulationAndFamilyAndRamet,
  getIdsByPopulationAndFamilyAndRametAndGenetic,
} from "../services/api-client/idService";
import { useNavigate, useLocation  } from "react-router-dom";
import PopulationForm from "./PopulationForm";
import GeneticIdForm from "./GeneticIdForm";
import { getLocations } from "../services/api-client/locationService";
import {addOfflineEntry, getEntryById, getAllEntries, editOfflineEntry} from "../../IndexedDB";

function TreeMaterial(props) {
  const {operation, treeId: routeTreeId, isOffline} = props;
  const locationHook = useLocation();
  const [treeId, setTreeId] = useState("");
  const [geneticId, setGeneticId] = useState({ value: "", label: "" });
  const [familyId, setFamilyId] = useState({ value: "", label: "" });
  const [rametId, setRametId] = useState({ value: "", label: "" });
  const [progenyId, setProgenyId] = useState({ value: "", label: "" });
  const [population, setPopulation] = useState({ value: "", label: "" });
  const [location, setLocation] = useState({ value: "", label: "" });
  const [geneticShortId, setGeneticShortId] = useState({ value: "", label: "" });
  const [species, setSpecies] = useState("");
  const isOfflineMode = new URLSearchParams(locationHook.search).get('offline') === 'true';
  const [gps, setGps] = useState("");
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
    let newValue = { value: newOption, label: newOption }
    setPopOptions([...popOptions, newValue]);
    setGeneticIdFormOpen(true);
  };

  const newPopulationButtonOption = { label: "Add new population", value: "add" };

  const handleCloseGenIdForm = () => {
    setGeneticIdFormOpen(false);
  };

  const addGenIdOption = (newOption) => {
    // Update the options with the newly added value
    let newValue = { value: newOption, label: newOption }
    setGenOptions([...genOptions, newValue]);
  };

  useEffect(() => {
    getExistingLocations();
  }, []);

  useEffect(() => {
    //If editing, set the values to the current values
    if (props.operation === "edit" && !isOfflineMode) {
      setChangeId(false);

      //Get tree from id
      getTree(props.treeId).then((tree) => {
        setTreeId(tree.data.treeId);
        setLocation(tree.data.locationId);
        setGps(tree.data.gps);

        getId(tree.data.treeGeneticId).then((id) => {
          setPopulation(id.data.populationId);
          setFamilyId(id.data.familyId);
          setGeneticId(id.data.geneticId);
          setProgenyId(id.data.progenyId);
          setRametId(id.data.rametId);
        });
      });
    } else if (props.operation === "edit" && isOfflineMode){
      setChangeId(false);
      getEntryById('trees', routeTreeId) // Use the actual treeId as the key
      .then(treeData => {
          if (treeData) {
              console.log("Found offline tree data:", treeData);
              setTreeId(treeData.treeId);
              setLocation({ value: treeData.locationId, label: treeData.locationId }); // Assuming locationId is stored
              setGps(treeData.gps);

              // Assuming the necessary genetic parts ARE stored in the tree object offline
              setPopulation({ value: treeData.populationId, label: treeData.populationId });
              setFamilyId({ value: treeData.familyId, label: treeData.familyId });
              setRametId({ value: treeData.rametId, label: treeData.rametId || "N/A" });
              setGeneticShortId({ value: treeData.geneticShortId, label: treeData.geneticShortId }); //
              setProgenyId({ value: treeData.progenyId, label: treeData.progenyId });
              setGeneticId({ value: treeData.geneticShortId, label: treeData.geneticShortId }); // 


          } else {
              setError(`Offline Tree with ID "${routeTreeId}" not found in local storage.`);
              console.error(`Offline Tree with ID "${routeTreeId}" not found.`);
          }
      })
      .catch(err => {
          console.error("Error fetching tree from IndexedDB:", err);
          setError("Failed to load offline tree data.");
      });
    } else {
      setChangeId(true);
    }
  }, [props.operation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.operation === "add") {
      if (isOfflineMode) {
        try {
          const treeDataForDisplay = {
            active: true,
            treeId: treeId.trim(),
            populationId: population.value,
            familyId: familyId.value,
            rametId: rametId.value,
            geneticShortId: geneticId.value,
            progenyId: progenyId.value,
            species: species,
            locationId: location.value,
            gps: gps.trim()
          };
          
          console.log("Attempting to add tree to IndexedDB:", treeDataForDisplay);
          
          const addedData = await addOfflineEntry('trees', treeDataForDisplay);
          console.log("Successfully added to IndexedDB:", addedData);
          alert(`Tree "${addedData.treeId}" added locally. Ready to sync.`);
        } catch (error) {
          console.error("Error adding tree to IndexedDB:", error);
          setError("Failed to save tree offline: " + error.message);
        }
      }
      await addTree(
        progenyId.value,
        geneticId.value,
        familyId.value,
        population.value,
        rametId.value,
        location.value,
        gps,
        true,
        treeId,
        false,
        null
      )
        .then(() => {
          props.handleFilesSubmit(treeId);
          clear();
          navigate(-1);
        })
        .catch((error) => {
          console.log(error);
          setError("An error occured: " + error);
        });
    } else if (props.operation === "edit") {
      if (isOfflineMode) {
        console.log("heehee");
        try {
          const geneticIdStr = `P${population.value || '?'}_${familyId.value || '?'}_${rametId.value || 'NA'}_${geneticShortId.value || '?'}_${progenyId.value || '?'}`;
          const updatedTreeDataForDisplay = {
            active: true,
            id: treeId.trim(),
            treeId: treeId.trim(),
            populationId: population.value,
            familyId: familyId.value,
            rametId: rametId.value,
            geneticShortId: geneticId.value,
            progenyId: progenyId.value,
            species: species,
            locationId: location.value,
            geneticId: geneticIdStr,
            gps: gps.trim()
          };
          
          console.log("Attempting to update tree to IndexedDB:", updatedTreeDataForDisplay);
          
          const addedData = await editOfflineEntry('trees', updatedTreeDataForDisplay);
          console.log("Successfully update to IndexedDB");
          alert(`Tree "${addedData.treeId}" updated locally. Ready to sync.`);
          clear();
          navigate(-1);
        } catch (error) {
          console.error("Error updating tree to IndexedDB:", error);
          setError("Failed to update tree offline: " + error.message);
        }
      }
      await editTree(
        treeId,
        progenyId.value,
        geneticId.value,
        familyId.value,
        population.value,
        rametId.value,
        location.value,
        gps,
        true,
        props.user
      )
        .then(() => {
          props.handleFilesSubmit(treeId);
          clear();
          navigate(-1);
        })
        .catch((error) => {
          console.log(error);
          alert(`An error occurred: ${error.message || "Unknown error"}`);
          setError("An error occured: " + error);
        });
    }
  };

  const clear = () => {
    if (props.operation === "add") {
      setTreeId("");
    }

    //setTreeId("");
    setGeneticId({ value: "", label: "" });
    setFamilyId({ value: "", label: "" });
    setProgenyId({ value: "", label: "" });
    setPopulation({ value: "", label: "" });
    setRametId({ value: "", label: "" });
    setLocation({ value: "", label: "" });
    setGps("");
    setPopOptions([]);
    setFamOptions([]);
    setGenOptions([]);
    setProOptions([]);
    setRametOptions([]);
    getPopulationsOptions();
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

  // On load, get the population options.
  useEffect(() => {
    getPopulationsOptions();
  }, []);

  // When changing the population, get the family options
  const handlePopulationChange = async (e) => {
    if (e.value === "add") {
      handleOpenPopulationForm();
    }
    else if (isOfflineMode) {
      const selectedPopulation = { value: e.value, label: e.value };
      setPopulation(selectedPopulation);
      console.log(`Offline: Fetching families for p from IndexedDB`);
      const allOfflineGeneticIds = await getAllEntries('geneticIds');
      const filteredByPopulation = allOfflineGeneticIds.filter(item =>
        item.populationId === selectedPopulation.value
      );
      console.log(`Offline: Found ${filteredByPopulation.length} genetic ID records matching Population ${selectedPopulation.value}:`, JSON.stringify(filteredByPopulation, null, 2));
      const uniqueFamilyIds = [...new Set(filteredByPopulation.map(item => item.familyId))];
      const uniqueRametIds = [...new Set(filteredByPopulation.map(item => item.rametId))];
      const uniqueGeneticIds = [...new Set(filteredByPopulation.map(item => item.geneticId))];
      const uniqueProgenyIds = [...new Set(filteredByPopulation.map(item => item.progenyId))];

      const famOptions = uniqueFamilyIds.map(famId => ({
        value: famId,
        label: famId,
      }));
      setFamOptions(famOptions);

      const rametOptions = uniqueRametIds.map((rametId) => {
        return {
          value: rametId,
          label: rametId,
        };
      });
      setRametOptions(rametOptions);

      const geneticIdOptions = uniqueGeneticIds.map((geneticId) => {
        return {
          value: geneticId,
          label: geneticId,
        };
      });
      setGenOptions(geneticIdOptions);

      const progenyIdOptions = uniqueProgenyIds.map((progenyId) => {
        return {
          value: progenyId,
          label: progenyId,
        };
      });
      setProOptions(progenyIdOptions);
      
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
    //props.sendGeneticIdToParent(e.value);

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

  const handleLocationChange = (e) => {
    setError("");
    setLocation({ value: e.value, label: e.value });
  }

  return (
    <div className="form-div">
      <div>
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        {props.operation === 'add' ?
          <h1>Add Tree</h1> :
          <h1>Edit Tree</h1>
        }

        <div className="input-div">
          <label className="entry-label">Tree ID:</label>
          <input
            type="text"
            value={treeId}
            disabled={!changeId}
            onChange={(e) => {
              setTreeId(e.target.value);
              setError("");
            }}
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
            <LocationHover /> Location:
          </label>
          <Select
            options={locationOptions}
            onChange={handleLocationChange}
            value={location ? location : ""}
          />
        </div>

        <div className="input-div">
          <label className="entry-label">
            <GPSHover /> GPS:
          </label>
          <input
            type="text"
            value={gps}
            onChange={(e) => {
              setGps(e.target.value);
              setError("");
            }}
          />
        </div>


        <div className="button-div">
          <button className="form-button" id="submit" onClick={handleSubmit}>
            Submit
          </button>
          <button className="form-button" id="clear" onClick={clear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default TreeMaterial;
