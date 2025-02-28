import type { DbSearchResult } from "../../models/listing.ts";
import type { SearchResult, SortingSearchOption } from "../../models/search.ts";

const handleUndefinedInFormData = (data: {
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

const cleanQuery = (
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

export const formatSearchResult = ({
    id,
    title,
    description,
    subjects,
    hourly_price,
    profile_id,
    first_name,
    avatar_url,
    role,
    avg_rating,
    review_count
}: DbSearchResult): SearchResult => {
    return {
        id,
        title,
        description,
        hourlyPrice: hourly_price,
        subjects,
        avgRating: avg_rating,
        reviewCount: review_count,
        profile: {
            role: role,
            avatarUrl: avatar_url ?? undefined,
            firstName: first_name,
            id: profile_id,
        }
    };
};


export const filterUniqueAndFormatSearchResults = (listings: DbSearchResult[]): SearchResult[] => {
    const filtered = listings.filter((value, index, self) =>
        self.findIndex((v) => v.id === value.id) === index
    );

    return filtered.map(formatSearchResult);
};

const priceAsc: SortingSearchOption = { value: "price", ascending: true, id: "priceAsc", readable: "pris - stigande" };
const priceDesc: SortingSearchOption = { value: "price", ascending: false, id: "priceDesc", readable: "pris - fallande" };
const reviewsAsc: SortingSearchOption = { value: "rating", ascending: true, id: "reviewsAsc", readable: "recensioner - stigande" };
const reviewsDesc: SortingSearchOption = { value: "rating", ascending: false, id: "reviewsDesc", readable: "recensioner - fallande" };
const defaultSort: SortingSearchOption = { value: "default", ascending: false, id: "default", readable: "" };
export const sortSearchResults: SortingSearchOption[] = [priceAsc, priceDesc, reviewsAsc, reviewsDesc, defaultSort];