import "./StoryDescription.css";

const StoryDescription = ({
  description,
  setStoryData,
  onNext,
  onPrevious,
}) => {
  const handleDescriptionChange = (e) => {
    setStoryData((prevData) => ({ ...prevData, description: e.target.value }));
  };

  return (
    <div className="sd-story-description">
      <h2 className="sd-title">Shape Your Story</h2>
      <textarea
        className="sd-textarea"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="What direction do you want your story to take?"
        rows="5"
      ></textarea>
      <div className="sd-button-group">
        <button className="sd-previous-button" onClick={onPrevious}>
          Back
        </button>
        <button
          className="sd-next-button"
          onClick={onNext}
          disabled={!description.trim()}
        >
          Forward
        </button>
      </div>
    </div>
  );
};

export default StoryDescription;
