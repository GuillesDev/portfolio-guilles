/**
 * Procedural robot mascot rig shared by the /desarrollo editor bot
 * and the global RobotGuide. Built entirely from primitives — no assets.
 * Black Gum palette: bone body, dark face screen, amber eyes, ember antenna.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RobotRig {
  robot: any;
  headGroup: any;
  eyeL: any;
  eyeR: any;
  eyesMat: any;
  armRPivot: any;
  antennaTip: any;
  dispose: () => void;
}

export function buildRobotRig(THREE: any, RoundedBoxGeometry: any): RobotRig {
  const bone = new THREE.MeshStandardMaterial({ color: 0xe8e2d6, roughness: 0.55, metalness: 0.1 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.35, metalness: 0.3 });
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

  // Chest light
  const chest = new THREE.Mesh(track(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 20)), amber);
  chest.rotation.x = Math.PI / 2;
  chest.position.set(0, 0.05, 0.21);
  robot.add(chest);

  // Head group (gaze tracking)
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.74;
  robot.add(headGroup);

  const head = new THREE.Mesh(track(new RoundedBoxGeometry(0.78, 0.6, 0.55, 4, 0.14)), bone);
  headGroup.add(head);

  // Face screen
  const screen = new THREE.Mesh(track(new RoundedBoxGeometry(0.56, 0.34, 0.08, 4, 0.04)), dark);
  screen.position.set(0, 0.01, 0.26);
  headGroup.add(screen);

  // Eyes (blink/squint via scale.y, flash via eyesMat color)
  const eyeGeo = track(new THREE.SphereGeometry(0.055, 16, 16));
  const eyeL = new THREE.Mesh(eyeGeo, eyesMat);
  eyeL.position.set(-0.13, 0.02, 0.31);
  const eyeR = new THREE.Mesh(eyeGeo, eyesMat);
  eyeR.position.set(0.13, 0.02, 0.31);
  headGroup.add(eyeL, eyeR);

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

  // Arms — right one in a pivot for waving/flailing
  const armGeo = track(new THREE.CapsuleGeometry(0.07, 0.26, 4, 12));
  const armL = new THREE.Mesh(armGeo, bone);
  armL.position.set(-0.42, 0, 0);
  armL.rotation.z = 0.25;
  robot.add(armL);

  const armRPivot = new THREE.Group();
  armRPivot.position.set(0.4, 0.16, 0);
  robot.add(armRPivot);
  const armR = new THREE.Mesh(armGeo, bone);
  armR.position.y = -0.16;
  armRPivot.add(armR);

  function dispose() {
    geometries.forEach((g) => g.dispose());
    bone.dispose();
    dark.dispose();
    amber.dispose();
    ember.dispose();
    eyesMat.dispose();
  }

  return { robot, headGroup, eyeL, eyeR, eyesMat, armRPivot, antennaTip, dispose };
}
