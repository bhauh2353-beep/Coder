'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
}

const Typewriter = ({ text, speed = 50, className, cursorClassName }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const index = useRef(0);

  useEffect(() => {
    index.current = 0;
    setDisplayedText('');
    setIsTypingComplete(false);

    const intervalId = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current++;
      } else {
        setIsTypingComplete(true);
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <h1 className={cn(className)}>
      {displayedText}
      {!isTypingComplete && (
        <span className={cn('ml-1 inline-block h-10 w-1 bg-foreground blinking-cursor', cursorClassName)}></span>
      )}
    </h1>
  );
};

export default Typewriter;
