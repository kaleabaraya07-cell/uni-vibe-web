import { X } from "lucide-react";
import "./Modal.css";

function Modal({ open, onClose, title, children, className = "" }) {
  if (!open) return null;

  return (
    <div className="ui-modal" role="dialog" aria-modal="true">
      <div className="ui-modal__backdrop" onClick={onClose} />
      <div className={`ui-modal__content ${className}`.trim()}>
        <div className="ui-modal__header">
          {title && <h2>{title}</h2>}
          <button type="button" className="ui-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="ui-modal__body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
