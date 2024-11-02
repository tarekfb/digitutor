export type DbSubject = {
    id: number;
    title: string;
    alt_title: string | null | undefined;
}

export type Subject = {
    id: number;
    title: string;
    altTitle?: string;
}

export const formatSubject = (dbSubject: DbSubject): Subject => ({
    id: dbSubject.id,
    title: dbSubject.title,
    altTitle: dbSubject.alt_title || undefined,
});
