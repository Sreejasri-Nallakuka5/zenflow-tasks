import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Note {
    id: string;
    date: string; // YYYY-MM-DD format
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export function useNotes() {
    const queryClient = useQueryClient();

    const { data: notes = [] } = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const res = await fetch('/api/notes');
            if (!res.ok) throw new Error('Failed to fetch notes');
            const data = await res.json();
            return data.map((note: any) => ({
                ...note,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt),
            }));
        },
    });

    const saveNoteMutation = useMutation({
        mutationFn: async ({ date, content }: { date: string; content: string }) => {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, content }),
            });
            if (!res.ok) throw new Error('Failed to save note');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    const deleteNoteMutation = useMutation({
        mutationFn: async (date: string) => {
            const res = await fetch(`/api/notes/${date}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete note');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    const getNoteForDate = useCallback((date: Date): Note | undefined => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return notes.find((note: Note) => note.date === dateStr);
    }, [notes]);

    const saveNote = useCallback((date: Date, content: string) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        saveNoteMutation.mutate({ date: dateStr, content });
    }, [saveNoteMutation]);

    const deleteNote = useCallback((date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        deleteNoteMutation.mutate(dateStr);
    }, [deleteNoteMutation]);

    return {
        notes,
        getNoteForDate,
        saveNote,
        deleteNote,
    };
}
