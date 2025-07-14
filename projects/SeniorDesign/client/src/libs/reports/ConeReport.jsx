import React, { useState, useEffect } from "react";
import { getCone } from "../services/api-client/coneService";
import { getId } from "../services/api-client/idService";
import QRCodeGenerator from "../qr/QRGenerator";
import { getFiles } from "../services/api-client/fileService";
import FileList from "../forms/FileList";

function ConeReport(props) {
  //get a cone from the database
  const [cone, setCone] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
	const [files, setFiles] = useState(null);

  useEffect(() => {

    async function loadCone() {

    //get cone
    await getCone(props.id)
      .then(async (res) => {
        let obj = {
          id: res.data.coneId,
          motherTreeId: res.data.motherTreeId,
          fatherTreeId: res.data.fatherTreeId,
          progenyId: res.data.progenyId,
          geneticId: "",
          dateHarvested: res.data.dateHarvested,
          location: res.data.locationId,
          active: res.data.active,
          coneGeneticId: res.data.coneGeneticId,
        };
        await getId(res.data.coneGeneticId) 
            .then((res2) => {
                obj.geneticId =
                    "P" +
                    res2.data.populationId +
                    "_" +
                    res2.data.familyId +
                    "_" +
                    res2.data.geneticId +
                    "_" +
                    res2.data.progenyId;
                obj.species = res2.data.species;
                })
            .catch((error) => {
                setError(error);
            });

        setCone(obj);

      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    }

    loadCone();
  }, [props.id]);

  useEffect(() => {

		async function loadFiles() {
		  setFiles(await getFiles(props.id));
		}
		if (props.id) {
			
			loadFiles();
		}
	}, [props.id]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div id="pdf-element" className="pdf-div">
        <div className="info-box">
          <h2>Cone Report</h2>
          <div className="param">
            <h3 className="h3-report">Cone Genetic ID</h3>
            <p>{cone.geneticId}</p>
          </div>
          <div className="param">
            <h3 className="h3-report">Cone ID</h3>
            <p>{props.id}</p>
          </div>
          <div className="param">
            <h3 className="h3-report">Parent IDs</h3>
            <p>Mother ID: {cone.motherTreeId || "--"}</p>        
            <p>Father ID: {cone.fatherTreeId || "--"}</p>        
          </div>
          {/* <div className="param">
            <h3 className="h3-report">Progeny ID</h3>
            <p>{cone.progenyId || "--"}</p>
          </div> */}
          <div className="param">
            <h3 className="h3-report">Date Harvest</h3>
            <p>{cone.dateHarvested}</p>
          </div>
          <div className="param">
            <h3 className="h3-report">Location</h3>
            <p>{cone.location}</p>
          </div>
          <div className="param">
            <h3 className="h3-report">Active: {cone.active ? '✔' : '✖'}</h3>
          </div>
          {!!files && files.length !== 0 &&
           // <FileList files={files} />
           <div className="param">
            <h3 className="h3-report">File List</h3>
            {files.map((file) => (
                <div key={file.fileId}>
                    <a href={`${file.fileData}`} download={`${file.fileName}`}>
                        {file.fileName}
                    </a>
                    
                </div>
            ))}
            </div>
          } 
        </div>
        <div className="info-box qr-box">
          <QRCodeGenerator className="qrcode" id={props.id} type={props.type}/>
        </div>
      </div>
    </div>
  );
}

export default ConeReport;
