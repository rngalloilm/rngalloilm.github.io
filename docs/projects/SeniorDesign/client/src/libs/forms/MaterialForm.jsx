import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AcclimationForm from './AcclimationForm';
import ColdTreatmentForm from './ColdTreatmentForm';
import ConeMaterial from './ConeMaterial';
import FieldstationForm from './FieldstationForm';
import GeneticIdForm from './GeneticIdForm';
import GerminationForm from './GerminationForm';
import GreenhouseForm from './GreenhouseForm';
import InitiationForm from './InitiationForm';
import LocationForm from './LocationForm'
import MaintenanceForm from './MaintenanceForm';
import MaturationForm from './MaturationForm';
import PopulationForm from './PopulationForm';
import RametForm from './RametForm';
import SeedMaterial from './SeedMaterial';
import SpeciesForm from './SpeciesForm';
import TreeMaterial from './TreeMaterial';
import ImageUpload from "./ImageUpload";
import { addPhoto, getPhotos } from "../services/api-client/photoService";
import Slideshow from "./Slideshow";
import FileList from "./FileList";
import FileUpload from "./FileUpload";
import { addFile, getFiles } from "../services/api-client/fileService";
import '../../libs/style/Material.css';
import { useNavigate, Link } from "react-router-dom";
import { getLocationByName } from '../services/api-client/locationService';
function MaterialForm(props) {
	const { material, action, id } = useParams();
	const [selectedImage, setSelectedImage] = useState(null);
	const [photos, setPhotos] = useState(null);
	const [files, setFiles] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);

	// Function to receive the selected image from child component
	const handleImageSelection = (image) => {
		setSelectedImage(image);
	};
	const handleFileSelection = (file) => {
		setSelectedFile(file);
	};

	const updatePhotos = (newPhotos) => {
		setPhotos(newPhotos);
	};

	const updateFiles = (newFiles) => {
		setFiles(newFiles);
	};

	const handleFileSubmit = async (materialId) => {
		if (!!selectedImage) {
			await addPhoto(materialId, selectedImage.file);
		}
		if (!!selectedFile) {
			await addFile(materialId, selectedFile);
		}
	};

	useEffect(() => {
		async function loadPhotos() {
			//setPhotos(await getPhotos(id));
			if(material !== 'location'){
				setPhotos(await getPhotos(id));
			} else{
				
				const res = await getLocationByName(id);
				console.log("RES DATA:",res.data);
				const uniqueId = res.data.uniqueId;
				console.log("PHOTO UNIQUE ID:", uniqueId);
				setPhotos(await getPhotos(uniqueId));
			}
		  
		}
		async function loadFiles() {
			
		if(material !== 'location'){
		 setFiles(await getFiles(id));
		} else{
			const res = await getLocationByName(id);
			console.log("RES DATA:",res.data);
			const uniqueId = res.data.uniqueId;
			console.log("FILE UNIQUE ID:", uniqueId);
			  setFiles(await getFiles(uniqueId));	
		}
		}
		if (id) {
			loadPhotos();
			loadFiles();
		}
	}, [id]);

	return (
		<div className='parent-container'>
			<div className='flex-container'>
				<div className='flex-child'>
					{material === 'acclimation' &&
						<>
							<AcclimationForm operation={action} acclimationId={id} handleFilesSubmit={handleFileSubmit} />
						</>
					}
					{material === 'cold-treatment' &&
						<>
							<ColdTreatmentForm operation={action} acclimationId={id} handleFilesSubmit={handleFileSubmit} />
						</>
					}
					{material === 'cones' && (
						<>
							<ConeMaterial operation={action} coneId={id} handleFilesSubmit={handleFileSubmit} user={props.user} />
						</>
					)}
					{material === 'fieldstation' && (
						<>
							<FieldstationForm operation={action} fieldstationId={id} handleFilesSubmit={handleFileSubmit} />
						</>
					)}
					{material === 'genetic-id' && (
						<>
							<GeneticIdForm operation={action} geneticId={id} handleFilesSubmit={handleFileSubmit} user={props.user} />
						</>
					)}
					{material === 'germination' && (
						<>
							<GerminationForm operation={action} germinationId={id} handleFilesSubmit={handleFileSubmit} />
						</>
					)}
					{material === 'greenhouse' && (
						<>
							<GreenhouseForm operation={action} greenhouseId={id} handleFilesSubmit={handleFileSubmit} />
						</>
					)}
					{material === 'initiation' && (
						<>
							<InitiationForm operation={action} initiationId={id} handleFilesSubmit={handleFileSubmit} />
						</>
					)}
					{material === 'location' && (
						<>
							<LocationForm operation={action} locationId={id} handleFilesSubmit={handleFileSubmit} user={props.user} />
						</>
					)}
					{material === 'maintenance' && (
						<>
							<MaintenanceForm operation={action} maintenanceId={id} handleFilesSubmit={handleFileSubmit} />
						</>
					)}
					{material === 'maturation' && (
						<>
							<MaturationForm operation={action} maturationId={id} handleFilesSubmit={handleFileSubmit} />
						</>
					)}
					{material === 'population' && (
						<>
							<PopulationForm operation={action} populationId={id} handleFilesSubmit={handleFileSubmit} user={props.user} />
						</>
					)}
					{material === 'ramet-material' && (
						<>
							<RametForm operation={action} rametId={id} handleFilesSubmit={handleFileSubmit} user={props.user} />
						</>
					)}
					{material === 'seeds' && (
						<>
							<SeedMaterial operation={action} seedId={id} handleFilesSubmit={handleFileSubmit} user={props.user} />
						</>
					)}
					{material === 'species' && (
						<>
							<SpeciesForm operation={action} speciesId={id} handleFilesSubmit={handleFileSubmit} user={props.user} />
						</>
					)}
					{material === 'trees' && (
						<>
							<TreeMaterial operation={action} treeId={id} handleFilesSubmit={handleFileSubmit} user={props.user} />
						</>
					)}
				</div>
				{(material === 'location' && action === 'edit') || (material !== 'population' && material !== 'species' && material !== 'location' && material !== 'genetic-id') ? (
				<div className='flex-child'>
					<div className='files'>
					
						{!!photos && photos.length !== 0 &&
							<Slideshow photos={photos} updatePhotos={updatePhotos} />
						}
						<ImageUpload onImageSelect={handleImageSelection} />
						<FileUpload onFileSelect={handleFileSelection} />
						{!!files && files.length !== 0 &&
							<FileList files={files} updateFiles={updateFiles}/>
						}
							
					{action === 'edit' && (material === 'trees' || material === 'cones' || material === 'seeds') &&
					<h1>View Report</h1>
					}
					{action === 'edit' && (material === 'trees') ? (
							<Link to={"/report/tree/" + id}>
								<button className='report-button'>Export</button>
         					 </Link>
						): <div></div>}
					{action === 'edit' && (material === 'cones') ? (
						<Link to={"/report/cone/" + id}>
							<button className='report-button'>Export</button>
							</Link>
					): <div></div>}
					{action === 'edit' && (material === 'seeds') ? (
							<Link to={"/report/seed/" + id}>
								<button className='report-button'> Export</button>
         					 </Link>
						): <div></div>}
					</div>
					
				</div>
				): <div></div>}
			</div>
		</div>
	);
}

export default MaterialForm;
