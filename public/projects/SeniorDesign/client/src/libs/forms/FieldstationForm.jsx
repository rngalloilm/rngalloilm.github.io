import React, { useState, useEffect } from "react";
import "../../libs/style/GerminationMaterial.css";
import LocationHover from "../hover-info/LocationHover";
import GenericHover from "../hover-info/GenericHover";
import { addFieldstation, getFieldstation, updateFieldstation } from "../services/api-client/fieldstationService";
import { getGreenhouse } from "../services/api-client/greenhouseService";
import Select from "react-select";
import GeneticHover from "../hover-info/GeneticHover";
import { getId, getIds } from "../services/api-client/idService";
import { useNavigate } from "react-router-dom";
import { getLocations } from "../services/api-client/locationService";

function FieldstationForm(props) {
  const [fieldStationId, setFieldStationId] = useState("");
  const [geneticId, setGeneticId] = useState({ value: "", label: "" });
  const [datePlanted, setDatePlanted] = useState("");
  const [location, setLocation] = useState({ value: "", label: "" });
  const [error, setError] = useState("");
  const [genOptions, setGenOptions] = useState([]);
  const [changeGen, setChangeGen] = useState(true);
  const [changeId, setChangeId] = useState(true);
  const navigate = useNavigate();
  const [locationOptions, setLocationOptions] = useState([]);
  useEffect(() => {
    getExistingLocations();
  }, []);

  const handleLocationChange = (e) => {
    setError("");
    setLocation({value: e.value, label: e.value});
  }
  useEffect(() => {
    if (props.operation === "edit") {
      setChangeId(false);
      //const id = window.location.href.split("/")[5];

      getFieldstation(props.fieldStationId).then((response) => {
        getId(response.data.fieldStationGeneticId).then((id) => {
          setGeneticId({
            value: id.data.id, label: "P" +
              id.data.populationId +
              "_" +
              id.data.familyId +
              "_" +
              (id.data.rametId ? id.data.rametId : "NA") +
              "_" +
              id.data.geneticId +
              "_" +
              id.data.progenyId,
          });
        });
        setFieldStationId(response.data.fieldStationId);
        setDatePlanted(response.data.datePlanted.substring(0,10));
        setLocation(response.data.locationId);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });
    } else if (props.prop === "Yes") {
      setChangeGen(false);
      const id = window.location.href.split("/")[5];
      getGreenhouse(id).then((response) => {
        getId(response.data.greenhouseGeneticId).then((id) => {
          setGeneticId({
            value: id.data.id, label: "P" +
              id.data.populationId +
              "_" +
              id.data.familyId +
              "_" +
              (id.data.rametId ? id.data.rametId : "NA") +
              "_" +
              id.data.geneticId +
              "_" +
              id.data.progenyId,
          });
        });
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });
    }

    getIds().then((response) => {
      const options = response.data.map((id) => {
        return {
          value: id.id,
          label:
            "P" +
            id.populationId +
            "_" +
            id.familyId +
            "_" +
            (id.rametId ? id.rametId : "NA") +
            "_" +
            id.geneticId +
            "_" +
            id.progenyId,
        };
      });
      setGenOptions(options);
    }).catch((error) => {
      console.log(error);
      setError("An error occured: " + error);
    });
  }, [props]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.operation === "add") {
      await addFieldstation(fieldStationId, geneticId.value, datePlanted, location.value, true).then(() => {
        if (props.prop !== "Yes"){
        props.handleFilesSubmit(fieldStationId);
        }
        clear();
        navigate(-1);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });

    } else if (props.operation === "edit") {
      await updateFieldstation(fieldStationId, geneticId.value, datePlanted, location.value, true).then(() => {
        props.handleFilesSubmit(fieldStationId);
        clear();
        navigate(-1);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });

    }

  }

  const clear = () => {
    setFieldStationId("");
    setGeneticId("");
    setDatePlanted("");
    setLocation("");
    setError("");
    setGenOptions([]);
    getIds().then((response) => {
      const options = response.data.map((id) => {
        return {
          value: id.id,
          label:
            "P" +
            id.populationId +
            "_" +
            id.familyId +
            "_" +
            (id.rametId ? id.rametId : "NA") +
            "_" +
            id.geneticId +
            "_" +
            id.progenyId,
        };
      });
      setGenOptions(options);
    }).catch((error) => {
      console.log(error);
      setError("An error occured: " + error);
    });
  }

  const handleGenChange = (e) => {
    setGeneticId({ value: e.value, label: e.label });
    setError("");
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
  return (
    <div className="form-div">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {props.operation === 'add' ?
        <h1>Add Field Station</h1> :
        <h1>Edit Field Station</h1>
      }

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The ID of the same material in the previous stage" />Field Station ID:</label>
        <input type="text" value={fieldStationId} disabled={!changeId} onChange={(e) => { setFieldStationId(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GeneticHover /> Genetic ID:</label>
        <Select options={genOptions} value={geneticId ? geneticId : ""} onChange={handleGenChange} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The date the material was moved to the field station" />Date:</label>
        <input type="date" value={datePlanted} onChange={(e) => { setDatePlanted(e.target.value); setError("") }} />
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
        <button className="form-button" id="clear" onClick={clear}>
          Clear
        </button>
      </div>
      <div className="error-div">
        <p>{error}</p>
      </div>
    </div>
  );
}

export default FieldstationForm;
