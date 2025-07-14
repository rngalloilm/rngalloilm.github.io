import React, { useState, useEffect } from "react";
import "../../libs/style/GerminationMaterial.css";
import GeneticHover from "../hover-info/GeneticHover";
import LocationHover from "../hover-info/LocationHover";
import GenericHover from "../hover-info/GenericHover";
import ExpectedTransferDateHover from "../hover-info/ExpectedTransferDateHover";
import { addGermination, getGermination, updateGermination } from "../services/api-client/germinationService";
import { getId, getIds } from "../services/api-client/idService";
import { useNavigate } from "react-router-dom";
import { getColdTreatment } from "../services/api-client/coldTreatmentService";
import Select from "react-select";
import { getLocations } from "../services/api-client/locationService";
import ImageUpload from "./ImageUpload";
import FileUpload from "./FileUpload"

function GerminationForm(props) {
  const [germinationId, setGerminationId] = useState("");
  const [geneticId, setGeneticId] = useState({ value: "", label: "" });
  const [numberEmbryos, setNumberEmbryos] = useState("");
  const [mediaBatch, setMediaBatch] = useState("");
  const [dateGermination, setDateGermination] = useState("");
  const [transferDate, setTransferDate] = useState(null);
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

  useEffect(() => {
    if (props.operation === "edit") {
      setChangeId(false);
      //const id = window.location.href.split("/")[5];

      getGermination(props.germinationId).then((response) => {
        getId(response.data.germinationGeneticId).then((id) => {
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
        setGerminationId(response.data.germinationId);
        setNumberEmbryos(response.data.numberEmbryos);
        setMediaBatch(response.data.mediaBatch);
        setDateGermination(response.data.dateGermination.substring(0, 10));
        setTransferDate(response.data.transferDate.substring(0, 10));
        setLocation(response.data.locationId);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });
    } else if (props.prop === "Yes") {
      setChangeGen(false);
      const id = window.location.href.split("/")[5];

      getColdTreatment(id).then((response) => {
        getId(response.data.coldTreatmentGeneticId).then((id) => {
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
          setGerminationId(response.data.germinationId);
          setNumberEmbryos(response.data.numberEmbryos);
          setMediaBatch(response.data.mediaBatch);
          setDateGermination(response.data.dateGermination.substring(0, 10));
          setTransferDate(response.data.transferDate.substring(0, 10));
          setLocation(response.data.locationId);
        }).catch((error) => {
          console.log(error);
          setError("An error occured: " + error);
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
      await addGermination(germinationId, geneticId.value, numberEmbryos, mediaBatch, dateGermination, location.value, true, transferDate).then(() => {
        if (props.prop !== "Yes"){
        props.handleFilesSubmit(germinationId);
        }
        clear();
        navigate(-1);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });

    } else if (props.operation === "edit") {
      await updateGermination(germinationId, geneticId.value, numberEmbryos, mediaBatch, dateGermination, location.value, true, transferDate).then(() => {
        props.handleFilesSubmit(germinationId);
        clear();
        navigate(-1);
      }).catch((error) => {
        console.log(error);
        setError("An error occured: " + error);
      });

    }
  }

  const clear = () => {
    setGerminationId("");
    setNumberEmbryos("");
    setMediaBatch("");
    setDateGermination("");
    setTransferDate("");
    setLocation({ value: "", label: "" });
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
      setTransferDate(null);
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

  const handleLocationChange = (e) => {
    setError("");
    setLocation({value: e.value, label: e.value});
  }

  return (
    <div className="form-div">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h1>Add Germination Material</h1>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The ID of the material in the germiantion stage" />Germination ID:</label>
        <input type="text" value={germinationId} disabled={!changeId} onChange={(e) => { setGerminationId(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GeneticHover /> Genetic ID:</label>
        <Select options={genOptions} value={geneticId ? geneticId : ""} onChange={handleGenChange} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The number of embryos in germination" />Number of Embryos:</label>
        <input type="text" value={numberEmbryos} onChange={(e) => { setNumberEmbryos(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The media batch the materials are stored in" />Media Batch:</label>
        <input type="text" value={mediaBatch} onChange={(e) => { setMediaBatch(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The date the material was moved to the germination stage" />Date of Germination:</label>
        <input type="date" value={dateGermination} onChange={(e) => { setDateGermination(e.target.value); setError("") }} />
      </div>

      <div className="input-div">
        <label className="entry-label"><GenericHover text="The date the material is expected to be transferred" />Transfer Date:</label>
        <input type="date" value={transferDate} onChange={(e) => { setTransferDate(e.target.value); setError("") }} />
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

export default GerminationForm;
