import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ─── Paleta Black Gum ──────────────────────────────────────── */
const BG = "#0b0b0b";
const SURFACE = "#141414";
const SURFACE_2 = "#1c1c1c";
const LINE = "rgba(245, 240, 232, 0.12)";
const CREAM = "#f5f0e8";
const MUTED = "#8d8781";
const EMBER = "#f1a93a";
const RED = "#c7422e";

const SANS = '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';
const MONO = '"SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

/**
 * BlackGumProduct — el caso Black Gum contado por el producto, no por el logo.
 *
 * La ventana del navegador no se va nunca: lo que cambia es lo que hay dentro.
 * Eso deja ver la relación causa-efecto entre el panel y la web pública.
 *
 * Timeline (30 fps, 270 frames = 9 s):
 *    0–30   → la ventana entra y se escribe la URL
 *   20–95   → web pública: portada y rejilla de trabajos
 *   95–110  → la URL pasa a /admin y el contenido cruza al panel
 *  110–200  → panel privado: se sube un vídeo por trozos y se publica
 *  200–215  → vuelta a la web pública
 *  205–252  → el vídeo recién subido aparece en la rejilla
 *  252–270  → cierre y fundido para que el bucle encaje
 */

/* Recorta el texto para simular tecleo. */
const typed = (text: string, from: number, to: number, frame: number) => {
  const chars = Math.round(
    interpolate(frame, [from, to], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return text.slice(0, chars);
};

/* Fundido de entrada y salida para cada bloque de contenido. */
const crossfade = (
  frame: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) =>
  interpolate(
    frame,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

/* ─── Tarjeta de vídeo de la web pública ────────────────────── */
const WorkCard: React.FC<{
  progress: number;
  tint: string;
  highlight?: boolean;
}> = ({ progress, tint, highlight = false }) => (
  <div
    style={{
      flex: 1,
      height: "100%",
      borderRadius: 14,
      border: `1px solid ${highlight ? "rgba(241,169,58,0.55)" : LINE}`,
      background: `linear-gradient(150deg, ${tint} 0%, ${SURFACE_2} 70%)`,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 26}px) scale(${
        0.96 + progress * 0.04
      })`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: highlight
        ? `0 0 0 1px rgba(241,169,58,0.25), 0 18px 50px rgba(241,169,58,0.18)`
        : "0 14px 40px rgba(0,0,0,0.45)",
    }}
  >
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle
        cx="17"
        cy="17"
        r="16"
        stroke={highlight ? EMBER : "rgba(245,240,232,0.5)"}
        strokeWidth="1.5"
      />
      <path
        d="M14 11.5 L23 17 L14 22.5 Z"
        fill={highlight ? EMBER : "rgba(245,240,232,0.75)"}
      />
    </svg>
  </div>
);

/* ─── Fila del panel privado ────────────────────────────────── */
const PanelRow: React.FC<{
  label: string;
  status: string;
  statusColor: string;
  progress: number;
  bar?: number | null;
}> = ({ label, status, statusColor, progress, bar = null }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "18px 22px",
      borderRadius: 12,
      border: `1px solid ${LINE}`,
      background: SURFACE_2,
      opacity: progress,
      transform: `translateX(${(1 - progress) * -18}px)`,
    }}
  >
    <div
      style={{
        width: 46,
        height: 32,
        borderRadius: 6,
        background: "linear-gradient(140deg, #2c2c2c, #171717)",
        border: `1px solid ${LINE}`,
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: SANS, fontSize: 19, color: CREAM }}>{label}</div>
      {bar !== null && (
        <div
          style={{
            marginTop: 10,
            height: 5,
            borderRadius: 3,
            background: "rgba(245,240,232,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${bar * 100}%`,
              height: "100%",
              borderRadius: 3,
              background: `linear-gradient(90deg, ${RED}, ${EMBER})`,
            }}
          />
        </div>
      )}
    </div>
    <span
      style={{
        fontFamily: MONO,
        fontSize: 13,
        letterSpacing: 1.4,
        textTransform: "uppercase",
        color: statusColor,
        flexShrink: 0,
      }}
    >
      {status}
    </span>
  </div>
);

export const BlackGumProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  /* ── Entrada de la ventana ─────────────────────────────── */
  const windowSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    from: 0,
    to: 1,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });

  /* ── URL: se escribe, cambia a /admin y vuelve ─────────── */
  const base = "blackgumgroup.com";
  const showAdmin = frame >= 96 && frame < 204;
  const url = showAdmin
    ? base + typed("/admin", 96, 110, frame)
    : frame < 30
      ? typed(base, 10, 30, frame)
      : base;

  /* ── Visibilidad de cada bloque ────────────────────────── */
  const publicEarly = crossfade(frame, 24, 40, 92, 104);
  const panel = crossfade(frame, 104, 118, 196, 208);
  const publicLate = crossfade(frame, 206, 218, 258, 268);

  /* ── Rejilla pública: entrada escalonada ───────────────── */
  const card = (index: number, start: number) =>
    interpolate(frame, [start + index * 7, start + 22 + index * 7], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

  /* ── Subida por trozos: la barra y el contador ─────────── */
  const upload = interpolate(frame, [132, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const done = frame >= 180;
  const chunks = 12;
  const chunk = Math.min(chunks, Math.ceil(upload * chunks));

  /* ── Filas del panel ───────────────────────────────────── */
  const row = (index: number) =>
    interpolate(frame, [118 + index * 8, 138 + index * 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

  /* ── Tarjeta nueva en la web: aparece al volver ────────── */
  const fresh = spring({
    frame: Math.max(0, frame - 224),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 110, mass: 0.7 },
  });

  /* ── Etiqueta inferior de escena ───────────────────────── */
  const caption = showAdmin
    ? "panel privado"
    : frame >= 204
      ? "publicado en la web"
      : "web pública";
  const captionOpacity = interpolate(
    frame,
    [34, 46, 250, 262],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /* ── Fundido final para que el bucle cierre limpio ─────── */
  const fadeOut = interpolate(frame, [258, 270], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Halo cálido de fondo, muy tenue */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 42%, rgba(199,66,46,0.16) 0%, transparent 65%)`,
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: windowSpring * fadeOut,
          transform: `scale(${0.94 + windowSpring * 0.06})`,
        }}
      >
        {/* ── Ventana ──────────────────────────────────────── */}
        <div
          style={{
            width: width * 0.78,
            height: height * 0.58,
            borderRadius: 18,
            border: `1px solid ${LINE}`,
            background: SURFACE,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 50px 120px rgba(0,0,0,0.6)",
          }}
        >
          {/* Barra superior */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 22px",
              height: 56,
              borderBottom: `1px solid ${LINE}`,
              background: "rgba(0,0,0,0.35)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              {["#3d3d3d", "#3d3d3d", "#3d3d3d"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                height: 30,
                borderRadius: 15,
                background: "rgba(245,240,232,0.05)",
                border: `1px solid ${LINE}`,
                display: "flex",
                alignItems: "center",
                paddingInline: 16,
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: showAdmin ? EMBER : "#4c8a5a",
                }}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  color: MUTED,
                  letterSpacing: 0.4,
                }}
              >
                {url}
              </span>
            </div>
          </div>

          {/* Lienzo */}
          <div style={{ position: "relative", flex: 1 }}>
            {/* ── Web pública (primera pasada) ───────────── */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: publicEarly,
                padding: "44px 48px",
                display: "flex",
                flexDirection: "column",
                gap: 34,
              }}
            >
              <Img
                src={staticFile("logo-white.png")}
                style={{ width: 190, height: "auto", opacity: 0.92 }}
              />
              <div style={{ display: "flex", gap: 22, flex: 1, minHeight: 0 }}>
                <WorkCard progress={card(0, 40)} tint="#33241d" />
                <WorkCard progress={card(1, 40)} tint="#2b2b2f" />
                <WorkCard progress={card(2, 40)} tint="#332022" />
              </div>
            </div>

            {/* ── Panel privado ──────────────────────────── */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: panel,
                display: "flex",
              }}
            >
              {/* Barra lateral */}
              <div
                style={{
                  width: 186,
                  borderRight: `1px solid ${LINE}`,
                  padding: "34px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  flexShrink: 0,
                }}
              >
                {["Contenido", "Vídeos", "Pagos"].map((item, i) => (
                  <div
                    key={item}
                    style={{
                      fontFamily: SANS,
                      fontSize: 16,
                      padding: "10px 14px",
                      borderRadius: 8,
                      color: i === 1 ? CREAM : MUTED,
                      background: i === 1 ? "rgba(241,169,58,0.12)" : "transparent",
                      borderLeft:
                        i === 1 ? `2px solid ${EMBER}` : "2px solid transparent",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Contenido del panel */}
              <div
                style={{
                  flex: 1,
                  padding: "34px 40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 16,
                }}
              >
                <PanelRow
                  label={done ? "Vídeo nuevo" : `Subiendo vídeo… trozo ${chunk}/${chunks}`}
                  status={done ? "Publicado" : `${Math.round(upload * 100)}%`}
                  statusColor={done ? EMBER : MUTED}
                  progress={row(0)}
                  bar={done ? null : upload}
                />
                <PanelRow
                  label="Portada"
                  status="Publicado"
                  statusColor={MUTED}
                  progress={row(1)}
                />
                <PanelRow
                  label="Stripe · pago recibido"
                  status="OK"
                  statusColor={MUTED}
                  progress={row(2)}
                />
              </div>
            </div>

            {/* ── Web pública con el vídeo ya publicado ──── */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: publicLate,
                padding: "44px 48px",
                display: "flex",
                flexDirection: "column",
                gap: 34,
              }}
            >
              <Img
                src={staticFile("logo-white.png")}
                style={{ width: 190, height: "auto", opacity: 0.92 }}
              />
              <div style={{ display: "flex", gap: 22, flex: 1, minHeight: 0 }}>
                <WorkCard progress={fresh} tint="#3a2a1a" highlight />
                <WorkCard progress={1} tint="#33241d" />
                <WorkCard progress={1} tint="#2b2b2f" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Etiqueta de escena ───────────────────────────── */}
        <div
          style={{
            marginTop: 30,
            fontFamily: MONO,
            fontSize: 17,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: EMBER,
            opacity: captionOpacity * 0.85,
          }}
        >
          {caption}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
