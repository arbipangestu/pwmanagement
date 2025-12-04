import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-2xl shadow-primary/50 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-primary-dark/50">
          <h2 className="text-lg font-bold text-highlight-white">{title}</h2>
          <button onClick={onClose} className="text-highlight-white/70 hover:text-highlight-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 text-highlight-white">
          {children}
        </div>
      </div>
    </div>
  );
}
