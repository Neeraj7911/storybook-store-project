import { useEffect, useRef } from "react";

const BackgroundEffect = ({ mousePosition, scrollPosition }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");

      // Fill background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
        if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;
      }

      // Draw mouse effect
      ctx.beginPath();
      ctx.arc(mousePosition.x, mousePosition.y, 50, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 107, 107, 0.1)";
      ctx.fill();

      // Draw scroll effect
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollPosition / scrollHeight;

      ctx.beginPath();
      ctx.moveTo(0, canvas.height * scrollProgress);
      ctx.lineTo(canvas.width, canvas.height * scrollProgress);
      ctx.strokeStyle = "rgba(255, 107, 107, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mousePosition, scrollPosition]);

  return <canvas ref={canvasRef} className="background-effect" />;
};

export default BackgroundEffect;
