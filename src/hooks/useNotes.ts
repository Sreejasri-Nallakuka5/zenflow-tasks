import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export interface Note {
    id: string;
    date: string; // YYYY-MM-DD format
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const NOTES_STORAGE_KEY = 'zenflow-notes';

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);

    // Load notes from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(NOTES_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Convert date strings back to Date objects
                const notesWithDates = parsed.map((note: any) => ({
                    ...note,
                    createdAt: new Date(note.createdAt),
                    updatedAt: new Date(note.updatedAt),
                }));
                setNotes(notesWithDates);
            } catch (error) {
                console.error('Failed to parse notes from localStorage:', error);
            }
        }
    }, []);

    // Save notes to localStorage whenever they change
    const saveNotes = (updatedNotes: Note[]) => {
        setNotes(updatedNotes);
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    };

    const getNoteForDate = (date: Date): Note | undefined => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return notes.find(note => note.date === dateStr);
    };

    const saveNote = (date: Date, content: string) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const existingNote = getNoteForDate(date);

        if (existingNote) {
            // Update existing note
            const updatedNotes = notes.map(note =>
                note.id === existingNote.id
                    ? { ...note, content, updatedAt: new Date() }
                    : note
            );
            saveNotes(updatedNotes);
        } else {
            // Create new note
            const newNote: Note = {
                id: `note-${Date.now()}`,
                date: dateStr,
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            saveNotes([...notes, newNote]);
        }
    };

    const deleteNote = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const updatedNotes = notes.filter(note => note.date !== dateStr);
        saveNotes(updatedNotes);
    };

    return {
        notes,
        getNoteForDate,
        saveNote,
        deleteNote,
    };
}
