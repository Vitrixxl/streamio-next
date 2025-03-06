'use client';
import React from 'react';

export const InitWrapper = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  React.useEffect(() => {
    const audio = new Audio('/ph_sound.mp3');
    audio.play();

    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  }, []);
  if (isVisible) {
    return (
      <div className='fixed inset-0 bg-background grid place-content-center'>
        <div className='flex gap-4 items-center justify-center '>
          <div className='grid place-content-center stream-text w-full overflow-hidden'>
            <h1 className='text-8xl font-semibold leading-none'>STREAM</h1>
          </div>
          <div className='bg-primary text-primary-foreground rounded-xl aspect-square grid place-content-center p-2 logo-animation '>
            <h1 className='text-8xl font-semibold'>.IO</h1>
          </div>
        </div>
      </div>
    );
  }
};
