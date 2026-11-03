'use client';

import { useEffect, useId, useRef } from 'react';

/* A smooth displacement field bends the artwork locally without cutting it
   into rigid pieces. Neutral grey keeps the head and torso in place. */
const bendMap = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="760" viewBox="0 0 760 760">
  <defs>
    <radialGradient id="tail"><stop stop-color="rgb(238,153,128)"/><stop offset="1" stop-color="rgb(128,128,128)"/></radialGradient>
    <radialGradient id="fin"><stop stop-color="rgb(108,176,128)"/><stop offset="1" stop-color="rgb(128,128,128)"/></radialGradient>
  </defs>
  <rect width="760" height="760" fill="rgb(128,128,128)"/>
  <ellipse cx="666" cy="704" rx="135" ry="155" fill="url(#tail)"/>
  <ellipse cx="252" cy="244" rx="72" ry="76" fill="url(#fin)"/>
</svg>`)}`;

export function OrcaFlex() {
  const id = `orca-flex-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = svg.current;
    const stage = node?.closest('.praimi-stage');
    if (!node || !stage) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let started = false;
    node.pauseAnimations();

    function update() {
      if (!node) return;
      if (visible && !reduced.matches && !document.hidden) {
        if (!started) {
          node.querySelector('animate')?.beginElement();
          started = true;
        }
        node.unpauseAnimations();
      } else node.pauseAnimations();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(stage);
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <>
      <svg ref={svg} className="praimi-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feImage href={bendMap} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="bend" />
            <feDisplacementMap in="SourceGraphic" in2="bend" scale="0" xChannelSelector="R" yChannelSelector="G">
              <animate attributeName="scale" values="0;16;-11;0;0" keyTimes="0;0.22;0.48;0.72;1" dur="5.6s" begin="indefinite" calcMode="spline" keySplines="0.4 0 0.3 1;0.4 0 0.3 1;0.4 0 0.3 1;0 0 1 1" repeatCount="indefinite" />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
      <style>{`@media (prefers-reduced-motion: no-preference) { [data-reveal='on'] .praimi-stage.is-in .praimi-flex { filter: url(#${id}); } }`}</style>
    </>
  );
}
