'use client';

import { useEffect, useRef } from 'react';

/*
  Абстрактная толща воды: глубина, световые шахты сверху, каустика,
  поднимающиеся пузырьки. Один фрагментный шейдер, без three.js —
  вся сцена это примерно 4 КБ кода и один треугольник на весь экран.

  Сцена мягко реагирует на курсор: смещается точка обзора и центры свечений.
  На касание реакции нет намеренно — палец закрывает то место, куда наведён.
*/

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;    // -1..1, уже сглажено на стороне JS
uniform float u_quality;  // 1.0 — полное качество, 0.0 — облегчённое
uniform vec3  u_deep;     // цвет дна кадра
uniform vec3  u_mid;      // цвет верха кадра
uniform vec3  u_violet;   // второе свечение
uniform vec3  u_aqua;     // акцентный свет

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

// на слабых устройствах октав меньше — рисунок тот же, счёта вдвое меньше
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    if (float(i) > 1.0 + u_quality * 2.0) break;
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

// светлые нити каустики: рождаются там, где волны гасят друг друга
float caustic(vec2 p, float t) {
  float w = 0.0;
  w += sin(p.x * 2.4 + t * 0.9);
  w += sin(p.y * 2.0 - t * 1.1);
  w += sin((p.x + p.y) * 1.7 + t * 0.6);
  w += sin(length(p - vec2(0.7, -0.3)) * 3.1 - t * 1.2);
  w /= 4.0;
  return pow(max(0.0, 1.0 - abs(w) * 2.3), 3.0);
}

// пузырьки: три слоя ячеек, всплывающих с разной скоростью
float bubbles(vec2 p, float t) {
  float s = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i) + 1.0;
    vec2 q = p * (1.7 + fi * 0.8);
    q.y += t * (0.05 + fi * 0.035);
    vec2 id = floor(q);
    vec2 f = fract(q) - 0.5;
    float r = hash(id + fi * 17.0);
    if (r > 0.88) {
      vec2 off = (vec2(hash(id + 3.0), hash(id + 7.0)) - 0.5) * 0.55;
      float d = length(f - off);
      // тонкая светлая кромка вместо сплошного пятна — так читается объём
      s += smoothstep(0.05, 0.026, d) * (0.35 + 0.65 * r);
    }
  }
  return s;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p  = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

  // очень лёгкий сдвиг пространства за курсором
  p += u_mouse * 0.035;

  float t = u_time;

  // ── глубина: книзу темнее
  float depth = smoothstep(-0.62, 0.72, p.y);
  vec3 col = mix(u_deep, u_mid, depth);

  // ── два источника света в толще
  col += u_violet * 1.15 * exp(-length((p - vec2(0.62 + u_mouse.x * 0.06, -0.55)) * vec2(0.75, 1.0)) * 1.5);
  col += u_aqua   * 0.42 * exp(-length((p - vec2(0.42 + u_mouse.x * 0.04,  0.70)) * vec2(0.6, 1.0)) * 1.7);

  // ── световые шахты сверху
  float shafts = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float x = p.x + p.y * (0.30 + fi * 0.10);
    float w = fbm(vec2(x * 2.2 + fi * 11.0, t * 0.09 + fi * 5.0));
    shafts += smoothstep(0.40, 0.95, w);
  }
  shafts *= 0.333 * smoothstep(-0.8, 0.8, p.y);
  col += u_aqua * shafts * 0.85;

  // ── каустика ближе к поверхности
  col += u_aqua * caustic(p * 2.1 + vec2(0.0, t * 0.04), t * 0.5)
       * 0.30 * smoothstep(-0.15, 0.85, p.y);

  // ── пузырьки
  col += vec3(0.72, 0.92, 1.0) * bubbles(p, t) * 0.55;

  // ── зерно: убирает полосы на плавных градиентах
  col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.014;

  // ── виньетка
  col *= 1.0 - 0.22 * pow(length(p * vec2(0.55, 1.0)), 2.4);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function WaterScene({
  deep = '#03070f',
  mid = '#0a1c39',
  violet = '#4f017b',
  aqua = '#38c6f4',
  className = '',
}: {
  deep?: string;
  mid?: string;
  violet?: string;
  aqua?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return; // без WebGL под канвасом остаётся фирменная заливка

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[water] шейдер:', gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[water] линковка:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uQuality = gl.getUniformLocation(prog, 'u_quality');
    const put = (n: string, hex: string) => {
      const u = gl.getUniformLocation(prog, n);
      if (u) gl.uniform3fv(u, hexToRgb(hex));
    };
    put('u_deep', deep);
    put('u_mid', mid);
    put('u_violet', violet);
    put('u_aqua', aqua);

    // мобильные GPU считают шум заметно медленнее: режем и разрешение, и октавы
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.innerWidth < 900;
    const light = coarse || narrow;
    gl.uniform1f(uQuality, light ? 0.0 : 1.0);

    const resize = () => {
      const cap = light ? 1 : 1.4;
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    // курсор догоняется плавно — резкий сдвиг сцены выглядит дёшево
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = 1 - (e.clientY / window.innerHeight) * 2;
    };

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let raf = 0;
    let visible = false;
    const start = performance.now();

    const frame = () => {
      resize();
      smooth.x += (target.x - smooth.x) * 0.045;
      smooth.y += (target.y - smooth.y) * 0.045;
      gl.uniform2f(uMouse, smooth.x, smooth.y);
      gl.uniform1f(uTime, reduced ? 7 : (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = !reduced && visible ? requestAnimationFrame(frame) : 0;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) frame();
        else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: '80px' },
    );
    io.observe(canvas);

    window.addEventListener('resize', resize);
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true });
    frame();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [deep, mid, violet, aqua]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`block size-full ${className}`}
    />
  );
}
