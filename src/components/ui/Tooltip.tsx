import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

interface TooltipProps {
  children: React.ReactNode; // The trigger
  content: React.ReactNode; // The tooltip content
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number; // ms
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 200,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const show = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setCoords({ x: centerX, y: centerY });
    setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    setVisible(false);
  };

  const tooltipStyles: React.CSSProperties = {
    position: 'fixed',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: theme.colors.text.primary,
    color: theme.colors.background.secondary,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.primary,
    borderRadius: theme.borderRadius.sm,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    zIndex: 2000,
  };

  const getPosition = () => {
    const offset = 10;
    switch (placement) {
      case 'bottom':
        return { top: coords.y + offset, left: coords.x };
      case 'left':
        return { top: coords.y, left: coords.x - offset };
      case 'right':
        return { top: coords.y, left: coords.x + offset };
      case 'top':
      default:
        return { top: coords.y - offset, left: coords.x };
    }
  };

  return (
    <span
      style={{ display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              style={{ ...tooltipStyles, transform: 'translate(-50%, -100%)', ...getPosition() }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
};