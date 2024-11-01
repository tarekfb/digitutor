export type DbSubject = {
    id: string;
    title: string;
    alt_title: string | null | undefined;
}

export type Subject = {
    id: string;
    title: string;
    altTitle?: string;
}

export const formatSubject = (dbSubject: DbSubject): Subject => ({
    id: dbSubject.id,
    title: dbSubject.title,
    altTitle: dbSubject.alt_title || undefined,
});
