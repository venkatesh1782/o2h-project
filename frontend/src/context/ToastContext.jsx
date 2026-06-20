import React, { createContext, useState, useCallback, useContext } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto remove toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'success': return 'bg-success text-white';
      case 'danger': return 'bg-danger text-white';
      case 'warning': return 'bg-warning text-dark';
      case 'info':
      default:
        return 'bg-primary text-white';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal Container */}
      <div 
        className="toast-container position-fixed bottom-0 end-0 p-3" 
        style={{ zIndex: 1100 }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show align-items-center border-0 mb-2 shadow ${getBgClass(toast.type)}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body fs-6 py-2 px-3">
                {toast.message}
              </div>
              <button
                type="button"
                className={`btn-close me-2 m-auto ${toast.type !== 'warning' ? 'btn-close-white' : ''}`}
                onClick={() => removeToast(toast.id)}
                aria-label="Close"
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
