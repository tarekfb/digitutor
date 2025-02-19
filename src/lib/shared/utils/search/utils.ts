export const handleUndefinedInFormData = (data: {
    subjects: string;
    query?: string | undefined;
}): { subjects: string, query: string } => {
    // "undefined" check to prevent corner case issue in frontend
    let { query, subjects } = data;
    query = query?.trim();
    subjects = subjects?.trim();
    if (subjects === "undefined") subjects = "";
    if (!query || query === "undefined") query = "";
    return { subjects, query };
};

export const cleanQuery = (
    rawQuery: string,
    commaSeparatedSubjects: string,
    shouldEncode: boolean = false,
): string => {
    // trim and && "undefined" is for client side bug prevention
    let cleanedQuery: string = "";
    if (rawQuery && rawQuery !== "undefined")
        cleanedQuery = shouldEncode
            ? encodeURIComponent(rawQuery.trim())
            : rawQuery.trim();
    if (commaSeparatedSubjects && commaSeparatedSubjects !== "undefined")
        cleanedQuery += `${rawQuery ? " " : ""}${shouldEncode ? encodeURIComponent(commaSeparatedSubjects.trim()) : commaSeparatedSubjects.trim()}`;
    return cleanedQuery;
};

export const getQueryFromFormData = (data: {
    subjects: string;
    query?: string | undefined;
}, shouldEncode: boolean = false): string => {
    const { query, subjects } = handleUndefinedInFormData(data);
    if (!query && !subjects) return "";
    return cleanQuery(query, subjects, shouldEncode);
}