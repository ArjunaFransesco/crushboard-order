import { sections } from './sections.js';
export function normalizeUsername(value) {
  return value.trim().replace(/^@/, '');
}
export function buildBrief(values) {
  const clean = key => String(values[key] || '').trim();
  const lines = ['CRUSHBOARD ORDER', '', `From: ${clean('from')}`, `For: ${clean('to')}`, `Customer Telegram / Yes destination: @${normalizeUsername(clean('telegram'))}`, '', 'Blank card fields follow the original; replace sender and recipient names everywhere.', '', 'Confession:', clean('message') || 'Use the original confession with my names.', '', 'Telegram message after Yes:', clean('reply') || `Hey ${clean('from')}, I saw your board, finished our little side quest, and yeah... I like you too. Let’s make that first date happen.\n\n${clean('to')}`, '', `Song title: ${clean('song') || 'Best Part (original)'}`];
  if (clean('headline')) lines.push('', `Main heading: ${clean('headline')}`);
  for (const section of sections) {
    const fields = [['heading', 'Card title'], ['caption', 'Caption'], ['artText', 'Text on artwork'], ['message', 'Opened card message']];
    const changes = fields.filter(([key]) => clean(`${section.id}-${key}`));
    if (!changes.length) continue;
    lines.push('', section.title.toUpperCase());
    for (const [key, label] of changes) lines.push(`${label}: ${clean(`${section.id}-${key}`)}`);
  }
  if (clean('photos')) lines.push('', `Photo folder: ${clean('photos')}`);
  else lines.push('', 'Photos and avatar: I’ll send Photo 1, Photo 2, and sender avatar in this chat as files.');
  if (clean('notes')) lines.push('', `Extra notes: ${clean('notes')}`);
  lines.push('', 'Style: original colorful Crushboard with animated cards, three games, Yes / No, and my Telegram destination.');
  return lines.join('\n');
}
export function splitBrief(text, maxCharacters = 3000, maxEncoded = 6000) {
  const chunks = []; let chunk = '', encoded = 0;
  for (const character of text) {
    const cost = encodeURIComponent(character).length;
    if (chunk && (chunk.length + character.length > maxCharacters || encoded + cost > maxEncoded)) { chunks.push(chunk); chunk = ''; encoded = 0; }
    chunk += character; encoded += cost;
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}
export function telegramLink(brief) {
  return `https://t.me/huurns?text=${encodeURIComponent(brief)}`;
}
