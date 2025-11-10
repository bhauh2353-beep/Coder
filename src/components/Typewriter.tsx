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
  const timeoutIds = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear any running timeouts when the text changes
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    index.current = 0;
    setDisplayedText('');
    
    const type = () => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current++;
        const timeoutId = setTimeout(type, speed);
        timeoutIds.current.push(timeoutId);
      } else {
        // Typing complete, wait then reset
        const timeoutId = setTimeout(() => {
          index.current = 0;
          setDisplayedText('');
          type(); // Start typing again
        }, delayAfterComplete);
        timeoutIds.current.push(timeoutId);
      }
    };

    if (text) {
        type();
    }

    // Cleanup function to clear timeouts when the component unmounts
    return () => {
      timeoutIds.current.forEach(clearTimeout);
    };
  }, [text, speed, delayAfterComplete]);

  return (
    <h1 className={cn(className)}>
      {displayedText}
      <span className={cn('ml-1 inline-block h-10 w-1 bg-foreground blinking-cursor', cursorClassName)}></span>
    </h1>
  );
};

export default Typewriter;
