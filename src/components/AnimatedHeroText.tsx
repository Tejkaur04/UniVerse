
"use client";

import { motion } from 'framer-motion';
import type { FC } from 'react';

interface AnimatedHeroTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
}

const AnimatedHeroText: FC<AnimatedHeroTextProps> = ({ text, className, staggerDelay = 0.08 }) => {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: i * 0.1 },
    }),
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          className="inline-block mr-[0.25em]" // Adjust spacing between words
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default AnimatedHeroText;
