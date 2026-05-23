import React from 'react';
import { type LucideIcon, ArrowUpRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  value?: string | number;
  badgeText?: string;
  badgeType?: 'default' | 'success' | 'warning' | 'info';
  icon: LucideIcon;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  value,
  badgeText,
  badgeType = 'default',
  icon: Icon,
  onClick,
}) => {
  const badgeClasses = {
    default: 'bg-slate-800 text-slate-400 border-slate-700',
    success: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30',
    warning: 'bg-amber-950/40 text-amber-400 border-amber-800/30',
    info: 'bg-cyan-950/40 text-cyan-400 border-cyan-800/30',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 rounded-2xl flex flex-col justify-between relative transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-cyan-500/30 hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)] hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-cyan-400">
          <Icon className="w-5 h-5" />
        </div>
        
        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClasses[badgeType]}`}>
            {badgeText}
          </span>
        )}

        {onClick && (
          <div className="text-slate-400 hover:text-cyan-400 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
        
        {value !== undefined && (
          <p className="text-2xl font-extrabold text-white mt-4 tracking-tight glow-text-cyan">
            {value}
          </p>
        )}
      </div>
    </div>
  );
};
export default DashboardCard;
