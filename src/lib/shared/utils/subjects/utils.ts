import type { Subject } from "../../models/subject"

// Helper function to calculate the Levenshtein distance
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,     // deletion
                matrix[i][j - 1] + 1,     // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[a.length][b.length];
}

// Main function to check existence with Levenshtein distance
export const findSimilarSubjects = (subjectTitle: string, subjects: Subject[], threshold: number = 2): Subject[] => {
    const closeMatches: Subject[] = [];

    for (const subject of subjects) {
        const titleDistance = levenshteinDistance(subjectTitle.toLowerCase(), subject.title.toLowerCase());
        const altTitleDistance = subject.altTitle
            ? levenshteinDistance(subjectTitle.toLowerCase(), subject.altTitle.toLowerCase())
            : Infinity;

        if (titleDistance <= threshold || altTitleDistance <= threshold) {
            closeMatches.push(subject);
        }
    }

    return closeMatches;
};