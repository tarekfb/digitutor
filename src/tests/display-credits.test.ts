import { getDisplayCredits } from "src/lib/shared/utils/credits/utils.ts";
import { describe, it, expect } from "vitest";

describe("getDisplayCredits", () => {
    it("should return freeCredits when credits is greater than freeCredits", () => {
        expect(getDisplayCredits(10, 5)).toBe(5);
    });

    it("should return 0 when credits is less than 0", () => {
        expect(getDisplayCredits(-5, 5)).toBe(0);
    });

    it("should return credits when credits is less than or equal to freeCredits", () => {
        expect(getDisplayCredits(3, 5)).toBe(3);
    });
});
