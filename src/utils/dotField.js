const RIPPLE_SLOTS = 3;
const RIPPLE_LIFE = 1.1;
const GRID_TINT = new Float32Array([1, 1, 1]);

export const DOT_COLOR = 'rgba(255, 255, 255, 0.9)';

export const DOT_FIELD_PRESETS = {
  loud: {
    cell: 26,
    alpha: 0.21,
    dotOpacity: 0.16,
    drift: 2.4,
    pull: 22,
    reach: 150,
    rippleSpeed: 520,
    interactive: true,
  },
  quiet: {
    cell: 40,
    alpha: 0.17,
    dotOpacity: 0.13,
    drift: 1.3,
    pull: 0,
    reach: 110,
    rippleSpeed: 340,
    interactive: false,
  },
  ambient: {
    cell: 46,
    alpha: 0.08,
    dotOpacity: 0.06,
    drift: 0.9,
    pull: 0,
    reach: 90,
    rippleSpeed: 300,
    interactive: false,
  },
};

const CONTEXT_OPTIONS = {
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  powerPreference: 'low-power',
};

const VERTEX_300 = `#version 300 es
in vec2 aPos;

uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uDrift;
uniform float uPull;
uniform float uReach;
uniform float uRippleSpeed;
uniform float uDpr;
uniform vec4 uRipples[3];

out float vGlow;

void main() {
  vec2 position = aPos;
  float seed = fract(sin(dot(aPos, vec2(12.9898, 78.233))) * 43758.5453);

  position += vec2(sin(uTime * 0.42 + seed * 6.2831), cos(uTime * 0.35 + seed * 4.132)) * uDrift;

  float glow = 0.0;

  vec2 toPointer = position - uPointer;
  float pointerDistance = length(toPointer);
  float influence = uPointerActive * exp(-(pointerDistance * pointerDistance) / (2.0 * uReach * uReach));
  position -= (toPointer / max(pointerDistance, 0.001)) * influence * uPull;
  glow += influence;

  for (int slot = 0; slot < 3; slot += 1) {
    vec4 ripple = uRipples[slot];
    vec2 toRipple = position - ripple.xy;
    float rippleDistance = length(toRipple);
    float radius = ripple.z * uRippleSpeed;
    float ring = exp(-pow((rippleDistance - radius) / 26.0, 2.0)) * (1.0 - ripple.z) * ripple.w;
    position += (toRipple / max(rippleDistance, 0.001)) * ring * 14.0;
    glow += ring * 0.9;
  }

  vGlow = clamp(glow, 0.0, 1.0);

  vec2 clip = vec2(position.x / uRes.x * 2.0 - 1.0, 1.0 - position.y / uRes.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = (3.4 + vGlow * 2.6) * uDpr;
}
`;

const VERTEX_100 = VERTEX_300
  .replace('#version 300 es\n', '')
  .replace('in vec2 aPos;', 'attribute vec2 aPos;')
  .replace('out float vGlow;', 'varying float vGlow;');

const FRAGMENT_300 = `#version 300 es
precision mediump float;

uniform vec3 uTint;
uniform float uAlpha;

in float vGlow;
out vec4 fragColor;

void main() {
  float distanceToCenter = length(gl_PointCoord - vec2(0.5));
  float mask = smoothstep(0.5, 0.34, distanceToCenter);
  float alpha = clamp(uAlpha * (0.7 + vGlow * 2.6) * mask, 0.0, 0.95);
  fragColor = vec4(uTint, alpha);
}
`;

const FRAGMENT_100 = FRAGMENT_300
  .replace('#version 300 es\n', '')
  .replace('in float vGlow;', 'varying float vGlow;')
  .replace('out vec4 fragColor;', '')
  .replace('fragColor = vec4(uTint, alpha);', 'gl_FragColor = vec4(uTint, alpha);');

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function linkProgram(gl, vertexSource, fragmentSource) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function acquireContext(canvas) {
  const webgl2 = canvas.getContext('webgl2', CONTEXT_OPTIONS);
  if (webgl2) return { gl: webgl2, legacy: false };

  const webgl1 =
    canvas.getContext('webgl', CONTEXT_OPTIONS) ||
    canvas.getContext('experimental-webgl', CONTEXT_OPTIONS);

  return webgl1 ? { gl: webgl1, legacy: true } : null;
}

function buildGrid(width, height, cell) {
  const columns = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const grid = new Float32Array(columns * rows * 2);

  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      grid[index] = (column + 0.5) * cell;
      grid[index + 1] = (row + 0.5) * cell;
      index += 2;
    }
  }

  return { grid, count: columns * rows };
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function devicePixelRatioCap(limit = 2) {
  const ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  return Math.min(Math.max(ratio, 1), limit);
}

export function attachDotField(canvas, preset, { pointerTarget, shouldRun } = {}) {
  const field = canvas.parentElement;
  const config = preset;
  const ripples = Array.from({ length: RIPPLE_SLOTS }, () => ({ x: 0, y: 0, age: 1, strength: 0 }));
  const rippleData = new Float32Array(RIPPLE_SLOTS * 4);
  const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: 0, target: 0 };

  let gl = null;
  let program = null;
  let buffer = null;
  let uniforms = null;
  let observer = null;
  let pixelRatio = devicePixelRatioCap();
  let points = 0;
  let frame = 0;
  let running = false;
  let initialized = false;
  let disposed = false;
  let previous = 0;

  const localPoint = (event) => {
    const rect = field.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerMove = (event) => {
    const point = localPoint(event);
    pointer.targetX = point.x;
    pointer.targetY = point.y;
    pointer.target = 1;
  };

  const handlePointerLeave = () => {
    pointer.target = 0;
  };

  const handlePointerDown = (event) => {
    const point = localPoint(event);
    const free = ripples.findIndex((item) => item.age >= 1);
    const ripple = ripples[free === -1 ? 0 : free];
    ripple.x = point.x;
    ripple.y = point.y;
    ripple.age = 0;
    ripple.strength = 1;
  };

  const handleContextLost = (event) => {
    event.preventDefault();
    stop();
    initialized = false;
    gl = null;
    program = null;
    buffer = null;
    uniforms = null;
    if (field) delete field.dataset.ready;
  };

  const handleContextRestored = () => {
    if (typeof shouldRun === 'function' && !shouldRun()) return;
    start();
  };

  function resize() {
    if (!gl) return;

    const rect = field.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    pixelRatio = devicePixelRatioCap();
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);

    const built = buildGrid(width, height, config.cell);
    points = built.count;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, built.grid, gl.STATIC_DRAW);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, width, height);
    gl.uniform1f(uniforms.pixelRatio, pixelRatio);
  }

  function draw(now) {
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0.016;
    previous = now;

    pointer.x += (pointer.targetX - pointer.x) * 0.12;
    pointer.y += (pointer.targetY - pointer.y) * 0.12;
    pointer.active += (pointer.target - pointer.active) * 0.08;

    for (let slot = 0; slot < RIPPLE_SLOTS; slot += 1) {
      const ripple = ripples[slot];
      if (ripple.age < 1) ripple.age = Math.min(ripple.age + delta / RIPPLE_LIFE, 1);

      rippleData[slot * 4] = ripple.x;
      rippleData[slot * 4 + 1] = ripple.y;
      rippleData[slot * 4 + 2] = ripple.age;
      rippleData[slot * 4 + 3] = ripple.strength;
    }

    gl.uniform1f(uniforms.time, now / 1000);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.pointerActive, pointer.active);
    gl.uniform4fv(uniforms.ripples, rippleData);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points);

    if (field && field.dataset.ready !== 'true') field.dataset.ready = 'true';

    frame = requestAnimationFrame(draw);
  }

  function initialize() {
    if (initialized || disposed) return false;

    const context = acquireContext(canvas);
    if (!context) return false;

    gl = context.gl;
    program = linkProgram(
      gl,
      context.legacy ? VERTEX_100 : VERTEX_300,
      context.legacy ? FRAGMENT_100 : FRAGMENT_300
    );

    if (!program) {
      gl = null;
      return false;
    }

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    uniforms = {
      resolution: gl.getUniformLocation(program, 'uRes'),
      time: gl.getUniformLocation(program, 'uTime'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      pointerActive: gl.getUniformLocation(program, 'uPointerActive'),
      ripples: gl.getUniformLocation(program, 'uRipples'),
      tint: gl.getUniformLocation(program, 'uTint'),
      alpha: gl.getUniformLocation(program, 'uAlpha'),
      drift: gl.getUniformLocation(program, 'uDrift'),
      pull: gl.getUniformLocation(program, 'uPull'),
      reach: gl.getUniformLocation(program, 'uReach'),
      rippleSpeed: gl.getUniformLocation(program, 'uRippleSpeed'),
      pixelRatio: gl.getUniformLocation(program, 'uDpr'),
    };

    const positionSlot = gl.getAttribLocation(program, 'aPos');
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionSlot);
    gl.vertexAttribPointer(positionSlot, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3fv(uniforms.tint, GRID_TINT);
    gl.uniform1f(uniforms.alpha, config.alpha);
    gl.uniform1f(uniforms.drift, config.drift);
    gl.uniform1f(uniforms.pull, config.pull);
    gl.uniform1f(uniforms.reach, config.reach);
    gl.uniform1f(uniforms.rippleSpeed, config.rippleSpeed);

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    if (config.interactive) {
      const target = pointerTarget || field;
      target.addEventListener('pointermove', handlePointerMove, { passive: true });
      target.addEventListener('pointerleave', handlePointerLeave, { passive: true });
      target.addEventListener('pointerdown', handlePointerDown, { passive: true });
    }

    if (typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(resize);
      observer.observe(field);
    }

    initialized = true;
    resize();
    return true;
  }

  function start() {
    if (disposed || running) return;
    if (!initialize()) return;

    running = true;
    previous = 0;
    frame = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function destroy() {
    disposed = true;
    stop();

    if (observer) observer.disconnect();
    observer = null;

    canvas.removeEventListener('webglcontextlost', handleContextLost);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored);

    if (config.interactive) {
      const target = pointerTarget || field;
      target.removeEventListener('pointermove', handlePointerMove);
      target.removeEventListener('pointerleave', handlePointerLeave);
      target.removeEventListener('pointerdown', handlePointerDown);
    }

    if (gl) {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);

      if (!canvas.isConnected) {
        const release = gl.getExtension('WEBGL_lose_context');
        if (release) release.loseContext();
      }
    }

    buffer = null;
    program = null;
    gl = null;
    uniforms = null;
    initialized = false;

    if (field) delete field.dataset.ready;
  }

  return { start, stop, destroy, resize };
}
