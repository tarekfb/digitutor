import { describe, it, expect } from "vitest";
import { detectSocials, containsEmail, containsPhoneNumber, containsUrl } from 'src/lib/shared/utils/detect-socials/utils.ts';

describe("Social Detection Functions", () => {
    describe("containsEmail", () => {
        it("should return true for valid email addresses", () => {
            expect(containsEmail("user@example.com")).toBe(true);
            expect(containsEmail("This is my email: john.doe@company.co.uk")).toBe(true);
            expect(containsEmail("Contact us at support@domain.org for help")).toBe(true);
            expect(containsEmail("user.name+tag@example-site.io")).toBe(true);
        });

        it("should return false for invalid email addresses", () => {
            expect(containsEmail("plaintext")).toBe(false);
            expect(containsEmail("missing@domain")).toBe(false);
            expect(containsEmail("user@.com")).toBe(false);
            expect(containsEmail("@domain.com")).toBe(false);
            expect(containsEmail("user@")).toBe(false);
        });
    });

    describe("containsPhoneNumber", () => {
        it("should return true for valid phone numbers in various formats", () => {
            expect(containsPhoneNumber("(123) 456-7890")).toBe(true);
            expect(containsPhoneNumber("Call me at 123-456-7890")).toBe(true);
            expect(containsPhoneNumber("123.456.7890")).toBe(true);
            expect(containsPhoneNumber("+1 123 456 7890")).toBe(true);
            expect(containsPhoneNumber("My number is 1234567890")).toBe(true);
        });

        it("should return false for invalid phone numbers", () => {
            expect(containsPhoneNumber("No numbers here")).toBe(false);
            expect(containsPhoneNumber("12345")).toBe(false);
            expect(containsPhoneNumber("abc-def-ghij")).toBe(false);
        });
    });

    describe("containsUrl", () => {
        it("should return true for valid URLs in various formats", () => {
            expect(containsUrl("https://example.com")).toBe(true);
            expect(containsUrl("Visit http://website.co.uk/page for more info")).toBe(true);
            expect(containsUrl("www.mysite.org")).toBe(true);
            expect(containsUrl("Check domain.io/path?query=string#hash for details")).toBe(true);
            expect(containsUrl("example.com")).toBe(true);
        });

        it("should return false for invalid URLs", () => {
            expect(containsUrl("Not a website")).toBe(false);
            expect(containsUrl("https://")).toBe(false);
            expect(containsUrl("www.")).toBe(false);
        });
    });

    describe("detectSocials", () => {
        it("should return 'email' when text contains an email address", () => {
            expect(detectSocials("Contact us at support@example.com")).toBe("email");
        });

        it("should return 'phone' when text contains a phone number", () => {
            expect(detectSocials("Call our helpline at (123) 456-7890")).toBe("phone");
        });

        it("should return 'url' when text contains a URL", () => {
            expect(detectSocials("Visit our website at https://example.com")).toBe("url");
        });

        it("should return undefined when no social identifiers are found", () => {
            expect(detectSocials("Plain text with no contact information. Testing /word")).toBe(undefined);
        });
    });
});