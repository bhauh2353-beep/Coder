'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  text: string;
  speed?: number;
  delayAfterComplete?: number;
  className?: string;
  cursorClassName?: string;
}

const Typewriter = ({
  text,
  speed = 50,
  delayAfterComplete = 2000,
  className,
  cursorClassName,
}: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);

  useEffect(() => {
    const type = () => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current++;
        setTimeout(type, speed);
      } else {
        // Typing complete, wait then reset
        setTimeout(() => {
          index.current = 0;
          setDisplayedText('');
          type(); // Start typing again
        }, delayAfterComplete);
      }
    };

    type();

    // No cleanup function is needed if we want it to loop forever
    // and we're managing recursion with setTimeout.
    // However, it's good practice to have one if the component can unmount.
    // For this use case where it's always visible, we can simplify.
  }, [text, speed, delayAfterComplete]);

  return (
    <h1 className={cn(className)}>
      {displayedText}
      <span className={cn('ml-1 inline-block h-10 w-1 bg-foreground blinking-cursor', cursorClassName)}></span>
    </h1>
  );
};

export default Typewriter;
