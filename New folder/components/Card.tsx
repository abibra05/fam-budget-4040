
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', id }) => {
  return (
    <div id={id} className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
