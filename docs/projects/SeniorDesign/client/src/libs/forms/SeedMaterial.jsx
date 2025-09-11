import React, { useState, useEffect } from "react";
import "../../libs/style/SeedMaterial.css";
import LocationHover from "../hover-info/LocationHover";
import ConeHover from "../hover-info/ConeHover";
import OriginHover from "../hover-info/OriginHover";
import QuantityHover from "../hover-info/QuantityHover";
import GenericHover from "../hover-info/GenericHover";
import GeneticHover from "../hover-info/GeneticHover";
import ProgenyHover from "../hover-info/ProgenyHover";
import PopulationHover from "../hover-info/PopulationHover";
import { addSeed, getSeed, editSeed } from "../services/api-client/seedService";
import Select from "react-select";
import { getPopulations } from "../services/api-client/populationService";
import {
  getIdsByPopulation,
  getIdsByPopulationAndFamily,
  getIdsByPopulationAndFamilyAndRamet,
  getIdsByPopulationAndFamilyAndRametAndGenetic,
} from "../services/api-client/idService";
import {getId} from "../services/api-client/idService";
import {useNavigate} from "react-router-dom";
import PopulationForm from "./PopulationForm";
import GeneticIdForm from "./GeneticIdForm";
import { getLocations } from "../services/api-client/locationService";
import { getTrees } from "../services/api-client/treeService";

function SeedMaterial(props) {
  const [seedId, setSeedId] = useState("");
  const [location, setLocation] = useState("");
  const [cone, setCone] = useState("");
  const [motherTreeIdOptions, setMotherTreeIdOptions] = useState([]);
  const [fatherTreeIdOptions, setFatherTreeIdOptions] = useState([]);
  const [mother, setMother] = useState({value:"", label:""});
  const [father, setFather] = useState({value:"", label:""});
  const [origin, setOrigin] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [transferDate, setTransferDate] = useState(null);
  const [geneticId, setGeneticId] = useState({ value: "", label: "" });
  const [familyId, setFamilyId] = useState({ value: "", label: "" });
  const [rametId, setRametId] = useState({ value: "", label: "" });
  const [progenyId, setProgenyId] = useState({ value: "", label: "" });
  const [population, setPopulation] = useState({ value: "", label: "" });
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

  useEffect(() => {
    getExistingLocations();
    getMotherTreeOptions();
    getFatherTreeOptions();
  }, []);


  useEffect(() => {
    if(props.operation === "edit"){
      setChangeId(false);

      //const id = window.location.href.split("/")[5];

      getSeed(props.seedId).then((seed) => {
        setSeedId(seed.data.id);
        setLocation(seed.data.locationId);
        setCone(seed.data.coneId);
        setMother(seed.data.motherTreeId);
        setFather(seed.data.fatherTreeId);
        setOrigin(seed.data.origin);
        setQuantity(seed.data.quantity);
        setDate(seed.data.dateMade);
        setDate(seed.data.transferDate);

        getId(seed.data.seedGeneticId).then((id) => {
          setPopulation(id.data.populationId);
          setFamilyId(id.data.familyId);
          setGeneticId(id.data.geneticId);
          setProgenyId(id.data.progenyId);
          setRametId(id.data.rametId);
        });
      });
    }
  }, [props.operation]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.operation === "add") {
      if (seedId === "") {
        setError("Please enter a seed ID");
        return;
      }
      addSeed(
        seedId,
        mother.value,
        cone,
        father.value,
        geneticId.value,
        familyId.value,
        progenyId.value,
        population.value,
        rametId.value,
        origin,
        quantity,
        date,
        transferDate,
        location.value,
        true,
        false,
        null
      )
        .then((res) => {
          if (res.status === 200) {
            props.handleFilesSubmit(seedId);
            clear();
            navigate(-1);
          }
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    }
    else if (props.operation === "edit") {
      editSeed(
        seedId,
        mother.value,
        cone,
        father.value,
        geneticId.value,
        familyId.value,
        progenyId.value,
        population.value,
        rametId.value,
        origin,
        quantity,
        date,
        transferDate,
        location.value,
        props.user
      )
        .then((res) => {
          if (res.status === 200) {
            props.handleFilesSubmit(seedId);
            clear();
            navigate(-1);
          }
        })
        .catch((error) => {
          console.log(error);
          alert(`An error occurred: ${error.message || "Unknown error"}`);
          setError(error.response.data.message);
        });
    }
  };

  const clear = () => {
    if (props.operation === "add") {
      setSeedId("");
    }

    setMother({value:"", label:""});
    setFather({value:"", label:""})
    setGeneticId({ value: "", label: "" });
    setFamilyId({ value: "", label: "" });
    setProgenyId({ value: "", label: "" });
    setPopulation({ value: "", label: "" });
    setRametId({ value: "", label: "" });
    setLocation("");
    setCone("");
    setOrigin("");
    setQuantity("");
    setDate("");
    setTransferDate(null);
    setError("");
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

  const handleLocationChange = (e) => {
    setError("");
    setLocation({value: e.value, label: e.value});
  }

  return (
    <div className="form-div">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {props.operation === 'add' ?
        <h1>Add Seed</h1> :
        <h1>Edit Seed</h1>
      }

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="ID of the seed." /> Seed ID:
        </label>
        <input
          type="text"
          value={seedId}
          onChange={(e) => setSeedId(e.target.value)}
          disabled={!changeId}
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
          <ConeHover /> Cone:
        </label>
        <input
          type="text"
          value={cone}
          onChange={(e) => setCone(e.target.value)}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">Mother:</label>
        <Select
          options={motherTreeIdOptions}
          onChange={(e) => setMother({value:e.value,label: e.value})}
          value={mother ? mother : ""}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">Father:</label>
        <Select
          options={fatherTreeIdOptions}
          onChange={(e) => setFather({value:e.value,label: e.value})}
          value={father ? father : ""}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <OriginHover /> Origin:
        </label>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <QuantityHover /> Quantity:
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">Date Made:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">Transfer Date:</label>
        <input
          type="date"
          value={transferDate}
          onChange={(e) => setTransferDate(e.target.value)}
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
  );
}

export default SeedMaterial;
