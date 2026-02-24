import React from 'react';
import { DOMAIN } from '@/constants';

interface BreadcrumbsProps {
  paths: { label: string; active?: boolean; onClick?: () => void }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
  return (
    <nav className="flex items-center space-x-2 text-[10px] font-tech uppercase tracking-[0.2em] mb-8 overflow-x-auto whitespace-nowrap pb-2">
      <span className="text-cyber-muted">{DOMAIN}</span>
      {paths.map((path, idx) => (
        <React.Fragment key={idx}>
          <span className="text-cyber-muted">/</span>
          <button 
            onClick={path.onClick}
            disabled={path.active}
            className={`${path.active ? 'text-white font-bold' : 'text-gray-400 hover:text-white transition-colors'}`}
          >
            {path.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
