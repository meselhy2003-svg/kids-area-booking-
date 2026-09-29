import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

export default function LazyImage({
  src,
  alt = '',
  className = '',
  style = {},
  fallbackSrc = '/photo/kid-area-pic/Kids sliding into colorful ball pit.png',
  threshold = 0.1,
  rootMargin = '150px',
  onClick,
  ...props
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // If IntersectionObserver is unsupported in browser, load immediately
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    setHasError(true);
    if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
  };

  return (
    <div 
      ref={imgRef} 
      className={`lazy-img-wrapper ${isLoaded ? 'loaded' : 'loading'} ${className}`}
      style={style}
      onClick={onClick}
    >
      {/* Shimmer skeleton placeholder while loading */}
      {!isLoaded && <div className="lazy-img-shimmer" />}

      {isIntersecting && (
        <img
          src={hasError && fallbackSrc ? fallbackSrc : src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-actual-img ${isLoaded ? 'visible' : 'hidden'}`}
          {...props}
        />
      )}
    </div>
  );
}
