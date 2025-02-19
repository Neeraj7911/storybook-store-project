import React, { useState, useEffect, useRef } from "react";
import "./Book.css";

const Book = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const bookRef = useRef(null);

  const pages = [
    {
      type: "cover",
      title: "The Magical Journey",
      subtitle: "An Interactive Adventure",
    },
    {
      type: "content",
      image: "https://picsum.photos/300/400?random=1",
      text: "Once upon a time, in a land far away...",
    },
    {
      type: "content",
      image: "https://picsum.photos/300/400?random=2",
      text: "There was a brave knight named Sir Galahad...",
    },
    {
      type: "content",
      image: "https://picsum.photos/300/400?random=3",
      text: "He embarked on a perilous quest to save the kingdom...",
    },
    {
      type: "content",
      image: "https://picsum.photos/300/400?random=4",
      text: "Facing dragons, witches, and treacherous terrains...",
    },
    {
      type: "content",
      image: "https://picsum.photos/300/400?random=5",
      text: "Sir Galahad's courage never wavered...",
    },
    { type: "backcover", text: "The End", author: "Written by AI Assistant" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setDirection("next");
      setCurrentPage(currentPage + 1);
      setShowInstructions(false);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection("prev");
      setCurrentPage(currentPage - 1);
      setShowInstructions(false);
    }
  };

  const handleBookClick = (e) => {
    const bookWidth = bookRef.current.offsetWidth;
    const clickX = e.nativeEvent.offsetX;

    if (clickX > bookWidth / 2) {
      nextPage();
    } else {
      prevPage();
    }
  };

  return (
    <div className="interactive-book-container">
      <div className="interactive-book" ref={bookRef} onClick={handleBookClick}>
        {pages.map((page, index) => (
          <div
            key={index}
            className={`book-page ${page.type} ${
              index === currentPage ? "active" : ""
            } ${
              direction === "next" && index === currentPage - 1
                ? "slide-out-left"
                : direction === "prev" && index === currentPage + 1
                ? "slide-out-right"
                : ""
            }`}
            style={{
              zIndex: pages.length - Math.abs(index - currentPage),
              transform: `translateZ(${-Math.abs(index - currentPage) * 5}px)`,
            }}
          >
            {page.type === "cover" && (
              <div className="cover-content">
                <h1>{page.title}</h1>
                <h2>{page.subtitle}</h2>
              </div>
            )}
            {page.type === "content" && (
              <div className="page-content">
                <img
                  src={page.image || "/placeholder.svg"}
                  alt={`Page ${index + 1}`}
                />
                <p>{page.text}</p>
              </div>
            )}
            {page.type === "backcover" && (
              <div className="backcover-content">
                <h2>{page.text}</h2>
                <p>{page.author}</p>
              </div>
            )}
          </div>
        ))}
        {showInstructions && (
          <div className="instructions">
            <div className="instruction left">Click here for previous page</div>
            <div className="instruction right">Click here for next page</div>
          </div>
        )}
      </div>
      <div className="book-controls">
        <button onClick={prevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <span>{`Page ${currentPage + 1} of ${pages.length}`}</span>
        <button onClick={nextPage} disabled={currentPage === pages.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Book;
