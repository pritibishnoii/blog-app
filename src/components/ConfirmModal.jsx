'use client';

import { AnimatePresence, motion } from 'framer-motion';

export default function ConfirmModal({ open, title, description, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center px-6"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#15151f] border border-white/10 rounded-xl p-6 max-w-sm w-full"
          >
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-gray-400 mb-6">{description}</p>
            <div className="flex justify-end gap-3">
              <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition">
                Cancel
              </button>
              <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white transition">
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
