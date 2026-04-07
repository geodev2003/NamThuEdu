import { useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export function ParticlesBackgroundWhite() {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: false,
          },
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.6,
            },
          },
        },
      },
      particles: {
        color: {
          value: "#EA580C", // Darker orange (orange-600)
        },
        links: {
          color: "#EA580C",
          distance: 150,
          enable: true,
          opacity: 0.4, // More visible on white
          width: 1.5,
        },
        move: {
          direction: "none" as const,
          enable: true,
          outModes: {
            default: "bounce" as const,
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 60, // Fewer particles for cleaner look
        },
        opacity: {
          value: 0.6, // More visible
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 2, max: 4 }, // Slightly larger
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Particles
        id="tsparticles-white"
        options={options}
        className="!bg-transparent"
        style={{ background: 'transparent !important' }}
      />
    </div>
  );
}
