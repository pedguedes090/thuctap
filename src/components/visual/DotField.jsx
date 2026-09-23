import React, { useEffect, useRef } from 'react';
import { DOT_COLOR, DOT_FIELD_PRESETS, attachDotField, prefersReducedMotion } from '../../utils/dotField';

export default function DotField({ preset = 'loud', trackRef = null, className = '' }) {
  const fieldRef = useRef(null);
  const canvasRef = useRef(null);
  const config = DOT_FIELD_PRESETS[preset] || DOT_FIELD_PRESETS.loud;

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const field = fieldRef.current;
    const canvas = canvasRef.current;
    if (!field || !canvas) return undefined;

    let visible = false;
    const shouldRun = () => visible && !document.hidden;

    const controller = attachDotField(canvas, config, {
      pointerTarget: trackRef?.current || null,
      shouldRun,
    });

    const sync = () => {
      if (shouldRun()) controller.start();
      else controller.stop();
    };

    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0 }
    );
    intersection.observe(field);

    const handleVisibility = () => sync();

    if (shouldRun() && !('IntersectionObserver' in window)) {
      visible = true;
      sync();
    }

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      intersection.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      controller.destroy();
    };
  }, [config, trackRef]);

  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      className={`field pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="field-layer-base absolute inset-0"
        style={{
          '--field-dot-opacity': config.dotOpacity,
          backgroundImage: `radial-gradient(${DOT_COLOR} 1.3px, transparent 1.3px)`,
          backgroundSize: `${config.cell}px ${config.cell}px`,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
