"use client";

import { useEffect, useRef, useState } from "react";
import Book from "./Book";
import "./ExplorePage.css";

const ExplorePage = () => {
  const canvasRef = useRef(null);
  const [clickPosition, setClickPosition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 360}, 50%, 50%)`,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        if (clickPosition) {
          const dx = clickPosition.x - particle.x;
          const dy = clickPosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            particle.x += dx * 0.2;
            particle.y += dy * 0.2;
          }
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [clickPosition]);

  const handleCanvasClick = (event) => {
    setClickPosition({ x: event.clientX, y: event.clientY });
  };

  const handleCreateStory = () => {
    console.log("Create Your Own Story button clicked!");
  };

  return (
    <div className="explore-page" onClick={handleCanvasClick}>
      <canvas ref={canvasRef} className="background-canvas" />
      <header className="explore-header">
        <h1>Interactive Storybook Experience</h1>
      </header>
      <div className="book-container">
        <Book currentPage={currentPage} />
      </div>
      <button className="ctaa-button" onClick={handleCreateStory}>
        Create Your Own Story
      </button>
      <div className="floating-elements">
        <div className="floating-element" style={{ top: "10%", left: "5%" }}>
          📚
        </div>
        <div className="floating-element" style={{ top: "15%", right: "10%" }}>
          🖋️
        </div>
        <div
          className="floating-element"
          style={{ bottom: "20%", left: "15%" }}
        >
          🌟
        </div>
        <div
          className="floating-element"
          style={{ bottom: "10%", right: "5%" }}
        >
          🔮
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
