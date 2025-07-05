import React from 'react';
import WidgetCard from '../WidgetCard';

export interface CodeInputWidgetProps {
  data: {
    latestCode: string;
    history: string[];
  };
}

/**
 * Pure presentational component that displays scanned code data.
 * Business logic lives in hooks; here we simply render.
 */
const CodeInputWidget: React.FC<CodeInputWidgetProps> = ({ data }) => {
  const { latestCode, history } = data;

  return (
    <WidgetCard title="Code Input">
      <p className="text-2xl font-bold">{latestCode ?? '—'}</p>
      <ul className="list-none mt-2 space-y-1">
        {history.map((code, idx) => (
          <li key={`${code}-${idx}`}>{code}</li>
        ))}
      </ul>
    </WidgetCard>
  );
};

export default CodeInputWidget; 