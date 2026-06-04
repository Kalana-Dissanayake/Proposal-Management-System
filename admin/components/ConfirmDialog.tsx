import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; message: string }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Action">
      <p className="text-gray-700">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700">Confirm</button>
      </div>
    </Modal>
  );
}
