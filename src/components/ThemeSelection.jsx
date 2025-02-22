import "./ThemeSelection.css";

const storyThemes = [
  "Love",
  "Sad",
  "Hero",
  "Family",
  "Friends",
  "Baby",
  "Adventure",
  "Mystery",
  "Fantasy",
  "Sci-Fi",
  "Historical",
  "Comedy",
  "Inspirational",
  "Nature",
];

const ThemeSelection = ({ selectedThemes, setStoryData, onNext }) => {
  const handleThemeToggle = (theme) => {
    setStoryData((prevData) => ({
      ...prevData,
      themes: prevData.themes.includes(theme)
        ? prevData.themes.filter((t) => t !== theme)
        : [...prevData.themes, theme],
    }));
  };

  return (
    <>
      <h2 className="ts-title">Choose Your Story Universe</h2>
      <div className="ts-theme-grid">
        {storyThemes.map((theme, index) => (
          <div
            key={theme}
            className={`ts-theme-card ${
              selectedThemes.includes(theme) ? "ts-selected" : ""
            }`}
            onClick={() => handleThemeToggle(theme)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="ts-theme-text">{theme}</span>
            <div className="ts-glow-effect"></div>
          </div>
        ))}
      </div>
      <button
        className="ts-next-button"
        onClick={onNext}
        disabled={selectedThemes.length === 0}
      >
        Dive In!
      </button>
    </>
  );
};

export default ThemeSelection;
