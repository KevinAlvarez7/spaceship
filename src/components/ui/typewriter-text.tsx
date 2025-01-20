// components/ui/typewriter-text.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export interface TypewriterRef {
  complete: () => void;
}

const TypewriterText = forwardRef<TypewriterRef, TypewriterTextProps>(({ 
  text, 
  speed = 50, 
  className = '',
  onComplete 
}, ref) => {
  const [displayText, setDisplayText] = useState('');

  useImperativeHandle(ref, () => ({
    complete: () => {
      setDisplayText(text);
      onComplete?.();
    }
  }));

  useEffect(() => {
    setDisplayText('');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => {
      clearInterval(interval);
      setDisplayText('');
    };
  }, [text, speed, onComplete]);

  return <div className={className}>{displayText}</div>;
});

TypewriterText.displayName = "TypewriterText";

export { TypewriterText };