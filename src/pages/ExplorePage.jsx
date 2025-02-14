import Book from "./Book";
import "./ExplorePage.css";

const ExplorePage = () => {
  return (
    <div className="explore-page">
      <header className="explore-header">
        <h1>Interactive 3D Storybook</h1>
      </header>
      <Book />
      <div className="cta-container">
        <button className="cta-button">Create Your Own Story</button>
      </div>
    </div>
  );
};

export default ExplorePage;
