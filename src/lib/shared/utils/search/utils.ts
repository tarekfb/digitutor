import type { DbSearchResult } from "../../models/listing.ts";
import type { SearchResult, SortingSearchOption, SortMethod } from "../../models/search.ts";

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

export const sortByReviewCount: SortMethod = (list, ascending) =>
    list.sort((a, b) =>
        ascending ? a.reviewCount - b.reviewCount : b.reviewCount - a.reviewCount,
    );
export const sortByRating: SortMethod = (list, ascending) =>
    list.sort((a, b) =>
        ascending ? a.avgRating - b.avgRating : b.avgRating - a.avgRating,
    );
export const sortByPrice: SortMethod = (list, ascending) =>
    list.sort((a, b) =>
        ascending ? a.hourlyPrice - b.hourlyPrice : b.hourlyPrice - a.hourlyPrice,
    );

export const filterUniqueAndFormatSearchResults = (listings: DbSearchResult[]): SearchResult[] => {
    const filtered = listings.filter((value, index, self) =>
        self.findIndex((v) => v.id === value.id) === index
    );

    return filtered.map(formatSearchResult);
};

export const priceAsc = { ascending: true, id: "priceAsc", readable: "Billigast först", onSelect: sortByPrice };
export const priceDesc = { ascending: false, id: "priceDesc", readable: "Dyrast först", onSelect: sortByPrice };
export const reviewsAsc = { ascending: true, id: "reviewsAsc", readable: "Minst recensioner", onSelect: sortByReviewCount };
export const reviewsDesc = { ascending: false, id: "reviewsDesc", readable: "Flest recensioner", onSelect: sortByReviewCount };
export const ratingAsc = { ascending: true, id: "ratingAsc", readable: "Lägst betyg", onSelect: sortByRating };
export const ratingDesc = { ascending: false, id: "ratingDesc", readable: "Högst betyg", onSelect: sortByRating };
export const defaultSort = { ascending: false, id: "default", readable: "Sortera", onSelect: (list: SearchResult[]) => list };
export const sortSearchResults: SortingSearchOption[] = [priceAsc, priceDesc, ratingDesc, ratingAsc, reviewsDesc, reviewsAsc, defaultSort];