import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

function makeToast(payload) {
  return {
    id: crypto.randomUUID(),
    type: payload.type || 'info',
    title: payload.title || '',
    message: payload.message || '',
    duration: payload.duration ?? 3500,
  };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((payload) => {
    const nextToast = makeToast(payload);
    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => {
      removeToast(nextToast.id);
    }, nextToast.duration);
  }, [removeToast]);

  const value = useMemo(() => ({
    pushToast,
    success: (message, title = 'Operation reussie') => pushToast({ type: 'success', title, message }),
    error: (message, title = 'Action impossible') => pushToast({ type: 'error', title, message }),
    info: (message, title = 'Information') => pushToast({ type: 'info', title, message }),
    removeToast,
  }), [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div>
              {toast.title ? <strong>{toast.title}</strong> : null}
              {toast.message ? <p>{toast.message}</p> : null}
            </div>
            <button type="button" className="toast-close" onClick={() => removeToast(toast.id)}>
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
