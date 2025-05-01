import React from 'react';

interface IncrementDecrementButtonProps {
  radius: number;
  borderColor: string;
  borderStyle: string;
  backgroundColor: string;
  character?: string;
  fontColor?: string;
  onClick: () => void;
  disabled?: boolean;
}

const IncrementDecrementButton: React.FC<IncrementDecrementButtonProps> = ({
  radius,
  borderColor,
  borderStyle,
  backgroundColor,
  character = '',
  disabled = false,
  onClick
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
        fontSize: `${radius * 1.5}px`,
        fontFamily: 'Plus Jakarta Sans',
        color: 'black',
        paddingBottom: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
      onClick={onClick}
    >
      {character}
    </div>
  );
};

export default IncrementDecrementButton;
