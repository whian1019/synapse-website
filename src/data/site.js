// Site-wide configuration values that are likely to change.
// Update the values here — nothing else in the codebase should hardcode
// them, so a swap only ever needs to happen in this one place.

// Official SYNAPSE inbox. Kept here (rather than inline in Contact.jsx) so
// the address only ever needs to change in one place.
export const CONTACT_EMAIL = 'synapse.studio.777@gmail.com';

// Placeholder production domain — used for canonical/OG URLs in index.html.
// Update index.html directly once a real domain is live (it can't read
// this file, since those tags are static HTML served before React runs).
export const SITE_URL = 'https://synapse-studio.example';
