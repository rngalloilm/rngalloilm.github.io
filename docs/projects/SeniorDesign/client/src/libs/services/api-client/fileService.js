import { instance } from './apiClient';
import { addLogs } from './logsService';

export async function getFiles(materialId) {
	try {
		//const response = await instance.get(`files/${materialType}/${materialId}`);
		const response = await instance.get("files/"+ materialId);
		const filesData = response.data;
	
		if (filesData && filesData.length > 0) {
		  // Iterate through the received file data and decode each image
		  const files = filesData.map(file => {
			  return {
				fileData: file.fileData,
				fileId: file.fileId,
				fileName: file.fileName,
			  }
		  });
	
		  return files;
		} else {
		  // Handle the case where no files were found for the geneticId
		  return [];
		}
	  } catch (error) {
		console.error('Error fetching files:', error);
		throw error;
	  }
}

export async function addFile(materialId, fileData) {
	const reader = new FileReader();
	//console.log("fileData name:",fileData);
	//console.log("fileData", fileData);
	const fileName = fileData.name;
	reader.onload = function (event) {
	  const base64FileData = event.target.result;
	  console.log('File content:', base64FileData);
	  const requestData = {
		materialId: materialId,
		fileData: base64FileData,
		fileName: fileName,
	  };
  
	  addLogs("Added file with material id: " + materialId);
  
	  // Send the JSON data to the server
	  return instance.post("files", requestData)
		.then(response => {
		  console.log('File uploaded:', response.data);
		})
		.catch(error => {
		  console.error('Error uploading file:', error);
		});
	};
  
	// Read the file as a data URI
	//console.log(fileData);
	reader.readAsDataURL(fileData);
  }

export async function deleteFile(fileId) {
	await addLogs("Deleted file with id: " + fileId);
	return await instance.delete(`files/${fileId}`);
}
