import React from 'react';
import { motion } from 'motion/react';

export const Watermark = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none opacity-[0.03] dark:opacity-[0.05]">
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-20 rotate-[-15deg] scale-150">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className="text-9xl font-black whitespace-nowrap tracking-tighter"
          >
            CARDCRAFT
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
    </div>
  );
};
