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
      title: "The Book of You",
      subtitle: "An Interactive Adventure",
    },
    {
      type: "content",
      image: "./pic2.jpeg",
      text: `On a bright morning, Aarav heard the doorbell ring. A small, neatly wrapped package sat at the doorstep. The tag read:

"For the hero of this story – You."

Curious, they opened the package. Inside was a beautiful book, its cover shimmering with golden letters spelling their name.`,
    },
    {
      type: "content",
      image: "./pic3.jpeg",
      text: `As soon as they turned the first page, something magical happened. The words lifted off the paper, swirling into a glowing light. Suddenly, they were no longer in their room.

They stood in a grand castle, wearing a hero’s cape. A wise owl flapped its wings and said, "You are the chosen one. The kingdom needs your help."`,
    },
    {
      type: "content",
      image: "./pic4.jpeg",
      text: `Through forests and rivers, past mountains and stars, Aarav bravely followed the map in their book. Along the way, they solved riddles, made friends with talking animals, and unlocked the doors to a hidden treasure.

But when they finally reached the treasure, it wasn’t gold or jewels. It was a mirror—one that reflected their kindness, courage, and imagination.`,
    },
    {
      type: "content",
      image: "./pic5.jpeg",
      text: `With a final turn of the page, they were back in their room, the book resting in their hands. The adventure was over—but the magic remained.

They smiled, realizing the truth: every hero has a story… and this one was theirs.`,
    },
    {
      type: "content",
      image: "./pic6.jpeg",
      text: `✨ Now it’s your turn! Imagine receiving a book where YOU are the hero, just like Aarav. Upload your photos, choose a theme, and create your own magical adventure!

📖 Your story begins today. Place your order now!`,
    },
    { type: "backcover", text: "The End", author: "Writer" },
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
