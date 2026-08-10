import { useEffect, useState, useRef, useContext } from 'react';
import { Context } from './usecontext';
import './CustomCursor.css';

export const CustomCursor = () => {
  const { theme } = useContext(Context);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) {
      setIsVisible(false);
      return;
    }

    const onPointerMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onPointerDown = () => setIsClicked(true);
    const onPointerUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a, button, input, select, textarea, .card, .clickable, [role="button"], .btn, .nav-link')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    let animationFrameId;
    const render = () => {
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.18;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.18;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={cursorDotRef}
        className={`custom-cursor-dot ${isHovered ? 'is-hovered' : ''} ${isClicked ? 'is-clicked' : ''}`}
        style={{ '--cursor-theme-color': theme === 'dark' ? '#a855f7' : '#0f62fe' }}
      />
      <div
        ref={cursorRingRef}
        className={`custom-cursor-ring ${isHovered ? 'is-hovered' : ''} ${isClicked ? 'is-clicked' : ''}`}
        style={{ '--cursor-theme-color': theme === 'dark' ? '#6366f1' : '#0f62fe' }}
      />
    </>
  );
};

export default CustomCursor;
