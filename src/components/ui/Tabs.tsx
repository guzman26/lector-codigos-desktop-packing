import React, { useState } from 'react';
import { theme } from '../../styles/theme';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId = tabs[0].id,
  onChange,
  fullWidth = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTabId);

  const handleChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const listStyles: React.CSSProperties = {
    display: 'flex',
    borderBottom: `1px solid ${theme.colors.border.light}`,
  };

  const tabButtonStyles = (active: boolean): React.CSSProperties => ({
    flex: fullWidth ? 1 : undefined,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    color: active ? theme.colors.text.primary : theme.colors.text.secondary,
    backgroundColor: active ? theme.colors.background.secondary : 'transparent',
    border: 'none',
    borderBottom: active ? `2px solid ${theme.colors.accent.blue}` : '2px solid transparent',
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  });

  const panelStyles: React.CSSProperties = {
    paddingTop: theme.spacing.xl,
  };

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div>
      <div style={listStyles}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            style={tabButtonStyles(tab.id === activeTab)}
            onClick={() => handleChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={panelStyles}>{currentTab.content}</div>
    </div>
  );
};