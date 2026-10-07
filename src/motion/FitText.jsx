import { useLayoutEffect, useRef } from 'react';
import './FitText.css';

/**
 * Sizes a single line of text so it spans the full width of its container
 * — the "title as wide as the page" look — without ever getting taller than
 * a share of the viewport.
 *
 * How: a hidden copy of `text` is measured at a known font size (100px),
 * and the wrapper's font-size is set to whatever makes that width equal the
 * space available. It re-fits when the container resizes and again once
 * the web fonts have loaded (the fallback font has different widths).
 *
 * The visible content is passed as children and simply inherits the
 * computed font-size, so it can be anything — animated text included —
 * without disturbing the measurement.
 *
 * @param {object} props
 * @param {string} props.text      the text to fit (drives the measurement)
 * @param {number} [props.maxVh=24] cap on the font size, in % of viewport height
 * @param {number} [props.fill=1]  fraction of the container width to span
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function FitText({ text, maxVh = 24, fill = 1, className = '', children }) {
  const wrapRef = useRef(null);
  const measureRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const measure = measureRef.current;
    if (!wrap || !measure) return undefined;

    const fit = () => {
      // offsetWidth: layout widths, unaffected by any transform on ancestors
      const natural = measure.offsetWidth; // width of the text at 100px
      const available = wrap.offsetWidth * fill;
      if (!natural || !available) return;
      const byWidth = (100 * available) / natural;
      const byHeight = (window.innerHeight * maxVh) / 100;
      wrap.style.fontSize = `${Math.min(byWidth, byHeight).toFixed(2)}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(wrap);
    window.addEventListener('resize', fit);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [text, maxVh, fill]);

  return (
    <span ref={wrapRef} className={`fit-text${className ? ` ${className}` : ''}`}>
      <span className="fit-text__measure-box" aria-hidden="true">
        <span ref={measureRef} className="fit-text__measure">
          {text}
        </span>
      </span>
      {children}
    </span>
  );
}
