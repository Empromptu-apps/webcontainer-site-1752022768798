import React, { useState } from 'react';

const RandomColorButton = () => {
  const [buttonColor, setButtonColor] = useState('#3b82f6');

  const getRandomColor = () => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
      '#f1c40f', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#00bcd4', '#009688',
      '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleClick = () => {
    setButtonColor(getRandomColor());
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: buttonColor,
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        fontSize: '16px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: 'translateY(0)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      }}
      aria-label="Click to change button color randomly"
    >
      Click me to change color!
    </button>
  );
};

export default RandomColorButton;
