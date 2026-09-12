import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      id="toast-container" 
      data-testid="toast-container" 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          data-testid="toast-notification"
          role="alert"
          className="pointer-events-auto flex items-center justify-between p-3.5 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-800 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-center gap-2.5 text-xs font-medium">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span data-testid="toast-message">{toast.message}</span>
          </div>

          <button
            id={`dismiss-toast-${toast.id}`}
            data-testid="close-toast-btn"
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ml-3"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
