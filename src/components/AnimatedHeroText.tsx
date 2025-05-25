
"use client";
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface AnimatedHeroTextProps {
  text: string;
  className?: string;
  el?: keyof JSX.IntrinsicElements; // Allow specifying the element type, defaults to h1
}

const AnimatedHeroText: React.FC<AnimatedHeroTextProps> = ({ text, className, el = 'h1' }) => {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }, // Adjusted timing
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  const MotionElement = motion[el] as React.FC<HTMLMotionProps<"h1"> | HTMLMotionProps<"div"> | HTMLMotionProps<"p"> >;


  return (
    <MotionElement
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={childVariants}
          style={{ display: "inline-block", marginRight: "0.35em" }} // Adjusted for potentially larger mono font
          className="whitespace-nowrap" // Prevent word wrap mid-animation
        >
          {word}
        </motion.span>
      ))}
    </MotionElement>
  );
};

export default AnimatedHeroText;
