import React from 'react';
import { PrincipleName } from '../types/effectuation';
import { Feather, Shield, Grid, Sparkles, Compass } from 'lucide-react';

interface PrincipleBadgeProps {
  principle: PrincipleName;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const PrincipleBadge: React.FC<PrincipleBadgeProps> = ({
  principle,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getStyle = () => {
    switch (principle) {
      case 'Bird-in-Hand':
        return {
          bg: 'bg-[#FAF0EB]',
          text: 'text-[#D96B43]',
          border: 'border-[#FAF0EB]',
          icon: Feather,
        };
      case 'Affordable Loss':
        return {
          bg: 'bg-[#EFE8E1]',
          text: 'text-[#2D2D2D]',
          border: 'border-[#EFE8E1]',
          icon: Shield,
        };
      case 'Crazy Quilt':
        return {
          bg: 'bg-[#E5EFE9]',
          text: 'text-[#4A6B5D]',
          border: 'border-[#E5EFE9]',
          icon: Grid,
        };
      case 'Lemonade':
        return {
          bg: 'bg-[#F8F2EB]',
          text: 'text-[#B07C4A]',
          border: 'border-[#F8F2EB]',
          icon: Sparkles,
        };
      case 'Pilot-in-the-Plane':
        return {
          bg: 'bg-[#ECE8E3]',
          text: 'text-[#1A1A1A]',
          border: 'border-[#ECE8E3]',
          icon: Compass,
        };
      default:
        return {
          bg: 'bg-[#F4EFEB]',
          text: 'text-[#56423C]',
          border: 'border-[#E5DCD2]',
          icon: Feather,
        };
    }
  };

  const config = getStyle();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider font-semibold',
    md: 'text-[12px] px-2.5 py-0.5 tracking-wide font-medium',
    lg: 'text-[13px] px-3.5 py-1 tracking-wide font-medium',
  }[size];

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {showIcon && <IconComponent size={iconSizes} strokeWidth={2.2} />}
      <span>{principle}</span>
    </span>
  );
};
