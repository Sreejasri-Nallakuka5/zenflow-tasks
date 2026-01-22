import { useState, useEffect } from 'react';
import { Calendar, Save, Trash2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, isSameDay } from 'date-fns';
import { useNotes } from '@/hooks/useNotes';

export function NotesView() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [noteContent, setNoteContent] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { getNoteForDate, saveNote, deleteNote } = useNotes();

    // Load note for selected date
    useEffect(() => {
        const note = getNoteForDate(selectedDate);
        setNoteContent(note?.content || '');
    }, [selectedDate, getNoteForDate]);

    const handleSave = () => {
        if (noteContent.trim()) {
            saveNote(selectedDate, noteContent);
        }
    };

    const handleDelete = () => {
        deleteNote(selectedDate);
        setNoteContent('');
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const startDay = getDay(monthStart);
    const paddingDays = startDay === 0 ? 6 : startDay - 1;

    const existingNote = getNoteForDate(selectedDate);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with cute icon */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Daily Notes</h3>
                    <p className="text-sm text-muted-foreground">Capture your thoughts</p>
                </div>
            </div>

            {/* Calendar for Date Selection */}
            <div className="bg-card rounded-2xl p-4">
                <div className="text-center mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Select a Date</h4>
                    <p className="text-xl font-semibold text-primary">
                        {format(selectedDate, 'MMMM d, yyyy')}
                    </p>
                </div>

                {/* Mini Calendar */}
                <div className="grid grid-cols-7 gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="text-center text-xs text-muted-foreground py-2">
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
                                    isSelected && "bg-primary text-primary-foreground",
                                    !isSelected && isTodayDate && "border-2 border-primary text-primary",
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

            {/* Note Editor */}
            <div className="bg-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                            {format(selectedDate, 'EEEE, MMMM d')}
                        </span>
                    </div>
                    {existingNote && (
                        <span className="text-xs text-muted-foreground">
                            Last edited: {format(existingNote.updatedAt, 'h:mm a')}
                        </span>
                    )}
                </div>

                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write your thoughts, goals, or reflections for this day..."
                    className="w-full min-h-[200px] p-4 bg-background rounded-xl border-2 border-border focus:border-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground transition-colors"
                />

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleSave}
                        disabled={!noteContent.trim()}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all touch-feedback",
                            noteContent.trim()
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        <Save className="w-4 h-4" />
                        Save Note
                    </button>

                    {existingNote && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all touch-feedback"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Cute motivational message */}
            <div className="flex items-center justify-center gap-3 py-4">
                <span className="text-2xl">📝</span>
                <p className="text-sm text-muted-foreground italic">
                    Every day is a new page in your story
                </p>
                <span className="text-primary">✨</span>
            </div>
        </div>
    );
}
