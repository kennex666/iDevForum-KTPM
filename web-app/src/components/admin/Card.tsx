import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface CardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  const borderColorMap: { [key: string]: string } = {
    primary: 'border-l-blue-500',
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    danger: 'border-l-red-500',
    info: 'border-l-cyan-500',
  };

  const textColorMap: { [key: string]: string } = {
    primary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    info: 'text-cyan-500',
  };

  const borderColorClass = borderColorMap[color] || 'border-l-gray-500';
  const textColorClass = textColorMap[color] || 'text-gray-500';

  return (
    <div className={`bg-white shadow-md ${borderColorClass} border-l-4 py-2 rounded-lg`}>
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-1 mr-2">
            <div className={`uppercase ${textColorClass} font-bold text-xs mb-1`}>
              <span>{title}</span>
            </div>
            <div className="text-gray-800 font-bold text-xl mb-0">
              <span>{value}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <i className={`fas fa-${icon} text-3xl text-gray-300`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;