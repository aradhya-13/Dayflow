/**
 * Modal — confirm dialog or general purpose overlay.
 *
 * Props:
 *   open: boolean
 *   onClose: fn
 *   title: string
 *   children: body content
 *   footer: JSX (buttons) — if omitted, renders nothing
 *
 * Example (confirm dialog):
 *   <Modal
 *     open={showConfirm}
 *     onClose={() => setShowConfirm(false)}
 *     title="Approve Leave Request?"
 *     footer={
 *       <>
 *         <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
 *         <Button onClick={handleApprove} loading={approving}>Approve</Button>
 *       </>
 *     }
 *   >
 *     <p>This will notify the employee.</p>
 *   </Modal>
 */
import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, footer }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-card-md w-full max-w-md z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-5 py-4 text-sm text-neutral-600">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-5 py-4 border-t border-neutral-100 bg-neutral-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
