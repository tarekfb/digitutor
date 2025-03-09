export const getDisplayCredits = (credits: number, freeCredits: number): number => {
    if (credits > freeCredits) return freeCredits;
    else if (credits < 0) return 0;
    else return credits;
}
