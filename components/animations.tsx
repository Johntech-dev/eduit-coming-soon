"use client"

import { motion } from "framer-motion"

// Fade in animation
export const FadeIn = ({ children, delay = 0, duration = 0.5, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
)

// Staggered children animation container
export const StaggerContainer = ({ children, ...props }: any) => (
  <motion.div initial="hidden" animate="visible" {...props}>
    {children}
  </motion.div>
)

// Staggered child item
export const StaggerItem = ({ children, index = 0, ...props }: any) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1 * index,
          duration: 0.5,
        },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
)

// Scroll animation
export const ScrollReveal = ({ children, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    {...props}
  >
    {children}
  </motion.div>
)

// Pulse animation for buttons or important elements
export const PulseAnimation = ({ children, ...props }: any) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} {...props}>
    {children}
  </motion.div>
)

// Floating animation for decorative elements
export const FloatingAnimation = ({ children, ...props }: any) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    }}
    {...props}
  >
    {children}
  </motion.div>
)

// Success animation
export const SuccessAnimation = ({ children, ...props }: any) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{
      scale: [0.8, 1.2, 1],
      opacity: 1,
    }}
    transition={{
      duration: 0.5,
    }}
    {...props}
  >
    {children}
  </motion.div>
)

