import { useState } from "react";
import "./PhotoUpload.css";

const PhotoUpload = ({ photos, setStoryData, onNext, onPrevious }) => {
  const [dragActive, setDragActive] = useState(false);

  const handlePhotoUpload = (files) => {
    const newPhotos = Array.from(files);
    setStoryData((prevData) => ({
      ...prevData,
      photos: [...prevData.photos, ...newPhotos],
    }));
  };

  const handleFileChange = (event) => {
    handlePhotoUpload(event.target.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handlePhotoUpload(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removePhoto = (indexToRemove) => {
    setStoryData((prevData) => ({
      ...prevData,
      photos: prevData.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <div className="pu-photo-upload">
      <h2 className="pu-title">Add Your Story Moments</h2>
      <div
        className={`pu-upload-area ${dragActive ? "pu-drag-active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label htmlFor="photo-input" className="pu-upload-label">
          <span>Drag & Drop or Click to Upload</span>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>
      <div className="pu-photo-preview">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="pu-photo-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              src={URL.createObjectURL(photo)}
              alt={`Uploaded preview ${index + 1}`}
            />
            <button
              className="pu-remove-button"
              onClick={() => removePhoto(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="pu-button-group">
        <button className="pu-previous-button" onClick={onPrevious}>
          Back
        </button>
        <button className="pu-next-button" onClick={onNext}>
          Forward
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;
