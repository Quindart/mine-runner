type Measurement = {
  lat: number;
  lon: number;
  speed?: number;
  heading?: number;
  timestamp: number;
};

type Matrix = number[][];
type Vector = number[];

const METERS_PER_DEG_LAT = 111_320;
const EPSILON = 1e-12;
const EPSILON_SPEED = 1e-6;
const EPSILON_FACTOR = 1e-15;

export class KalmanFilterGPS {
  private x: Vector;
  private P: Matrix;
  private Q: Matrix;
  private R_pos: Matrix;
  private R_posvel: Matrix;
  private lastTimestamp: number | null = null;

  private originLat: number | null = null;
  private originLon: number | null = null;
  private metersPerDegLonAtOrigin = 0;

  constructor(opts?: {
    posVariance?: number;
    velVariance?: number;
    processPosNoise?: number;
    processVelNoise?: number;
  }) {
    this.x = [0, 0, 0, 0];

    const posVar = opts?.posVariance ?? 25;
    const velVar = opts?.velVariance ?? 4;
    const procPos = opts?.processPosNoise ?? 1.0;
    const procVel = opts?.processVelNoise ?? 1.0;

    this.P = this.createDiagonalMatrix([posVar, posVar, velVar, velVar]);
    this.Q = this.createDiagonalMatrix([procPos, procPos, procVel, procVel]);
    this.R_pos = this.createDiagonalMatrix([posVar, posVar]);
    this.R_posvel = this.createDiagonalMatrix([posVar, posVar, velVar, velVar]);
  }

  public process(meas: Measurement) {
    if (this.originLat === null) {
      this.initializeOrigin(meas);
      return;
    }

    const dt = this.lastTimestamp ? (meas.timestamp - this.lastTimestamp) / 1000 : 0;
    this.lastTimestamp = meas.timestamp;

    this.predict(dt);

    const [mx, my] = this.latLonToMeters(meas.lat, meas.lon);
    if (typeof meas.speed === "number" && typeof meas.heading === "number") {
      const [vx, vy] = this.speedHeadingToVxy(meas.speed, meas.heading);
      this.updatePosVel([mx, my, vx, vy]);
    } else {
      this.updatePos([mx, my]);
    }
  }

  public getState(): { lat: number; lon: number; speed: number; heading: number } {
    const [x, y, vx, vy] = this.x;
    const [lat, lon] = this.metersToLatLon(x, y);
    const speed = Math.hypot(vx, vy);
    const heading = this.computeHeading(vx, vy, speed);
    return { lat, lon, speed, heading };
  }

  private initializeOrigin(meas: Measurement) {
    this.originLat = meas.lat;
    this.originLon = meas.lon;
    this.metersPerDegLonAtOrigin = this.metersPerDegreeLon(this.originLat);
    const [mx, my] = this.latLonToMeters(meas.lat, meas.lon);
    this.x = [mx, my, 0, 0];
    this.lastTimestamp = meas.timestamp;
  }

  private createDiagonalMatrix(diag: Vector): Matrix {
    const n = diag.length;
    return Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? diag[i] : 0))
    );
  }

  private computeHeading(vx: number, vy: number, speed: number): number {
    if (speed <= EPSILON_SPEED) return 0;
    let heading = (Math.atan2(vx, vy) * 180) / Math.PI;
    return heading < 0 ? heading + 360 : heading;
  }

  private predict(dt: number) {
    if (dt <= 0) return;

    const F = [
      [1, 0, dt, 0],
      [0, 1, 0, dt],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    this.x = matVecMul(F, this.x);
    const Ft = transpose(F);
    const FPFt = matMul(matMul(F, this.P), Ft);
    const Qdt = scalarMatMul(dt, this.Q);
    this.P = matAdd(FPFt, Qdt);
  }
  private updatePos(z: [number, number]) {
    const H = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ];
    const Ht = transpose(H);
    const Hx = matVecMul(H, this.x);
    const y = [z[0] - Hx[0], z[1] - Hx[1]];

    const HP = matMul(H, this.P);
    const HPHt = matMul(HP, Ht);
    const S = matAdd(HPHt, this.R_pos);
    const S_inv = inv2x2(S);
    const K = matMul(matMul(this.P, Ht), S_inv);

    this.x = vecAdd(this.x, matVecMul(K, y));
    const I = identity(4);
    this.P = matMul(matSub(I, matMul(K, H)), this.P);
  }
  private updatePosVel(z: [number, number, number, number]) {
    const y = z.map((val, i) => val - this.x[i]);
    const S = matAdd(this.P, this.R_posvel);
    const S_inv = inv4x4(S);
    const K = matMul(this.P, S_inv);

    this.x = vecAdd(this.x, matVecMul(K, y));
    const I = identity(4);
    this.P = matMul(matSub(I, K), this.P);
  }

  private latLonToMeters(lat: number, lon: number): [number, number] {
    this.ensureOriginSet();
    const dxDeg = lon - this.originLon!;
    const dyDeg = lat - this.originLat!;
    return [dxDeg * this.metersPerDegLonAtOrigin, dyDeg * METERS_PER_DEG_LAT];
  }

  private metersToLatLon(x: number, y: number): [number, number] {
    this.ensureOriginSet();
    const lon = this.originLon! + x / this.metersPerDegLonAtOrigin;
    const lat = this.originLat! + y / METERS_PER_DEG_LAT;
    return [lat, lon];
  }

  private metersPerDegreeLon(latDeg: number): number {
    return Math.cos((latDeg * Math.PI) / 180) * METERS_PER_DEG_LAT;
  }

  private speedHeadingToVxy(speed: number, headingDeg: number): [number, number] {
    const theta = (headingDeg * Math.PI) / 180;
    return [speed * Math.sin(theta), speed * Math.cos(theta)];
  }

  private ensureOriginSet(): void {
    if (this.originLat === null || this.originLon === null) {
      throw new Error("Origin not set");
    }
  }
}

function matMul(A: Matrix, B: Matrix): Matrix {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C: Matrix = Array.from({ length: m }, () => Array(p).fill(0));
  for (let i = 0; i < m; i++) {
    for (let k = 0; k < n; k++) {
      const aik = A[i][k];
      for (let j = 0; j < p; j++) {
        C[i][j] += aik * B[k][j];
      }
    }
  }
  return C;
}

function matVecMul(A: Matrix, v: Vector): Vector {
  const m = A.length;
  const n = A[0].length;
  const out = Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) sum += A[i][j] * v[j];
    out[i] = sum;
  }
  return out;
}

function transpose(A: Matrix): Matrix {
  const m = A.length;
  const n = A[0].length;
  const B: Matrix = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      B[j][i] = A[i][j];
    }
  }
  return B;
}

function identity(n: number): Matrix {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

function scalarMatMul(s: number, A: Matrix): Matrix {
  return A.map((row) => row.map((v) => v * s));
}

function matAdd(A: Matrix, B: Matrix): Matrix {
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

function matSub(A: Matrix, B: Matrix): Matrix {
  return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}

function vecAdd(a: Vector, b: Vector): Vector {
  return a.map((v, i) => v + b[i]);
}

function inv2x2(A: Matrix): Matrix {
  const [[a, b], [c, d]] = A;
  const det = a * d - b * c;
  if (Math.abs(det) < EPSILON) throw new Error("2x2 matrix singular");
  const invDet = 1 / det;
  return [
    [d * invDet, -b * invDet],
    [-c * invDet, a * invDet],
  ];
}

function inv4x4(A: Matrix): Matrix {
  const n = 4;
  const M: Matrix = A.map((row, i) => [...row, ...identity(n)[i]]);

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(M[r][i]) > Math.abs(M[pivot][i])) pivot = r;
    }
    if (Math.abs(M[pivot][i]) < EPSILON) throw new Error("4x4 matrix singular");

    if (pivot !== i) {
      const tmp = M[i];
      M[i] = M[pivot];
      M[pivot] = tmp;
    }

    const denom = M[i][i];
    for (let j = 0; j < 2 * n; j++) M[i][j] /= denom;

    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const factor = M[r][i];
      if (Math.abs(factor) < EPSILON_FACTOR) continue;
      for (let c = 0; c < 2 * n; c++) {
        M[r][c] -= factor * M[i][c];
      }
    }
  }

  return M.map((row) => row.slice(n));
}
