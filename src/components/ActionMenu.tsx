import { X, Trash2, StopCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionMenuProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onStop?: () => void;
    onDelete: () => void;
    onPostpone?: () => void;
    type: 'habit' | 'task';
}

export function ActionMenu({ isOpen, onClose, title, onStop, onDelete, onPostpone, type }: ActionMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
            <div
                className="bg-card rounded-[2.5rem] p-6 w-full max-w-[280px] animate-scale-in shadow-2xl border border-border/50"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground truncate flex-1 mr-2">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    {onStop && (
                        <button
                            onClick={() => { onStop(); onClose(); }}
                            className="flex items-center gap-3 w-full p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all text-foreground font-medium touch-feedback"
                        >
                            <StopCircle className="w-5 h-5 text-orange-400" />
                            <span>{type === 'habit' ? 'Stop' : 'Pause'}</span>
                        </button>
                    )}

                    {onPostpone && (
                        <button
                            onClick={() => { onPostpone(); onClose(); }}
                            className="flex items-center gap-3 w-full p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all text-foreground font-medium touch-feedback"
                        >
                            <ArrowRight className="w-5 h-5 text-blue-400" />
                            <span>Postpone</span>
                        </button>
                    )}

                    <button
                        onClick={() => { onDelete(); onClose(); }}
                        className="flex items-center gap-3 w-full p-4 rounded-2xl bg-red-400/10 hover:bg-red-400/20 transition-all text-red-500 font-medium touch-feedback"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
