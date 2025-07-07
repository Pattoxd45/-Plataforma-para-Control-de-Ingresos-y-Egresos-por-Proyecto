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
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
        boxSizing: 'border-box'
      }}
    >
      <div
        className="modal-content"
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px 16px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 4px 24px #0003',
          position: 'relative',
          boxSizing: 'border-box',
          animation: 'modalFadeIn 0.2s'
        }}
      >
        {title && (
          <h3 style={{
            marginTop: 0,
            marginBottom: 12,
            fontSize: 22,
            color: '#2d3748',
            textAlign: 'center',
            fontWeight: 700,
            letterSpacing: 0.5
          }}>
            {title}
          </h3>
        )}
        <div style={{ width: '100%' }}>
          {children}
        </div>
      </div>
      <style>
        {`
        @media (max-width: 600px) {
          .modal-content {
            max-width: 98vw !important;
            padding: 12px 4px !important;
          }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
};

export default CustomModal;