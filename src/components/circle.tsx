import React from 'react';

interface CircleProps {
  radius: number;
  borderColor: string;
  borderStyle: string;
  backgroundColor: string;
  character?: string;
  fontColor?: string;
}

const Circle: React.FC<CircleProps> = ({
  radius,
  borderColor,
  borderStyle,
  backgroundColor,
  character = ''
}) => {
  return (
    <div
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: '50%',
        border: `1px ${borderStyle} ${borderColor}`,
        backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: `${radius}px`,
        fontWeight: 'bold',
        fontFamily: 'Plus Jakarta Sans',
        color: 'white'
      }}
    >
      {character}
    </div>
  );
};

export default Circle;
