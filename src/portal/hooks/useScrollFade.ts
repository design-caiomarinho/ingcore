import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

/** Calcula os degradês nas bordas conforme a posição da rolagem. */
export function useScrollFade<Content extends HTMLElement = HTMLDivElement>() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<Content>(null);
  const [fadeSize, setFadeSize] = useState(0);
  const [fadeTop, setFadeTop] = useState(0);
  const onScroll = () => {
    const element = scrollRef.current;
    if (element) {
      setFadeSize(Math.max(0, Math.min(48, element.scrollHeight - element.clientHeight - element.scrollTop)));
      setFadeTop(Math.max(0, Math.min(48, element.scrollTop)));
    }
  };
  useLayoutEffect(() => {
    onScroll();
    const observer = new ResizeObserver(onScroll);
    if (scrollRef.current) observer.observe(scrollRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);
  return { scrollRef, contentRef, onScroll, style: {'--scroll-fade-size': `${fadeSize}px`, '--scroll-fade-top': `${fadeTop}px`} as CSSProperties };
}