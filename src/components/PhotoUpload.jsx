import { useState } from "react";
import { motion } from "framer-motion";
import "./PhotoUpload.css";

const PhotoUpload = () => {
  const [photos, setPhotos] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos([...photos, ...newPhotos]);
  };

  return (
    <section className="photo-upload">
      <h2>Upload Your Photos</h2>
      <div className="upload-container">
        <label htmlFor="file-upload" className="upload-button">
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Choose Files
          </motion.span>
        </label>
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            className="photo-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={photo || "/placeholder.svg"}
              alt={`Uploaded photo ${index + 1}`}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PhotoUpload;
