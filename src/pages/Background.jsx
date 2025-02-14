"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

const Background = () => {
  const particlesRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.1;
    particlesRef.current.rotation.x = Math.sin(t / 4);
    particlesRef.current.rotation.y = Math.sin(t / 2);
  });

  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 0, 40]} />
      <Sparkles
        ref={particlesRef}
        count={2000}
        scale={6}
        size={0.5}
        speed={0.3}
        color="#FFD700"
      />
    </>
  );
};

export default Background;
