'use client';

import { useRef, type ReactNode, type PointerEvent } from 'react';

/** Only the decorative layer follows the pointer; the photograph stays still. */
export function OrcaMotion({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLElement>(null);

  function followPointer(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== 'mouse' ||
      !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches
    ) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--orca-x', `${x * 18}px`);
    event.currentTarget.style.setProperty('--orca-y', `${y * 14}px`);
    event.currentTarget.style.setProperty('--orca-rotate', `${x * 7}deg`);
    event.currentTarget.style.setProperty('--orca-tilt', `${-y * 9}deg`);
  }

  function resetPointer() {
    for (const name of ['--orca-x', '--orca-y', '--orca-rotate', '--orca-tilt']) {
      stage.current?.style.removeProperty(name);
    }
  }

  return (
    <figure
      ref={stage}
      className="praimi-stage reveal relative mx-auto w-full max-w-md md:max-w-xl lg:max-w-none"
      onPointerMove={followPointer}
      onPointerLeave={resetPointer}
      onPointerCancel={resetPointer}
    >
      {children}
    </figure>
  );
}
