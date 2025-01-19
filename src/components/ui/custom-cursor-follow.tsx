import React, { useState, useEffect, useCallback } from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomCursorProps {
  children: React.ReactNode;
  className?: string;
  cursorClassName?: string;
  cursorImageSrc?: string;
}

const CustomCursorFollow = ({
  children,
  className,
  cursorClassName,
  cursorImageSrc = '/assets/crossed_fingers_animated_medium.png'
}: CustomCursorProps) => {
  // Initialize position to null to avoid initial render at wrong position
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Use useCallback to memoize event handlers
  const updatePosition = useCallback((e: MouseEvent) => {
    if (!isVisible) return;
    
    setPosition({
      x: e.clientX,
      y: e.clientY
    });
  }, [isVisible]);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    // Set initial position immediately on enter
    setPosition({
      x: e.clientX,
      y: e.clientY
    });
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    setPosition(null);
  }, []);

  useEffect(() => {
    const element = document.getElementById('cursor-area');
    if (!element) return;

    // Add event listeners
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', updatePosition);

    // Cleanup
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', updatePosition);
    };
  }, [handleMouseEnter, handleMouseLeave, updatePosition]);



  return (
    <>
      <div 
        id="cursor-area" 
        className={cn(
          "cursor-none relative w-full h-full",
          className
        )}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && position && (
          <motion.div 
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 99999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className={cn(
                "pointer-events-none absolute",
                cursorClassName
              )}
              style={{
                width: '40px',
                height: 'auto',
                left: -20,
                top: -20,
              }}
              initial={{ 
                scale: 0, 
                opacity: 0,
                x: position.x,
                y: position.y
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: position.x,
                y: position.y,
              }}
              exit={{ 
                scale: 0,
                opacity: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 30,
                mass: 0.8
              }}
            >
              <Image
                src={cursorImageSrc}
                width={80}
                height={80}
                priority
                alt="Cursor"
                className={cn("-rotate-12")}
                unoptimized={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursorFollow;