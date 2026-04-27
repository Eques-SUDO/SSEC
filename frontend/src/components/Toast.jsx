import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './icons.jsx';

const ToastContext = createContext(null);

const TONE_ICON = {
  success: <Icon.Check />,
  error:   <Icon.Alert />,
  warning: <Icon.Alert />,
  info:    <Icon.Check />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const seq = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = ++seq.current;
    const next = { id, tone: 'info', duration: 4500, ...toast };
    setToasts((list) => [...list, next]);
    if (next.duration > 0) setTimeout(() => dismiss(id), next.duration);
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({
    push,
    dismiss,
    success: (title, msg) => push({ tone: 'success', title, msg }),
    error:   (title, msg) => push({ tone: 'error',   title, msg }),
    warning: (title, msg) => push({ tone: 'warning', title, msg }),
    info:    (title, msg) => push({ tone: 'info',    title, msg }),
  }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

function ToastRegion({ toasts, onDismiss }) {
  return (
    <div className="toast-region" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`toast is-${t.tone}`} role="status">
          <div className="toast-icon">{TONE_ICON[t.tone]}</div>
          <div className="toast-body">
            {t.title && <div className="toast-title">{t.title}</div>}
            {t.msg && <div className="toast-msg">{t.msg}</div>}
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(t.id)}
            aria-label="Fermer"
          >
            <Icon.X width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
