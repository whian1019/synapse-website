// Development log entries, shown on each project's detail page.
//
// This list is intentionally empty right now — there are no real
// development logs yet, so none are invented. Add entries here as real
// updates happen; the detail page picks them up automatically and shows an
// honest "no entries yet" message until then.
//
// Entry shape:
//   {
//     id: string,            // unique, e.g. 'neurolink-2026-01',
//     projectSlug: string,   // matches a project's `slug` in projects.js
//     date: string,          // 'YYYY-MM-DD'
//     title: string,
//     content: string,
//     media: { type: 'image' | 'video', src: string, alt: string } | null,
//   }

export const devlogs = [];

export const getDevlogsByProject = (slug) =>
  devlogs
    .filter((log) => log.projectSlug === slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
