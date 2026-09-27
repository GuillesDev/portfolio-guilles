/**
 * Procedural robot mascot rig shared by the /desarrollo editor bot, the
 * despiece of /desarrollo and the global RobotGuide. Built entirely from
 * primitives — no assets.
 * Black Gum palette: bone body, dark face screen, amber eyes, ember antenna.
 *
 * Brazos: cada uno cuelga de un hombro (articulación oscura metida en el
 * costado del cuerpo) y acaba en una mano. Convención de giro: rotation.z
 * positiva en el derecho y negativa en el izquierdo los abre hacia FUERA;
 * rotation.x negativa los lleva hacia DELANTE. No girarlos hacia dentro para
 * saludar o sujetar algo: cruzan la cabeza y el cuerpo, y parece que el brazo
 * pasa por detrás.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RobotRig {
  robot: any;
  headGroup: any;
  eyeL: any;
  eyeR: any;
  eyesMat: any;
  chestMat: any;
  armLPivot: any;
  armRPivot: any;
  antennaTip: any;
  /** Halos de luz de ojos, pecho y antena (su opacidad se puede animar). */
  glows: { eyeL: any; eyeR: any; chest: any; antenna: any };
  /** Mueve los ojos dentro de la pantalla, de -1 a 1 en cada eje. */
  look: (x: number, y: number) => void;
  /** Cada pieza suelta, para el despiece de /desarrollo. */
  parts: {
    body: any;
    neck: any;
    chest: any;
    head: any;
    screen: any;
    earL: any;
    earR: any;
    antenna: any;
    armL: any;
    armR: any;
    shoulderL: any;
    shoulderR: any;
    handL: any;
    handR: any;
  };
  dispose: () => void;
}

// Halo radial suave para las luces. Una sola textura compartida, dibujada en
// un canvas.
let glowTexture: any = null;
function getGlowTexture(THREE: any) {
  if (glowTexture) return glowTexture;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const g = canvas.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.32)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

export function buildRobotRig(THREE: any, RoundedBoxGeometry: any): RobotRig {
  // Plástico de juguete con algo de laca: el brillo del barniz es lo que hace
  // que se lea como un objeto de verdad y no como un dibujo plano.
  const bone = new THREE.MeshPhysicalMaterial({
    color: 0xe8e2d6, roughness: 0.5, metalness: 0.05, clearcoat: 0.55, clearcoatRoughness: 0.35,
  });
  const dark = new THREE.MeshPhysicalMaterial({
    color: 0x141416, roughness: 0.4, metalness: 0.35, clearcoat: 0.3, clearcoatRoughness: 0.5,
  });
  // La pantalla de la cara es cristal: casi negra y muy brillante.
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0c0c0e, roughness: 0.12, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08,
  });
  const amber = new THREE.MeshBasicMaterial({ color: 0xf1a93a });
  const ember = new THREE.MeshBasicMaterial({ color: 0xc7422e });
  const eyesMat = new THREE.MeshBasicMaterial({ color: 0xf1a93a });

  const geometries: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(g: T): T => { geometries.push(g); return g; };

  const robot = new THREE.Group();

  // Body
  const body = new THREE.Mesh(track(new RoundedBoxGeometry(0.62, 0.55, 0.4, 4, 0.12)), bone);
  body.position.y = 0;
  robot.add(body);

  // Cuello: une cabeza y cuerpo, que antes flotaban por separado.
  const neck = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.12, 0.18, 24)), dark);
  neck.position.y = 0.34;
  robot.add(neck);

  // Chest light
  const chest = new THREE.Mesh(track(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 20)), amber);
  chest.rotation.x = Math.PI / 2;
  chest.position.set(0, 0.05, 0.21);
  robot.add(chest);

  // Head group (gaze tracking)
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.7;
  robot.add(headGroup);

  const head = new THREE.Mesh(track(new RoundedBoxGeometry(0.78, 0.6, 0.55, 4, 0.14)), bone);
  headGroup.add(head);

  // Face screen
  const screen = new THREE.Mesh(track(new RoundedBoxGeometry(0.56, 0.34, 0.08, 4, 0.04)), glass);
  screen.position.set(0, 0.01, 0.26);
  headGroup.add(screen);

  // Eyes (blink/squint via scale.y, flash via eyesMat color)
  const EYE_X = 0.13;
  const EYE_Y = 0.02;
  const eyeGeo = track(new THREE.SphereGeometry(0.055, 16, 16));
  const eyeL = new THREE.Mesh(eyeGeo, eyesMat);
  eyeL.position.set(-EYE_X, EYE_Y, 0.31);
  const eyeR = new THREE.Mesh(eyeGeo, eyesMat);
  eyeR.position.set(EYE_X, EYE_Y, 0.31);
  headGroup.add(eyeL, eyeR);

  // Halos: comparten el objeto de color de su material, así que cambian con
  // él (ojos del color de cada página, rojos si le pegas...).
  const glowMats: { dispose(): void }[] = [];
  function makeGlow(color: any, size: number, opacity: number) {
    const mat = new THREE.SpriteMaterial({
      map: getGlowTexture(THREE),
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    mat.color = color;
    glowMats.push(mat);
    const sprite = new THREE.Sprite(mat);
    sprite.scale.setScalar(size);
    return sprite;
  }
  const glowEyeL = makeGlow(eyesMat.color, 0.24, 0.5);
  const glowEyeR = makeGlow(eyesMat.color, 0.24, 0.5);
  eyeL.add(glowEyeL);
  eyeR.add(glowEyeR);

  // Ears
  const earGeo = track(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 16));
  const earL = new THREE.Mesh(earGeo, dark);
  earL.rotation.z = Math.PI / 2;
  earL.position.set(-0.42, 0, 0);
  const earR = earL.clone();
  earR.position.x = 0.42;
  headGroup.add(earL, earR);

  // Antenna
  const antenna = new THREE.Mesh(track(new THREE.CylinderGeometry(0.016, 0.016, 0.26, 8)), dark);
  antenna.position.y = 0.42;
  headGroup.add(antenna);
  const antennaTip = new THREE.Mesh(track(new THREE.SphereGeometry(0.05, 16, 16)), ember);
  antennaTip.position.y = 0.57;
  headGroup.add(antennaTip);
  const glowAntenna = makeGlow(ember.color, 0.2, 0.45);
  antennaTip.add(glowAntenna);

  const glowChest = makeGlow(amber.color, 0.28, 0.45);
  chest.add(glowChest);

  // Brazos: hombro, brazo, puño y mano. Los hombros van metidos en el
  // costado para que el brazo nazca del cuerpo en vez de flotar a su lado.
  const shoulderGeo = track(new THREE.SphereGeometry(0.078, 20, 16));
  const armGeo = track(new THREE.CapsuleGeometry(0.074, 0.14, 4, 14));
  const cuffGeo = track(new THREE.CylinderGeometry(0.079, 0.079, 0.03, 18));
  const handGeo = track(new THREE.SphereGeometry(0.076, 20, 16));

  function buildArm(side: 1 | -1) {
    const pivot = new THREE.Group();
    pivot.position.set(0.355 * side, 0.13, 0);
    robot.add(pivot);
    const shoulder = new THREE.Mesh(shoulderGeo, dark);
    pivot.add(shoulder);
    const arm = new THREE.Mesh(armGeo, bone);
    arm.position.y = -0.15;
    pivot.add(arm);
    const cuff = new THREE.Mesh(cuffGeo, dark);
    cuff.position.y = -0.255;
    pivot.add(cuff);
    const hand = new THREE.Mesh(handGeo, bone);
    hand.position.y = -0.315;
    hand.scale.set(1, 0.9, 1);
    pivot.add(hand);
    return { pivot, shoulder, arm, hand };
  }

  const left = buildArm(-1);
  const right = buildArm(1);
  const armLPivot = left.pivot;
  const armRPivot = right.pivot;
  // Reposo: un pelín abiertos, no pegados al cuerpo.
  armLPivot.rotation.z = -0.1;
  armRPivot.rotation.z = 0.1;

  function look(x: number, y: number) {
    const dx = Math.max(-1, Math.min(1, x)) * 0.028;
    const dy = Math.max(-1, Math.min(1, y)) * 0.022;
    eyeL.position.x = -EYE_X + dx;
    eyeR.position.x = EYE_X + dx;
    eyeL.position.y = eyeR.position.y = EYE_Y + dy;
  }

  function dispose() {
    geometries.forEach((g) => g.dispose());
    glowMats.forEach((m) => m.dispose());
    bone.dispose();
    dark.dispose();
    glass.dispose();
    amber.dispose();
    ember.dispose();
    eyesMat.dispose();
  }

  return {
    robot, headGroup, eyeL, eyeR, eyesMat, chestMat: amber, armLPivot, armRPivot, antennaTip,
    glows: { eyeL: glowEyeL, eyeR: glowEyeR, chest: glowChest, antenna: glowAntenna },
    look,
    parts: {
      body, neck, chest, head, screen, earL, earR, antenna,
      armL: left.arm, armR: right.arm,
      shoulderL: left.shoulder, shoulderR: right.shoulder,
      handL: left.hand, handR: right.hand,
    },
    dispose,
  };
}
