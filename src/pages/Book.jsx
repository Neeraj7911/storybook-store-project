"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Book.css";

const Book = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef(null);
  const pagesRef = useRef([]);

  const pages = [
    {
      content: "Once upon a time in a magical forest...",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      content: "There lived a wise old owl named Oliver...",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      content: "Oliver had many animal friends in the forest...",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      content: "One day, they decided to have a grand feast...",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      content: "And they all lived happily ever after.",
      image: "/placeholder.svg?height=400&width=300",
    },
  ];

  useEffect(() => {
    gsap.set(bookRef.current, { rotationY: -20 });
    gsap.set(pagesRef.current, {
      rotationY: (i) => i * -0.5,
      transformOrigin: "left center",
      z: (i) => i * -0.1,
    });
  }, []);

  const openBook = () => {
    setIsOpen(true);
    gsap.to(bookRef.current, {
      rotationY: 0,
      duration: 1.5,
      ease: "power3.inOut",
    });
    gsap.to(pagesRef.current, {
      rotationY: 0,
      z: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power2.inOut",
    });
  };

  const closeBook = () => {
    setIsOpen(false);
    gsap.to(bookRef.current, {
      rotationY: -20,
      duration: 1.5,
      ease: "power3.inOut",
    });
    gsap.to(pagesRef.current, {
      rotationY: (i) => i * -0.5,
      z: (i) => i * -0.1,
      stagger: 0.1,
      duration: 1,
      ease: "power2.inOut",
    });
    setCurrentPage(0);
  };

  const turnPage = (direction) => {
    if (direction === "next" && currentPage < pages.length - 1) {
      gsap.to(pagesRef.current[currentPage], {
        rotationY: -180,
        duration: 1,
        ease: "power2.inOut",
      });
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      gsap.to(pagesRef.current[currentPage - 1], {
        rotationY: 0,
        duration: 1,
        ease: "power2.inOut",
      });
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`book-wrapper ${isOpen ? "open" : ""}`}>
      <div className="book-container">
        <div className="book" ref={bookRef}>
          <div className="book-cover front" onClick={openBook}>
            <h1>The Magical Forest</h1>
            <p>An enchanting tale</p>
          </div>
          {pages.map((page, index) => (
            <div
              key={index}
              className="page"
              ref={(el) => (pagesRef.current[index] = el)}
            >
              <div className="page-front">
                <img
                  src={page.image || "/placeholder.svg"}
                  alt={`Page ${index + 1}`}
                />
                <p>{page.content}</p>
              </div>
              <div className="page-back"></div>
            </div>
          ))}
          <div className="book-cover back"></div>
        </div>
      </div>
      <div className="book-controls">
        <button
          onClick={() => turnPage("prev")}
          disabled={currentPage === 0 || !isOpen}
        >
          Previous
        </button>
        <button onClick={isOpen ? closeBook : openBook}>
          {isOpen ? "Close Book" : "Open Book"}
        </button>
        <button
          onClick={() => turnPage("next")}
          disabled={currentPage === pages.length - 1 || !isOpen}
        >
          Next
        </button>
      </div>
      {!isOpen && <div className="book-sparkle"></div>}
    </div>
  );
};

export default Book;
