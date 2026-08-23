'use client';

import { useEffect, useRef } from 'react';

/* ═══ Сцена бассейна: стартовые тумбы, дорожки, преломление воды ═══

   Настоящая трёхмерная сцена без three.js. Твёрдые тела (бортик и тумбы)
   ищутся маршем по знаковому полю расстояний, вода — аналитическим
   пересечением с плоскостью. Луч, попавший в воду, преломляется и идёт
   до дна, где читает разметку дорожек и каустику. Отражение и прозрачность
   смешиваются по Френелю, поэтому вблизи вода прозрачная, а вдаль зеркалит. */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_tile;    // кафель дна
uniform vec3  u_line;    // разметка дорожек
uniform vec3  u_water;   // цвет толщи воды
uniform vec3  u_block;   // тумбы
uniform vec3  u_deckCol; // бортик
uniform vec3  u_hall;    // зал на заднем плане

const float LANE   = 2.5;   // ширина дорожки, метры
const float WATER_Y = -0.35;
const float FLOOR_Y = -2.30;

/* ── бегущая волна на поверхности ── */
float surf(vec2 p, float t) {
  float v = 0.0;
  v += sin(p.x * 1.7 + t * 1.15);
  v += sin(p.y * 2.3 - t * 1.45);
  v += sin((p.x * 0.7 + p.y * 1.3) * 2.1 + t * 0.85);
  v += sin(length(p - vec2(3.0, 6.0)) * 1.9 - t * 1.05);
  return v / 4.0;
}

/* ── каустика на дне ── */
float caustic(vec2 p, float t) {
  float w1 = surf(p * 1.05, t * 0.9);
  float c  = pow(max(0.0, 1.0 - abs(w1) * 2.1), 3.0);
  float w2 = surf(p * 2.30 + 7.0, t * 1.3);
  c += 0.45 * pow(max(0.0, 1.0 - abs(w2) * 2.6), 4.0);
  return c;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

/* ── твёрдые тела: бортик и стартовые тумбы ── */
float mapSolid(vec3 p) {
  // плита бортика вдоль ближнего края
  float deck = sdBox(p - vec3(0.0, -0.18, -1.70), vec3(10.0, 0.18, 1.70));

  // тумбы повторяются по дорожкам; индекс зажат, поэтому поле расстояний
  // остаётся корректным и марш не «протыкает» ближние тумбы
  vec3 q = p;
  float id = clamp(floor(p.x / LANE + 0.5), -3.0, 2.0);
  q.x = p.x - id * LANE;

  // основание
  float base = sdBox(q - vec3(0.0, 0.26, -0.62), vec3(0.32, 0.26, 0.30));
  // наклонная площадка сверху — лёгкий сдвиг по высоте вдоль z
  vec3 s = q - vec3(0.0, 0.60, -0.62);
  s.y += s.z * 0.22;
  float top = sdBox(s, vec3(0.36, 0.045, 0.34));

  float block = min(base, top);

  // дальняя стенка бассейна — она же задаёт длину чаши в 25 метров
  float wall = sdBox(p - vec3(0.0, -0.55, 31.0), vec3(11.0, 1.05, 0.60));

  return min(min(deck, block), wall);
}

vec3 solidNormal(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(
    mapSolid(p + e.xyy) - mapSolid(p - e.xyy),
    mapSolid(p + e.yxy) - mapSolid(p - e.yxy),
    mapSolid(p + e.yyx) - mapSolid(p - e.yyx)
  ));
}

/* ── дно бассейна: кафель, осевая линия, Т-отметка, каустика ── */
vec3 floorColor(vec3 p, float t) {
  float lanePos = fract(p.x / LANE + 0.5) - 0.5;

  float centerLine = 1.0 - smoothstep(0.030, 0.042, abs(lanePos));
  float tBar = (1.0 - smoothstep(0.20, 0.30, abs(mod(p.z, 22.0) - 3.0)))
             * (1.0 - smoothstep(0.16, 0.22, abs(lanePos)));

  // швы плитки
  float gx = 1.0 - smoothstep(0.46, 0.50, abs(fract(p.x * 1.6) - 0.5));
  float gz = 1.0 - smoothstep(0.46, 0.50, abs(fract(p.z * 1.6) - 0.5));

  vec3 col = u_tile;
  col = mix(col, u_tile * 0.88, max(gx, gz) * 0.5);
  col = mix(col, u_line, max(centerLine, tBar));
  col += vec3(1.0) * caustic(p.xz * 0.42, t) * 0.30;
  return col;
}

/* ── что видно сквозь воду ── */
vec3 underWater(vec3 ro, vec3 rd, float t) {
  float td = (FLOOR_Y - ro.y) / min(rd.y, -0.02);
  vec3  hit = ro + rd * td;
  vec3  col = floorColor(hit, t);

  // поглощение толщей воды
  float depth = clamp(td / 16.0, 0.0, 1.0);
  return mix(col, u_water, smoothstep(0.0, 1.0, depth));
}

/* ── фон: стена зала и остекление ── */
vec3 background(vec3 rd) {
  float h = clamp(rd.y * 2.4 + 0.42, 0.0, 1.0);
  vec3 col = mix(u_hall * 0.72, u_hall, h);
  // намёк на панорамное окно
  col += vec3(0.06) * smoothstep(0.42, 0.70, h);
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;
  float t = u_time;

  // камера стоит на бортике сбоку, тумбы уходят влево, дорожки — вдаль
  vec3 ro = vec3(-8.2, 2.10, -5.6);
  vec3 ta = vec3(-1.2, -0.62, 8.4);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.55 * ww);

  vec3 col = background(rd);
  float bestT = 1e5;

  // ── твёрдые тела
  float d = 0.0;
  for (int i = 0; i < 96; i++) {
    vec3 p = ro + rd * d;
    float s = mapSolid(p);
    if (s < 0.004) { bestT = d; break; }
    d += s * 0.60;
    if (d > 46.0) break;
  }

  if (bestT < 1e4) {
    vec3 p = ro + rd * bestT;
    vec3 n = solidNormal(p);
    float lam = clamp(dot(n, normalize(vec3(-0.4, 0.9, 0.25))), 0.0, 1.0);
    // бортик и тумбы окрашены по-разному: тумбы выше уровня плиты
    vec3 base = (p.z > 20.0 || p.y < 0.02) ? u_deckCol : u_block;
    col = base * (0.58 + 0.46 * lam);
    // тёмная резиновая накладка на верхней площадке тумбы
    if (p.y > 0.52 && n.y > 0.5) col *= 0.55;
  }

  // ── вода: пересечение с горизонтальной плоскостью
  if (rd.y < -0.001) {
    float tw = (WATER_Y - ro.y) / rd.y;
    if (tw > 0.0 && tw < bestT) {
      vec3 wp = ro + rd * tw;

      // рябь искажает нормаль поверхности
      float e = 0.16;
      vec2  q = wp.xz * 0.85;
      float h0 = surf(q, t);
      float hx = surf(q + vec2(e, 0.0), t);
      float hz = surf(q + vec2(0.0, e), t);
      vec3  n  = normalize(vec3(-(hx - h0) * 0.55, 1.0, -(hz - h0) * 0.55));

      // Френель: вблизи прозрачно, вдаль зеркально
      float fres = pow(1.0 - clamp(dot(-rd, n), 0.0, 1.0), 4.0);
      fres = clamp(0.02 + 0.42 * fres, 0.0, 1.0);

      vec3 refr = refract(rd, n, 1.0 / 1.333);
      vec3 through = underWater(wp, refr, t);

      vec3 refl = background(reflect(rd, n));
      // блик от светильников зала
      float spec = pow(max(0.0, dot(reflect(rd, n), normalize(vec3(-0.3, 0.85, 0.3)))), 90.0);

      col = mix(through, refl, fres) + vec3(spec) * 0.55;
    }
  }

  // мягкое затемнение к краям кадра
  vec2 vig = gl_FragCoord.xy / u_res.xy;
  col *= 0.90 + 0.10 * pow(16.0 * vig.x * vig.y * (1.0 - vig.x) * (1.0 - vig.y), 0.18);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function PoolScene({
  tile = '#bfe4ef',
  line = '#0f3346',
  water = '#0a4f6e',
  block = '#e8eef2',
  deck = '#9fb3bd',
  hall = '#22546b',
  className = '',
}: {
  tile?: string;
  line?: string;
  water?: string;
  block?: string;
  deck?: string;
  hall?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[pool-scene] шейдер:', gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[pool-scene] линковка:', gl.getProgramInfoLog(prog));
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
    const put = (name: string, hex: string) => {
      const u = gl.getUniformLocation(prog, name);
      if (u) gl.uniform3fv(u, hexToRgb(hex));
    };
    put('u_tile', tile);
    put('u_line', line);
    put('u_water', water);
    put('u_block', block);
    put('u_deckCol', deck);
    put('u_hall', hall);

    // рейтрейсинг дороже плоского шейдера — режем разрешение сильнее
    const resize = () => {
      // марш стоит дорого: на телефоне рендерим в 0.7 от логического размера,
      // размытие незаметно на воде, зато батарея цела
      const narrow = window.innerWidth < 900;
      const dpr = narrow ? 0.7 : Math.min(window.devicePixelRatio || 1, 1);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let raf = 0;
    let visible = false;
    const start = performance.now();

    const frame = () => {
      resize();
      gl.uniform1f(uTime, reduced ? 6 : (performance.now() - start) / 1000);
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
      { rootMargin: '120px' },
    );
    io.observe(canvas);
    window.addEventListener('resize', resize);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [tile, line, water, block, deck, hall]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`block size-full ${className}`}
    />
  );
}
