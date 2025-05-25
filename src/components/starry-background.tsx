
"use client";
import type { FC, CSSProperties } from 'react';
import { useEffect, useState, useCallback } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const StarryBackground: FC = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // console.log(container);
  };

  const options: ISourceOptions = {
    background: {
      color: {
        value: "transparent", // Make background transparent so body gradient shows
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        onClick: {
          enable: false, // Keep false to avoid too much distraction
          mode: "push",
        },
      },
      modes: {
        grab: {
          distance: 100,
          links: {
            opacity: 0.3,
          },
        },
        push: {
          quantity: 2,
        },
      },
    },
    particles: {
      color: {
        value: ["#FFFFFF", "#FFD700", "#ADD8E6"], // White, Gold, Light Blue stars
      },
      links: {
        color: "#ffffff",
        distance: 120,
        enable: false, // No links for a starry sky
        opacity: 0.1,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.1, // Very slow drift
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 120, // Number of stars
      },
      opacity: {
        value: { min: 0.1, max: 0.8 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.05,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 0.5, max: 2.5 }, // Smaller stars
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.3,
          sync: false,
        },
      },
    },
    detectRetina: true,
  };
  
  const particlesContainerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: 0, // Ensure it's behind content but above body background
    pointerEvents: 'none',
  };


  if (init) {
    return (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
          style={particlesContainerStyle}
          className="starry-sky-base"
        />
    );
  }

  return <div style={particlesContainerStyle} className="starry-sky-base"></div>; // Fallback while not initialized
};

export default StarryBackground;
