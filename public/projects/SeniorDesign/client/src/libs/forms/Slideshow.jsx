import React, { useState } from 'react';
import '../style/Slideshow.css';
import { deletePhoto } from '../services/api-client/photoService';

const Slideshow = ({ photos, updatePhotos }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
 
  const deleteImage = async () => {
    if (photos.length === 0) {
      return;
    }
    let currentPhotoId = photos[currentImageIndex].photoId;
    const newPhotos = photos.filter((_, index) => index !== currentImageIndex);

    if (newPhotos.length === 0) {
      // If there are no images left, reset the current image index.
      setCurrentImageIndex(0);
    } else {
      // Make sure the current image index stays within bounds.
      setCurrentImageIndex((prevIndex) =>
        prevIndex === newPhotos.length - 1 ? 0 : prevIndex
      );
    }

    // Update the photos array.
    // You can use a state management library like Redux to manage the state globally
    // or lift the state up to a higher-level component if needed.
    updatePhotos(newPhotos);

    //need to delete from the database
   const response = await deletePhoto(currentPhotoId);
    if (response.status !== 200){
      console.log(`Error deleting photo with id: ${currentPhotoId}`);
    }
  };

  // Function to handle the next image in the slideshow
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle the previous image in the slideshow
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <h1>Image Gallery</h1>
      <div className="slideshow-container">
        <div className="slideshow-image">
          <img src={`${photos[currentImageIndex].photoData}`} alt={`Image ${currentImageIndex + 1}`} />
        </div>
        <button className="prev" onClick={prevImage}>
          &#10094;
        </button>
        <button className="next" onClick={nextImage}>
          &#10095;
        </button>
        <button className="delete" onClick={deleteImage}>
          Delete
        </button>
      </div>
    </>
  );
};

export default Slideshow;
