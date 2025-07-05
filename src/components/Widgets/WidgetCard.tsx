import { ReactNode } from 'react';

interface WidgetCardProps {
  title: string;
  children: ReactNode;
}

/**
 * Reusable container for dashboard widgets – enforces consistent look & feel.
 */
const WidgetCard: React.FC<WidgetCardProps> = ({ title, children }) => (
  <div className="bg-zinc-800/60 backdrop-blur-md border border-zinc-700 rounded-lg p-4 shadow-lg text-white flex flex-col gap-4">
    <h2 className="text-lg font-medium">{title}</h2>
    {children}
  </div>
);

export default WidgetCard; 