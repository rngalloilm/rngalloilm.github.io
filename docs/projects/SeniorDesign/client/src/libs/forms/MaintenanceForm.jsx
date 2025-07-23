import React, { useState, useEffect } from "react";
import "../../libs/style/MaintenanceForm.css";
import GeneticHover from "../hover-info/GeneticHover";
import LocationHover from "../hover-info/LocationHover";
import GenericHover from "../hover-info/GenericHover";
import ExpectedTransferDateHover from "../hover-info/ExpectedTransferDateHover";
import { getInitiation, } from "../services/api-client/initiationService";
import Select from "react-select";
import { addMaintenance, updateMaintenance, getMaintenance } from "../services/api-client/maintenanceService";
import { getIds, getId } from "../services/api-client/idService";
import { useNavigate } from "react-router-dom";
import { getLocations } from "../services/api-client/locationService";

function Maintenance(props) {
  const [maintenanceId, setMaintenanceId] = useState("");
  const [geneticId, setGeneticId] = useState({ value: "", label: "" });
  const [numberOfPlates, setNumberOfPlates] = useState("");
  const [mediaBatchCurrent, setMediaBatchCurrent] = useState("");
  const [dateCurr, setDateCurr] = useState("");
  const [mediaBatchPrev, setMediaBatchPrev] = useState("");
  const [datePrev, setDatePrev] = useState("");
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

      getMaintenance(props.maintenanceId)
        .then((response) => {
          setMaintenanceId(response.data.maintenanceId);
          setNumberOfPlates(response.data.numberOfPlates);
          setMediaBatchPrev(response.data.mediaBatchCurr);
          setDatePrev(response.data.dateCurr.subString(0, 10));
          setTransferDate(response.data.transferDate.subString(0, 10));
          setLocation(response.data.locationId);
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
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (props.prop === "Yes") {
      const id = window.location.href.split("/")[5];
      console.log("got id: " + id);
      getInitiation(id)
        .then((response) => {
          setNumberOfPlates(response.data.numberOfPlates);
          setDatePrev(response.data.dateMade);
          setTransferDate(response.data.transferDate);
          setMediaBatchPrev(response.data.mediaBatch);
          setLocation(response.data.location);
          console.log("got genetic id: " + response.data.initiationGeneticId);
          getId(response.data.initiationGeneticId).then((id) => {
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
        })
        .catch((error) => {
          setError(error);
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
      await addMaintenance(
        maintenanceId,
        geneticId.value,
        numberOfPlates,
        mediaBatchCurrent,
        dateCurr,
        mediaBatchPrev === "" ? null : mediaBatchPrev,
        datePrev === "" ? null : datePrev,
        transferDate,
        location.value,
        true
      )
        .then(() => {
          if (props.prop !== "Yes"){
            props.handleFilesSubmit(maintenanceId);
          }
          clear();
          navigate(-1);
        })
        .catch((error) => {
          console.log(error);
          setError("An error occured: " + error);
        });

    } else if (props.operation === "edit") {
      await updateMaintenance(
        maintenanceId,
        geneticId.value,
        numberOfPlates,
        mediaBatchCurrent,
        dateCurr,
        mediaBatchPrev === "" ? null : mediaBatchPrev,
        datePrev === "" ? null : datePrev,
        transferDate,
        location.value,
        true
      )
        .then(() => {
          props.handleFilesSubmit(maintenanceId);
          clear();
          navigate(-1);
        })
        .catch((error) => {
          console.log(error);
          setError("An error occured: " + error);
        });
    }
  };

  const clear = () => {
    setMaintenanceId("");
    setNumberOfPlates("");
    setMediaBatchCurrent("");
    setDateCurr("");
    setMediaBatchPrev("");
    setDatePrev("");
    setLocation("");
    setGeneticId({ value: "", label: "" });
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
  };

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
      {props.operation === 'add' ?
        <h1>Add Maintenance</h1> :
        <h1>Edit Maintenance</h1>
      }

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The ID of the material in the Maintenance stage" />
          Maintenance ID:
        </label>
        <input
          type="text"
          value={maintenanceId}
          disabled={!changeId}
          onChange={(e) => {
            console.log(e.target.value);
            setMaintenanceId(e.target.value);
            setError("");
          }}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GeneticHover /> Genetic ID:
        </label>
        <Select
          options={genOptions}
          value={geneticId ? geneticId : ""}
          onChange={handleGenChange}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The number of plates in maintenance" />
          Number Of Plates:
        </label>
        <input
          type="text"
          value={numberOfPlates}
          onChange={(e) => {
            setNumberOfPlates(e.target.value);
            setError("");
          }}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The Current Media Batch" />
          Current Media Batch:
        </label>
        <input
          type="text"
          value={mediaBatchCurrent}
          onChange={(e) => {
            setMediaBatchCurrent(e.target.value);
            setError("");
          }}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The Current Date For Media Batch" />
          Date of Current Media Batch:
        </label>
        <input
          type="date"
          value={dateCurr}
          onChange={(e) => {
            setDateCurr(e.target.value);
            setError("");
          }}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The Previous Media Batch" />
          Previous Media Batch:
        </label>
        <input
          type="text"
          value={mediaBatchPrev}
          onChange={(e) => {
            setMediaBatchPrev(e.target.value);
            setError("");
          }}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The Previous Date For Media Batch" />
          Date of Previous Media Batch:
        </label>
        <input
          type="date"
          value={datePrev}
          onChange={(e) => {
            setDatePrev(e.target.value);
            setError("");
          }}
        />
      </div>

      <div className="input-div">
        <label className="entry-label">
          <GenericHover text="The Material's Transfer Date" />
          Transfer Date:
        </label>
        <input
          type="date"
          value={transferDate}
          onChange={(e) => {
            setTransferDate(e.target.value);
            setError("");
          }}
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

export default Maintenance;
