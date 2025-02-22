import { useNavigate } from "react-router-dom";
import "./AdditionalOptions.css";

const AdditionalOptions = ({
  storyData,
  setStoryData,
  onSubmit,
  onPrevious,
  isLoading,
  sessionId, // Added sessionId prop
}) => {
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLaunch = () => {
    if (!sessionId) {
      console.error("Session ID is missing");
      return;
    }
    navigate("/order-selection", { state: { storyData, sessionId } });
  };

  return (
    <div className="ao-additional-options">
      <h2 className="ao-title">Unleash Your Story’s Soul</h2>
      <div className="ao-options-container">
        <div className="ao-option-card">
          <label htmlFor="characterName" className="ao-label">
            Main Character Name:
          </label>
          <input
            type="text"
            id="characterName"
            name="characterName"
            value={storyData.characterName}
            onChange={handleInputChange}
            className="ao-input"
            placeholder="Who’s the star?"
          />
        </div>
        <div className="ao-option-card">
          <label htmlFor="setting" className="ao-label">
            Story Setting:
          </label>
          <input
            type="text"
            id="setting"
            name="setting"
            value={storyData.setting}
            onChange={handleInputChange}
            className="ao-input"
            placeholder="Where does it unfold?"
          />
        </div>
        <div className="ao-option-card">
          <label htmlFor="storyLength" className="ao-label">
            Story Length:
          </label>
          <select
            id="storyLength"
            name="storyLength"
            value={storyData.storyLength}
            onChange={handleInputChange}
            className="ao-select"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
      </div>
      <div className="ao-button-group">
        <button className="ao-previous-button" onClick={onPrevious}>
          Back
        </button>
        <button
          className="ao-create-story-button"
          onClick={handleLaunch}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Launch Your Epic!"}
        </button>
      </div>
    </div>
  );
};

export default AdditionalOptions;
