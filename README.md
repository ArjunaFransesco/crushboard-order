# Crushboard orders

A short customer order form matching Crushboard's cream, pink, blue, yellow, and stationery aesthetic. Three required fields: sender, recipient, and customer Telegram username. All remaining fields are marked (opsional), including the confession, song title, custom Telegram reply after Yes, and text for nine existing assets. Blank artwork fields retain the original copy with customer names. Photo links and extra notes are tucked into an optional section.

The customer reviews a generated brief, then opens `https://t.me/huurns?text=...` and presses Send in Telegram. The customer username is included in the brief as the Yes-button destination; it never changes the order recipient. A plain GitHub Pages site cannot send messages or upload photos to a Telegram account automatically. Customers can attach photos, avatar, and audio in Telegram after sending their brief.

No backend, bot token, analytics, customer database, or local storage. No customer data is included in the public repository. All fonts and artwork are local. Serve the folder over HTTP to preview; GitHub Pages uses the root of the main branch. `.nojekyll` keeps the output as plain static files.

Run checks with `node --test tools/brief.test.mjs`. Long orders are split into numbered Telegram drafts to preserve the entire brief. Customers send each draft in order. Song selection only asks for a title; the MP3 is sent separately in Telegram.

Public form: https://arjunafransesco.github.io/crushboard-order/

Original demo: https://crushboard.pages.dev/

Self-hosted Geist is distributed under the SIL Open Font License. Its license is in `assets/OFL.txt`.
