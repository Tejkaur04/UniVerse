
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
          enable: false, // Disabled to prevent "grab" lines
          mode: "grab", 
        },
        onClick: {
          enable: false, 
          mode: "push",
        },
      },
      modes: {
        grab: {
          distance: 100,
          links: {
            opacity: 0, // Ensure no links even if mode was active
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
        enable: false, // Explicitly no links between particles
        opacity: 0,
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
          area: 900, // Adjusted for a slightly sparser feel with more particles
        },
        value: 160, // Increased number of stars
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
    zIndex: 0, 
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

  return <div style={particlesContainerStyle} className="starry-sky-base"></div>;
};

export default StarryBackground;
