import React from 'react';
import './SpaceAlert.css';

const SpaceAlert = ({ message, onClose }) => {
  return (
    <div className="space-alert-overlay">
      <div className="space-alert">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SpaceAlert;