import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBrief, telegramLink, normalizeUsername, splitBrief } from '../brief.js';
test('A minimal order needs only names and the customer Telegram', () => {
  const brief = buildBrief({ from: 'June', to: 'Kai', telegram: '@june_23' });
  assert.ok(brief.includes('Customer Telegram / Yes destination: @june_23'));
  assert.ok(brief.includes('Use the original confession with my names.'));
  assert.ok(brief.includes('Song title: Best Part (original)'));
  assert.ok(brief.includes('Hey June,'));
  assert.ok(brief.includes('Photo 1, Photo 2, and sender avatar'));
  const link = new URL(telegramLink(brief));
  assert.equal(link.pathname, '/huurns'); assert.equal(link.searchParams.get('text'), brief);
});
test('Custom copy and special characters reach the fixed order recipient intact', () => {
  const message = 'I like you & your weird playlists. <3\nCoffee? ☕';
  const brief = buildBrief({ from: 'A', to: 'B', telegram: 'customer_9', message, song: 'Song & Artist', photos: 'https://example.com/album?a=1&b=2', notes: 'Please use blue.' });
  assert.ok(brief.includes(message)); assert.ok(brief.includes('Extra notes: Please use blue.'));
  const link = new URL(telegramLink(brief)); assert.equal(link.hostname, 't.me'); assert.equal(link.pathname, '/huurns'); assert.equal(link.searchParams.get('text'), brief);
});
test('The username is normalized without changing its letters', () => { assert.equal(normalizeUsername(' @June_23 '), 'June_23'); });
test('Only changed artwork fields are included and the Yes reply is customizable', () => {
  const brief = buildBrief({ from: 'A', to: 'B', telegram: 'abcde', reply: 'Yes, coffee with you!', 'note-artText': 'Thinking of you.', 'night-message': 'Stay up with me.' });
  assert.ok(brief.includes('Telegram message after Yes:\nYes, coffee with you!'));
  assert.ok(brief.includes('STICKY NOTE\nText on artwork: Thinking of you.'));
  assert.ok(brief.includes('LATE NIGHT\nOpened card message: Stay up with me.'));
  assert.equal(brief.includes('FLOWERS'), false);
});
test('Long Unicode briefs split without losing text or exceeding draft budgets', () => {
  const text = 'You & me ☕💕\n'.repeat(1800);
  const parts = splitBrief(text);
  assert.ok(parts.length > 1);
  assert.equal(parts.join(''), text);
  for (const part of parts) {
    assert.ok(part.length <= 3000);
    assert.ok(encodeURIComponent(part).length <= 6000);
    assert.equal(new URL(telegramLink(part)).searchParams.get('text'), part);
  }
});
