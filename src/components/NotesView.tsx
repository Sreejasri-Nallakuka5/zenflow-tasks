import { useState, useEffect } from 'react';
import { Calendar, Save, Trash2, BookOpen, Heart, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, isSameDay } from 'date-fns';
import { useNotes } from '@/hooks/useNotes';
import { useLanguage } from '@/contexts/LanguageContext';

export function NotesView() {
    const { t } = useLanguage();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [noteContent, setNoteContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { getNoteForDate, saveNote, deleteNote } = useNotes();

    // Load note for selected date
    useEffect(() => {
        const note = getNoteForDate(selectedDate);
        setNoteContent(note?.content || '');
        setIsEditing(!note); // Default to edit mode if no note exists
    }, [selectedDate, getNoteForDate]);

    const handleSave = () => {
        if (noteContent.trim()) {
            saveNote(selectedDate, noteContent);
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        deleteNote(selectedDate);
        setNoteContent('');
        setIsEditing(true);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const startDay = getDay(monthStart);
    const paddingDays = startDay === 0 ? 6 : startDay - 1;

    const existingNote = getNoteForDate(selectedDate);

    return (
        <div className="space-y-6 animate-fade-in w-full max-w-lg mx-auto">
            {/* Header with cute icon */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{t('daily_notes')}</h3>
                    <p className="text-sm text-muted-foreground">{t('capture_thoughts')}</p>
                </div>
            </div>

            {/* Calendar for Date Selection */}
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
                <div className="text-center mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('select_date')}</h4>
                    <p className="text-xl font-semibold text-primary">
                        {format(selectedDate, 'MMMM d, yyyy')}
                    </p>
                </div>

                {/* Mini Calendar */}
                <div className="grid grid-cols-7 gap-1">
                    {[t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')].map(day => (
                        <div key={day} className="text-center text-[10px] font-bold text-muted-foreground/40 uppercase py-2">
                            {day}
                        </div>
                    ))}

                    {Array.from({ length: paddingDays }).map((_, i) => (
                        <div key={`pad-${i}`} />
                    ))}

                    {days.map((day, index) => {
                        const dayNum = day.getDate();
                        const isSelected = isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);
                        const hasNote = !!getNoteForDate(day);

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-all touch-feedback relative",
                                    isSelected && "bg-primary text-primary-foreground font-bold",
                                    !isSelected && isTodayDate && "border-2 border-primary text-primary font-bold",
                                    !isSelected && !isTodayDate && isSameMonth(day, currentMonth) && "text-foreground hover:bg-secondary",
                                    !isSameMonth(day, currentMonth) && "text-muted-foreground/30"
                                )}
                            >
                                {dayNum}
                                {hasNote && !isSelected && (
                                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Note Editor / Sticky Note Viewer */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {isEditing ? (
                    /* Standard App Editor Style */
                    <div className="bg-card rounded-2xl p-6 shadow-sm border-2 border-border/50 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">
                                    {format(selectedDate, 'EEEE, MMMM d')}
                                </span>
                            </div>
                            {existingNote && (
                                <span className="text-xs text-muted-foreground italic">
                                    {t('edit')}...
                                </span>
                            )}
                        </div>

                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder={t('write_thoughts_placeholder')}
                            className="w-full min-h-[250px] p-4 bg-background/50 rounded-xl border-2 border-border focus:border-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground/50 transition-all text-base leading-relaxed"
                            autoFocus
                        />

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={handleSave}
                                disabled={!noteContent.trim()}
                                className={cn(
                                    "px-8 py-3 rounded-xl font-semibold transition-all touch-feedback flex items-center gap-2",
                                    noteContent.trim()
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                <Save className="w-4 h-4" />
                                {t('save')}
                            </button>

                            {existingNote && (
                                <button
                                    onClick={handleDelete}
                                    className="p-3 rounded-xl bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all touch-feedback"
                                    title={t('delete')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Short & Cute Flat Sticky Note Viewer Style */
                    <div className="relative group mx-auto">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                            <div className="bg-white rounded-full p-1.5 shadow-sm border border-rose-100">
                                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                            </div>
                        </div>

                        <div className={cn(
                            "bg-background dark:bg-card/10 rounded-xl p-6 shadow-sm min-h-[140px] flex flex-col transition-all duration-300",
                            "border-2 border-border/50 relative overflow-hidden"
                        )}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/40 dark:bg-white/5 backdrop-blur-sm z-10" />

                            <div className="flex items-center justify-between mb-4 text-muted-foreground/40 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-medium">
                                        {format(selectedDate, 'EEEE, MMM d')}
                                    </span>
                                </div>
                                <span className="italic">
                                    {format(existingNote?.updatedAt || new Date(), 'h:mm a')}
                                </span>
                            </div>

                            <div className="w-full flex-1 text-lg leading-relaxed whitespace-pre-wrap text-foreground/80 py-2">
                                {noteContent}
                            </div>
                        </div>

                        <div className="flex gap-2 justify-center mt-4">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all touch-feedback flex items-center gap-2 text-sm font-medium"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                {t('edit')}
                            </button>

                            <button
                                onClick={handleDelete}
                                className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all touch-feedback"
                                title={t('delete')}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Cute motivational message */}
            <div className="flex items-center justify-center gap-3 py-4">
                <span className="text-2xl">📝</span>
                <p className="text-sm text-muted-foreground italic">
                    {t('every_day_story')}
                </p>
                <span className="text-primary">✨</span>
            </div>
        </div>
    );
}
