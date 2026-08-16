/* ─── Face normals — same as reference HTML ──────────────────────────────── */
export const PHI = (1 + Math.sqrt(5)) / 2;
export const FACE_NORMALS_RAW: [number,number,number][] = [
  // Group B: (±1, 0, ±φ) — face centres, replaces wrong vertex coords (±1,±1,±1)
  [ 1, 0,  PHI], [-1, 0,  PHI], [ 1, 0, -PHI], [-1, 0, -PHI],
  // Group C: (±φ, ±1, 0) — face centres, replaces wrong vertex coords (±1,±1,±1)
  [ PHI, 1, 0], [-PHI, 1, 0], [ PHI, -1, 0], [-PHI, -1, 0],
  // Group A: (0, ±φ, ±1) — already correct, untouched
  [ 0, PHI, 1], [ 0,-PHI, 1], [ 0, PHI,-1], [ 0,-PHI,-1],
];

export function normalize3(v: [number,number,number]): [number,number,number] {
  const l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  return [v[0]/l, v[1]/l, v[2]/l];
}

export const FACE_NORMALS_NORMALIZED = FACE_NORMALS_RAW.map(normalize3);

export function rotForFace(i: number): { rx: number; ry: number } {
  const [nx, ny, nz] = FACE_NORMALS_NORMALIZED[i];
  const ry = Math.atan2(-nx, nz);
  const rx = Math.atan2(ny, Math.sqrt(nx * nx + nz * nz));
  return { rx, ry };
}
