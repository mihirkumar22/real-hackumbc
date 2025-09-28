import React from 'react';
import { motion } from 'framer-motion';
import BeanstalkImage from './durr.webp';

// Custom beanstalk image component integrated.
// This creates the main focal point of the page with the actual beanstalk design.

const BeanstalkHeroImage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Custom beanstalk SVG */}
        <motion.div 
          className="w-96 h-96 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={BeanstalkImage} 
            alt="Beanstalk ASL Learning" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BeanstalkHeroImage;
