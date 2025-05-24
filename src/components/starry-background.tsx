// src/components/starry-background.tsx
"use client";

import type { Engine, ISourceOptions } from "tsparticles-engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useMemo, useState } from "react";

const StarryBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particleOptions: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent", // Body background will show through
        },
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: 120, // Number of stars
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.2, max: 0.8 }, // Random opacity for twinkling
          animation: {
            enable: true,
            speed: 0.8,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: { min: 0.5, max: 1.8 }, // Star sizes
        },
        move: {
          enable: true,
          speed: 0.2, // Slow drift
          direction: "none",
          random: true,
          straight: false,
          outModes: { // Changed from out_mode for v2/v3 tsparticles
            default: "out",
          },
          bounce: false,
        },
        links: {
            enable: false, // No lines connecting stars
        }
      },
      interactivity: {
        detectsOn: "canvas", // Changed from detect_on
        events: {
          onHover: { // Changed from onhover
            enable: false,
          },
          onClick: { // Changed from onclick
            enable: false,
          },
          resize: { enable: true }, // Added enable for resize options object
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={particleOptions}
        className="starry-sky-base" // This class handles positioning & z-index
        aria-hidden="true"
      />
    );
  }

  return null;
};

export default StarryBackground;
