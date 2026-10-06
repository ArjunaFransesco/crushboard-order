import { normalizeUsername, buildBrief, telegramLink, splitBrief } from './brief.js';
import { sections } from './sections.js';
const form = document.querySelector('#order-form');
const review = document.querySelector('#review');
const error = document.querySelector('#form-error');
const username = document.querySelector('#telegram');
let draft = '', parts = [];
const cards = document.querySelector('#card-fields');
for (const section of sections) {
  const details = document.createElement('details'); details.className = 'asset-section';
  const summary = document.createElement('summary');
  if (section.preview) { const image = document.createElement('img'); image.src = `./assets/${section.preview}.svg`; image.alt = ''; image.loading = 'lazy'; image.width = 56; image.height = 65; summary.append(image); }
  else { const number = document.createElement('span'); number.className = 'photo-number'; number.textContent = section.id === 'cafe' ? '01' : '02'; summary.append(number); }
  const text = document.createElement('span'); text.className = 'asset-summary';
  const title = document.createElement('strong'); title.textContent = section.title;
  const hint = document.createElement('span'); hint.textContent = section.hint;
  text.append(title, hint); summary.append(text); details.append(summary);
  const body = document.createElement('div'); body.className = 'asset-fields';
  for (const [key, title, multiline] of [['heading', 'Card title', false], ['caption', 'Small caption', false], ['artText', 'Words on the artwork', true], ['message', 'Message when opened', true]]) {
    if (key === 'artText' && !section.artText) continue;
    const label = document.createElement('label'); label.append(document.createTextNode(`${title} `));
    const optional = document.createElement('span'); optional.className = 'optional'; optional.textContent = '(opsional)'; label.append(optional);
    const field = document.createElement(multiline ? 'textarea' : 'input'); field.name = `${section.id}-${key}`; field.id = field.name; field.placeholder = section[key]; field.maxLength = key === 'message' ? 600 : key === 'artText' ? 350 : 100;
    if (multiline) field.rows = key === 'artText' ? 3 : 4;
    label.append(field); body.append(label);
  }
  details.append(body); cards.append(details);
}
form.addEventListener('input', () => { error.hidden = true; username.setCustomValidity(''); });
form.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  if (!values.from.trim() || !values.to.trim()) {
    error.textContent = 'Add both names so we know who this little board is for.'; error.hidden = false;
    document.querySelector(!values.from.trim() ? '#from' : '#to').focus(); return;
  }
  values.telegram = normalizeUsername(values.telegram);
  if (!/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(values.telegram)) {
    error.textContent = 'Enter a Telegram username using 5 to 32 letters, numbers, or underscores. Start with a letter.';
    error.hidden = false; username.setCustomValidity(error.textContent); username.reportValidity(); username.focus(); return;
  }
  if (!form.reportValidity()) return;
  draft = buildBrief(values);
  parts = splitBrief(draft);
  document.querySelector('#brief-preview').textContent = draft;
  const send = document.querySelector('#telegram-send'); send.href = telegramLink(parts[0]);
  send.textContent = parts.length === 1 ? 'Send via Telegram ♥' : `Send message 1 / ${parts.length} via Telegram`;
  document.querySelector('#review-help').textContent = parts.length === 1 ? 'Give it a quick look, then send it over.' : `Your brief is split into ${parts.length} short messages. Send each one below, in order, so nothing gets cut off.`;
  const links = document.querySelector('#message-parts'); links.replaceChildren();
  parts.slice(1).forEach((part, index) => {
    const row = document.createElement('div'); row.className = 'part-row';
    const link = document.createElement('a'); link.href = telegramLink(part); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = `Send message ${index + 2} / ${parts.length}`;
    const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = `Copy ${index + 2}`; copy.addEventListener('click', () => copyMessage(part, index + 2));
    row.append(link, copy); links.append(row);
  });
  document.querySelector('#copy-brief').textContent = parts.length > 1 ? 'Copy first message' : 'Copy message';
  document.querySelector('#copy-status').textContent = '';
  form.hidden = true; document.querySelector('.card-heading').hidden = true;
  review.hidden = false; review.focus();
});
document.querySelector('#edit-brief').addEventListener('click', () => {
  review.hidden = true; form.hidden = false; document.querySelector('.card-heading').hidden = false;
  document.querySelector('#from').focus();
});
async function copyMessage(text, number = 1) {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(text); status.textContent = `Message ${number} copied. Paste it into your chat with @huurns.`; }
  catch {
    const preview = document.querySelector('#brief-preview'); preview.textContent = text;
    const range = document.createRange(); range.selectNodeContents(preview);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'Select and copy the highlighted message, then paste it into Telegram.';
  }
}
document.querySelector('#copy-brief').addEventListener('click', () => copyMessage(parts[0] || draft));
