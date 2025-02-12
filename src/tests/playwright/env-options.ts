import { test as base } from "@playwright/test";
import { localListingId, localProfileId } from "./data.ts";

export type EnvOptions = {
  profileId: string;
  listingId: string;
  emailTeacher: string;
  emailStudent: string;
};

export const test = base.extend<EnvOptions>({
  // default values
  profileId: [localProfileId, { option: true }],
  listingId: [localListingId, { option: true }],
  emailTeacher: [localListingId, { option: true }],
  emailStudent: [localListingId, { option: true }],
});
