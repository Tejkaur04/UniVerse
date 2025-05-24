// src/components/starry-background.tsx
import React from 'react';

const StarryBackground = () => {
  return (
    <div className="starry-sky-base" aria-hidden="true">
      <div id="stars-small"></div>
      <div id="stars-medium"></div>
      <div id="stars-large"></div>
    </div>
  );
};

export default StarryBackground;
