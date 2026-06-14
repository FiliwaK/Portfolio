/* ════════════════════════════════════════════════════════════════════
   DONNÉES RÉELLES — GitHub FiliwaK
   ════════════════════════════════════════════════════════════════════ */

export const PROJECTS = [
  {
    id: 1,
    name: "DÉTECTION DE MOUVEMENT",
    planet: "MORPHEUS",
    color: "#3b82f6",
    tech: "Python · MediaPipe · RealSense D455 · C# WPF",
    description:
      "Capture temps réel du corps humain en 3D via la caméra de profondeur Intel RealSense D455 et MediaPipe.\nTracking millimétrique des articulations — position, vitesse, orientation.",
    url: "https://github.com/FiliwaK/PROJET_INTEGRATION_CAMERA_REALSENSE_D455",
  },
  {
    id: 2,
    name: "DESSIN GESTUEL",
    planet: "KREYON",
    color: "#22c55e",
    tech: "Python · OpenCV · C# · TCP Socket",
    description:
      "Interface de dessin sans contact pilotée par les gestes de la main.\nFlux vidéo transmis en temps réel via socket TCP entre Python et C#.",
    url: "https://github.com/FiliwaK/PROJET_INTEGRATION_CAMERA_REALSENSE_D455",
  },
  {
    id: 3,
    name: "CONTRÔLE POWERPOINT",
    planet: "SLIDE-X",
    color: "#a855f7",
    tech: "C# · MediaPipe · COM PowerPoint · WPF",
    description:
      "Présentations pilotées par reconnaissance gestuelle — aucun périphérique physique requis.\nReconnaissance des gestes via MediaPipe, contrôle de l'API COM PowerPoint en C#.",
    url: "https://github.com/FiliwaK/PROJET_INTEGRATION_CAMERA_REALSENSE_D455",
  },
  {
    id: 4,
    name: "ARBITRE PICKLEBALL 2D",
    planet: "PICKLE",
    color: "#f97316",
    tech: "C# · YOLO · OpenVINO · WinForms",
    description:
      "Arbitrage IA du pickleball : détection et suivi de la balle et des joueurs en temps réel.\nModèle YOLO optimisé via OpenVINO pour inférence accélérée sur CPU Intel.",
    url: "https://github.com/FiliwaK/PROJET_INTEGRATION_CAMERA_REALSENSE_D455",
  },
  {
    id: 5,
    name: "ARBITRE 3D DOUBLE CAM",
    planet: "TRIDIM",
    color: "#ef4444",
    tech: "Python · C# · ONNX · HelixToolkit · Triangulation",
    description:
      "Reconstruction spatiale 3D de la trajectoire de balle par double caméra et triangulation.\nModèle ONNX pour détection + HelixToolkit pour visualisation 3D temps réel en C#.",
    url: "https://github.com/FiliwaK/PROJET_INTEGRATION_CAMERA_REALSENSE_D455",
  },
]

/* ── Navigation bar ──────────────────────────────────────────────── */
export const NAV_ITEMS = ["UNIVERS", "PROJETS", "CONTACT"]

/* ════════════════════════════════════════════════════════════════════
   ROTATION DU SPARTAN selon la section active
   La caméra suit toujours le buste — c'est le perso qui tourne.
   ry > 0 → regarde à droite | ry < 0 → regarde à gauche
   ════════════════════════════════════════════════════════════════════ */
export const CHAR_WAYPOINTS = [
  { sc: 0.00, ry:  0.00 },  // hero   — face caméra
  { sc: 0.25, ry:  0.22 },  // about  — légère droite
  { sc: 0.44, ry:  0.68 },  // p0     — regarde droite → panel droite
  { sc: 0.60, ry: -0.62 },  // p1     — regarde gauche → panel gauche
  { sc: 0.75, ry:  0.78 },  // p2     — regarde droite
  { sc: 0.87, ry: -0.60 },  // p3     — regarde gauche
  { sc: 0.97, ry:  0.28 },  // p4     — légère droite
]

export function getCharRot(sc) {
  const W = CHAR_WAYPOINTS
  for (let i = 1; i < W.length; i++) {
    const a = W[i - 1], b = W[i]
    if (sc <= b.sc) {
      const t  = (sc - a.sc) / (b.sc - a.sc)
      const st = t * t * (3 - 2 * t)   // smoothstep
      return a.ry + (b.ry - a.ry) * st
    }
  }
  return W[W.length - 1].ry
}
