import React from 'react';

const CustomModal = ({ open, onClose, title, children }) => {
  if (!open) return null;

  // Cerrar modal al hacer clic fuera del contenido
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}
    >
      <div
        style={{
          background: '#fff', borderRadius: 10, padding: 32, minWidth: 320, maxWidth: 480,
          boxShadow: '0 2px 16px #0002', position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
            fontSize: 22, cursor: 'pointer', color: '#888'
          }}
          aria-label="Cerrar"
        >
          &times;
        </button>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default CustomModal;