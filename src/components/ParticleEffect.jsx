import { useEffect, useRef } from "react";

const ParticleEffect = ({ canvasRef, mousePosition }) => {
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.baseSpeedX = Math.random() * 2 - 1;
        this.baseSpeedY = Math.random() * 2 - 1;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
      }

      update() {
        // Smooth cursor attraction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        const attraction = Math.max(0, 1 - distance / maxDistance);

        this.speedX = this.baseSpeedX + dx * 0.05 * attraction;
        this.speedY = this.baseSpeedY + dy * 0.05 * attraction;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;

        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
      }

      draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 100; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position update
      mouseRef.current.x += (mousePosition.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mousePosition.y - mouseRef.current.y) * 0.1;

      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [canvasRef, mousePosition]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

export default ParticleEffect;
