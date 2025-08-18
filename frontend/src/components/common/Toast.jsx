import React, { useEffect } from 'react';

const typeStyles = {
  success: {
    container: 'bg-green-600 text-white',
    border: 'ring-1 ring-green-500/30',
  },
  error: {
    container: 'bg-red-600 text-white',
    border: 'ring-1 ring-red-500/30',
  },
  info: {
    container: 'bg-blue-600 text-white',
    border: 'ring-1 ring-blue-500/30',
  },
  warning: {
    container: 'bg-yellow-500 text-black',
    border: 'ring-1 ring-yellow-400/40',
  },
};

const Toast = ({ type = 'info', message = '', duration = 3000, onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div className={`pointer-events-auto shadow-lg rounded-lg px-4 py-3 ${styles.container} ${styles.border}`}> 
        <div className="flex items-start">
          <div className="flex-1 text-sm leading-5">
            {message}
          </div>
          <button
            onClick={onClose}
            className="ml-3 inline-flex text-white/80 hover:text-white focus:outline-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;


