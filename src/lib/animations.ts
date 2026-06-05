export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

export const slideRight = {
  initial: { opacity: 0, x: -32 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.35, ease: 'easeOut' }
}

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.07 } }
}

export const chartReveal = {
  initial: { opacity: 0, scaleY: 0, originY: 1 },
  animate: { opacity: 1, scaleY: 1 },
  transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
}

export const counterUp = (duration = 1200) => ({
  // Used for animating number counts
  // Implement in component via useEffect + requestAnimationFrame
  duration
})

export const heatmapReveal = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.04, ease: 'linear' } // per-cell stagger
}

export const slideUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }
}
