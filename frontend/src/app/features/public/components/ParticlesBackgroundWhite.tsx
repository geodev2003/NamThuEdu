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
          value: "#FDBA74", // Orange-300 - light orange
        },
        links: {
          color: "#FDBA74",
          distance: 150,
          enable: true,
          opacity: 0.3, // Subtle opacity
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
          value: 0.5, // Subtle visibility
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
    <div className="absolute inset-0 pointer-events-none bg-white">
      <Particles
        id="tsparticles-white"
        options={options}
      />
    </div>
  );
}
