import React, { useState, useEffect } from "react";
import { getTree } from "../services/api-client/treeService";
import { getId } from "../services/api-client/idService";
import QRCodeGenerator from "../qr/QRGenerator";
import { getFiles } from "../services/api-client/fileService";
import FileList from "../forms/FileList";
function TreeReport(props) {
  //get a tree from the database
  const [tree, setTree] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
	const [files, setFiles] = useState(null);

  useEffect(() => {

    async function loadTree() {

    //get tree
    await getTree(props.id)
      .then(async (res) => {
        let obj = {
          treeId: res.data.treeId,
          treeGeneticId: res.data.treeGeneticId,
          species: "",
          geneticId: "",
          locationId: res.data.locationId,
          gps: res.data.gps,
          active: res.data.active,
        };
        await getId(res.data.treeGeneticId) 
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

        setTree(obj);

      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    }

    loadTree();
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
      <div id="pdf-element" class="pdf-div">
        < div className="info-box">
          <h2>Tree Report</h2>
          <div className="param">
            <h3 className="h3-report">Tree Genetic ID</h3>
            <p>{tree.geneticId}</p>
          </div>
          <div className="param">
            <h3 className="h3-report">Tree ID</h3>
            <p>{props.id}</p>
          </div>
          <div className="param">
            <h3 className="h3-report">Species</h3>
            <p>{tree.species}</p>        
          </div>
          <div className="param">
            <h3 className="h3-report">Location</h3>
            <p>{tree.locationId}</p>
            <p>GPS: {tree.gps}</p>
          </div>
          <div className="param">
            <h3 className="h3-report">Active: {tree.active ? '✔' : '✖'}</h3>
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

export default TreeReport;
