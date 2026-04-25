import type { ReactNode } from 'react';

interface Tab {
  key: string;
  label: ReactNode;
}

interface PixelTabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export function PixelTabs({ tabs, active, onChange }: PixelTabsProps) {
  return (
    <div className="pixel-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={tab.key === active}
          className={`pixel-tab${tab.key === active ? ' pixel-tab--active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
