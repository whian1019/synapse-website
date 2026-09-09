// Site-wide configuration values that are likely to change.
// Update the values here — nothing else in the codebase should hardcode
// them, so a swap only ever needs to happen in this one place.

// Replace with the real inbox once one exists. Keeping it here (rather than
// inline in Contact.jsx) means the real address never needs to be pasted
// into multiple files, and search/replace across the codebase isn't needed
// to change it later.
export const CONTACT_EMAIL = 'hello@synapse-studio.example';

// Placeholder production domain — used for canonical/OG URLs in index.html.
// Update index.html directly once a real domain is live (it can't read
// this file, since those tags are static HTML served before React runs).
export const SITE_URL = 'https://synapse-studio.example';
