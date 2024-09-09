import { test as base } from '@playwright/test';
import { localListingId, localProfileId } from './data';

export type EnvOptions = {
    profileId: string;
    listingId: string;
};

export const test = base.extend<EnvOptions>({
    // default values
    profileId: [localProfileId, { option: true }],
    listingId: [localListingId, { option: true }],
});