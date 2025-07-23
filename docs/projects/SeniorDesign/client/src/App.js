import React, { useState, useEffect } from "react";
import { instance } from './libs/services/api-client/apiClient';
import "./App.css";
import Header from "./libs/page-content/Header";
import Home from "./libs/home/HomeView";
import OnlineOffline from "./libs/resource/OnlineOfflineView";
import FieldOnline from "./libs/resource/OnlineFieldView";
import FieldOffline from "./libs/resource/OfflineFieldView";
import OfflineSelection from "./libs/resource/OfflineSelectionView";
import Lab from "./libs/resource/LabView";
import Archive from "./libs/resource/ArchiveView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaterialForm from "./libs/forms/MaterialForm";
import Report from "./libs/reports/Report";
import QRCodeReader from "./libs/qr/QRCodeReader";
import Invalid from "./libs/invalid/Invalid";
import UserManagement from "./libs/admin/UserManagement/UserManagement";
import Logs from "./libs/admin/Logs/Logs";
import MaintenanceForm from "./libs/forms/MaintenanceForm";
import MaturationForm from "./libs/forms/MaturationForm";
import ColdTreatmentForm from "./libs/forms/ColdTreatmentForm";
import GreenhouseForm from "./libs/forms/GreenhouseForm";
import GerminationForm from "./libs/forms/GerminationForm";
import AcclimationForm from "./libs/forms/AcclimationForm";
import FieldstationForm from "./libs/forms/FieldstationForm";


// MUI PRO
import { LicenseInfo } from "@mui/x-license-pro";
LicenseInfo.setLicenseKey(
  "962f492b63bc42efaa1912e1c879212cTz02MzgzOSxFPTE3MTI1MDY2MzYxODMsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        await instance.get("/users/current").then((response) => {
          setUser(response.data);
        });
      } catch (error) {
        console.log('Error finding current user.\n' + error);
      }
      setIsLoading(false);
    }
    
    loadCurrentUser();
  }, []);

  //Register service worker?
  

  console.log("user: ", user);
  return (
    <>
      {!isLoading && 
        <Router>
          {user ? (
            <>
              <Header user={user} />
              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/onlineoffline" element={<OnlineOffline user={user} />} />
                <Route path="/field/online" element={<FieldOnline user={user}/>} />
                <Route path="/field/offline/selection" element={<OfflineSelection user={user}/>} />
                <Route path="/field/offline" element={<FieldOffline user={user}/>} />
                <Route path="/lab" element={<Lab user={user}/>} />
                <Route path="/archive" element={<Archive user={user}/>} />
                <Route path="/material/:material/:action/:id?" element={<MaterialForm user={user} />} />
                <Route path="/report/:type/:id/" element={<Report />} />
                <Route path="/qr/read" element={<QRCodeReader />} />
                <Route path="/user-management" element={<UserManagement user={user} />} />
                <Route path="/logs" element={<Logs user={user} />} />
                <Route path="/invalid" element={<Invalid />} />
                <Route path="*" element={<Invalid />} />
                <Route path="/propagate/initiation/:id" element={<MaintenanceForm operation="add" prop="Yes" />} />
                <Route path="/propagate/maintenance/:id" element={<MaturationForm operation="add" prop="Yes" />} />
                <Route path="/propagate/maturation/:id" element={<ColdTreatmentForm operation="add" prop="Yes" />} />
                <Route path="/propagate/cold-treatment/:id" element={<GerminationForm operation="add" prop="Yes" />} />
                <Route path="/propagate/germination/:id" element={<AcclimationForm operation="add" prop="Yes" />} />
                <Route path="/propagate/acclimation/:id" element={<GreenhouseForm operation="add" prop="Yes" />} />
                <Route path="/propagate/greenhouse/:id" element={<FieldstationForm operation="add" prop="Yes" />} />

              </Routes>
            </>
          ) : (
            <>
              <Header />
              <Routes>
                <Route path="*" exact={true} element={<Invalid />} />
              </Routes>
            </>
          )}
        </Router>
      }
    </>
  );
}

export default App;
