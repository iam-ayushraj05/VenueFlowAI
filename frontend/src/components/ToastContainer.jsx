import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div id="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-icon"></div>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
