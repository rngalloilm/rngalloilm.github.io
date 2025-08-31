import React, { useState } from "react";  
import "../../libs/style/PopulationForm.css";
import { addPopulation } from "../services/api-client/populationService";
import { useNavigate } from "react-router-dom";
import PopulationHover from "../hover-info/PopulationHover";
import { addOfflineEntry } from "../../IndexedDB";

function PopulationForm(props) {
  const { operation = 'add', isOpen, onClose, addPopOption } = props;

  const [populationId, setPopulationId] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Keep for API call feedback
  const [error, setError] = useState("");

  const [fromForm, setFromForm] = useState(isOpen || false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!populationId.trim()) {
      setError("Population ID cannot be empty.");
      setIsLoading(false);
      return;
    }

    const populationData = {
      populationId: populationId.trim(),
      id: populationId.trim(),
      active: true
    };

    const isCurrentlyOffline = !navigator.onLine;
    console.log(`Checking offline status. navigator.onLine: ${navigator.onLine}, isCurrentlyOffline: ${isCurrentlyOffline}`);

    if (isCurrentlyOffline) {
      // --- OFFLINE ADD LOGIC ---
      console.log(`Offline Add: Saving population to IndexedDB:`, populationData);
      try {
        await addOfflineEntry('populations', populationData);
        alert(`Population "${populationData.id}" saved locally.`);

        if (fromForm) {
          addPopOption(populationData.id);
          onClose();
        } else {
          navigate(-1);
        }
        clearForm(false);

      } catch (dbError) {
        console.error(`Error adding population to IndexedDB:`, dbError);
        // Handle potential IndexedDB errors
      } finally {
        setIsLoading(false);
      }
    }

    try {
        // --- ONLINE ADD ONLY ---
        console.log(`Online Add: Calling addPopulation API for ID: ${populationId.trim()}`);
        await addPopulation(populationId.trim(), true, false, null); // Call the online API service
        alert(`Population "${populationId.trim()}" added successfully.`);

        if (fromForm) {
            addPopOption(populationId.trim()); // Call back to parent modal
            onClose(); // Close modal
        } else {
            navigate(-1); // Navigate back if standalone page
        }
        clearForm(false); // Clear form fields but let parent handle modal state

    } catch (err) {
        console.error(`Error adding population:`, err);
        const errMsg = err.response?.data?.message || err.message || 'Unknown error';
        // Handle specific errors like duplicate ID from the API
        if (errMsg?.includes('already exists')) {
              setError(`Population ID "${populationId.trim()}" already exists.`);
        } else {
              setError(`Operation failed: ${errMsg}`);
        }
    } finally {
        setIsLoading(false);
    }
  };
    
  const clearForm = (shouldCloseModal = true) => {
    setPopulationId("");
    setError('');
    if (fromForm && shouldCloseModal) {
      onClose();
    }
  };

  // Add edit population (remember to href or navigate to -1)


  return (
    <div className={`form-div ${isOpen ? "modal-open" : ""}`}>
       {/* Conditionally render back button or close button for modal */}
       {fromForm ? (
           // When used as a modal, the 'clear' button acts as 'Cancel' by calling clearForm(true) which calls onClose
           <button type="button" className="back-button" onClick={() => clearForm(true)}>X Close</button>
       ) : (
           <button type="button" className="back-button" onClick={() => navigate(-1)}>← Back</button>
       )}

       <h1>Add Population</h1> {/* Only Add is supported now */}

      <form onSubmit={handleSubmit}>
        <div className="input-div">
          <label className="entry-label"><PopulationHover /> Population ID:</label>
          <input
            type="text"
            value={populationId}
            onChange={(e) => {
                setPopulationId(e.target.value);
                setError(""); // Clear error on change
              }}
            disabled={isLoading} // Disable input while submitting
           />
        </div>

        <div className="button-div">
          <button className="form-button" id="submit" type="submit" disabled={isLoading}>
             {isLoading ? 'Saving...' : 'Submit'}
          </button>
          {/* Clear button calls clearForm, closing modal if applicable */}
          <button type="button" className="form-button" id="clear" onClick={() => clearForm(true)} disabled={isLoading}>
             {fromForm ? 'Cancel' : 'Clear'}
          </button>
        </div>
         {error && <div className="error-div"><p>{error}</p></div>}
      </form>
    </div>
  );
}

export default PopulationForm;
