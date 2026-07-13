import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ value, duration = 1200, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(0);
  const startTime = useRef(null);
  const frame = useRef(null);

  useEffect(() => {
    const target = Number(value) || 0;
    const from = start.current;
    startTime.current = null;

    const step = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (target - from) * eased);
      if (progress < 1) frame.current = requestAnimationFrame(step);
      else { start.current = target; setDisplay(target); }
    };

    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}
