import { Composition } from "remotion";
import { DiaryLoader } from "./compositions/DiaryLoader";
import { CinematicReveal } from "./compositions/CinematicReveal";
import { BlackGumProduct } from "./compositions/BlackGumProduct";
import { TransatlanticFlight } from "./compositions/TransatlanticFlight";

/**
 * Root – registra todas las composiciones (vídeos) del proyecto.
 * Cada <Composition> aparece como una opción en Remotion Studio.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ─── Diary Loader ──────────────────────────────────── */}
      <Composition
        id="DiaryLoader"
        component={DiaryLoader}
        durationInFrames={150}      /* 5 s @ 30 fps */
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          logoSrc: "/public/logo-white.png",
        }}
      />

      {/* ─── Cinematic Reveal ──────────────────────────────── */}
      <Composition
        id="CinematicReveal"
        component={CinematicReveal}
        durationInFrames={180}      /* 6 s @ 30 fps */
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ─── Black Gum: el caso contado por el producto ────── */}
      <Composition
        id="BlackGumProduct"
        component={BlackGumProduct}
        durationInFrames={270}      /* 9 s @ 30 fps */
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TransatlanticFlight"
        component={TransatlanticFlight}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
