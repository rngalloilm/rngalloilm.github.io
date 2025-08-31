import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../libs/style/MaturationForm.css";
import GeneticHover from "../hover-info/GeneticHover";
import LocationHover from "../hover-info/LocationHover";
import GenericHover from "../hover-info/GenericHover";
import ExpectedTransferDateHover from "../hover-info/ExpectedTransferDateHover";
import Select from 'react-select';
import { addMaturation, getMaturation, updateMaturation } from "../services/api-client/maturationService";
import { getMaintenance } from "../services/api-client/maintenanceService";
import { getId, getIds } from "../services/api-client/idService";
import { getLocations } from "../services/api-client/locationService";

function Maturation(props) {
  const [maturationId, setMaturationId] = useState("");
  const [geneticId, setGeneticId] = useState({ value: "", label: "" });
  const [numberOfPlates, setNumberOfPlates] = useState("");
  const [mediaBatch, setMediaBatch] = useState("");
  const [dateMatured, setDateMatured] = useState("");
  const [transferDate, setTransferDate] = useState(null);
  const [location, setLocation] = useState({ value: "", label: "" });
  const [error, setError] = useState("");
  const [genOptions, setGenOptions] = useState([]);
  const [changeGen, setChangeGen] = useState(true);
  const [changeId, setChangeId] = useState(true);
  const [locationOptions, setLocationOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getExistingLocations();
  }, []);

  useEffect(() => {
    if (props.operation === "edit") {
      setChangeId(false);
      //const id = window.location.href.split("/")[5];

      getMaturation(props.maturationId).then((response) => {
        getId(response.data.maturationGeneticId).then((id) => {
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
        setMaturationId(response.data.maturationId);
        setNumberOfPlates(response.data.numberOfPlates);
        setMediaBatch(response.data.mediaBatch);
        setDateMatured(response.data.dateMatured);
        setTransferDate(response.data.transferDate);
        setLocation(response.data.locationId);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });
    } else if (props.prop === "Yes") {
      const id = window.location.href.split("/")[5];

      getMaintenance(id).then((response) => {
        getId(response.data.maintenanceGeneticId).then((id) => {
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

        setNumberOfPlates(response.data.numberOfPlates);
        setMediaBatch(response.data.mediaBatch);
        setLocation(response.data.location);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });

      setChangeGen(false);
    }

    getIds()
      .then((response) => {
        let options = [];
        response.data.forEach((id) => {
          options.push({
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
          });
        });
        setGenOptions(options);
      })
      .catch((error) => {
        setError(error);
      });
  }, [props]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.operation === "add") {
      await addMaturation(maturationId, geneticId.value, numberOfPlates, mediaBatch, dateMatured, location.value, true, transferDate).then(() => {
        if (props.prop !== "Yes"){
        props.handleFilesSubmit(maturationId);
        }
        clear();
        navigate(-1);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });

    } else if (props.operation === "edit") {
      await updateMaturation(maturationId, geneticId.value, numberOfPlates, mediaBatch, dateMatured, location.value, true, transferDate).then(() => {
        props.handleFilesSubmit(maturationId);
        clear();
        navigate(-1);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });

    }
  };

  const clear = () => {
    setMaturationId("");
    setNumberOfPlates("");
    setMediaBatch("");
    setDateMatured("");
    setLocation({ value: "", label: "" });
    setGenOptions([]);
    getIds()
      .then((response) => {
        let options = [];
        response.data.forEach((id) => {
          options.push({
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
          });
        });
        setGenOptions(options);
        setTransferDate(null);
      })
      .catch((error) => {
        setError(error);
      });
  }

  const handleGenChange = (e) => {
    setGeneticId({ value: e.value, label: e.label });
    setError("");
  };

  const handleLocationChange = (e) => {
    setError("");
    setLocation({value: e.value, label: e.value});
  }

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
      <h1>Add Maturation Material</h1>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The ID of the material in the Maturation stage" />Maturation ID:</label>
        <input type="text" value={maturationId} disabled={!changeId} onChange={(e) => { setMaturationId(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GeneticHover /> Genetic ID:</label>
        <Select options={genOptions} value={geneticId ? geneticId : ""} onChange={handleGenChange} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The number of plates in Maturation" />Number Of Plates:</label>
        <input type="text" value={numberOfPlates} onChange={(e) => { setNumberOfPlates(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The Media Batch in Maturation Stage" />Media Batch:</label>
        <input type="text" value={mediaBatch} onChange={(e) => { setMediaBatch(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="Material Maturation Date" />Maturation Date</label>
        <input type="date" value={dateMatured} onChange={(e) => { setDateMatured(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="Material Transfer Date" />Transfer Date</label>
        <input type="date" value={transferDate} onChange={(e) => { setTransferDate(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <LocationHover text="Location of Maintenance" /> Location:
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

export default Maturation;
