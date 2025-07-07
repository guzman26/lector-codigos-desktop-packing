import { ReactNode } from 'react';
import { Card } from '../ui';

interface WidgetCardProps {
  title: string;
  children: ReactNode;
}

/**
 * Reusable container for dashboard widgets – enforces consistent look & feel.
 */
const WidgetCard: React.FC<WidgetCardProps> = ({ title, children }) => (
  <Card variant="blur" padding="large">
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </Card>
);

export default WidgetCard; 