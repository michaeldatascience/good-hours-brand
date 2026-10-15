import fs from 'node:fs';
import { parse } from 'yaml';

function draftMode() {
  const file = new URL('../content/settings.yaml', import.meta.url);
  const settings = parse(fs.readFileSync(file, 'utf8'));
  return settings.draft === true;
}

function partsFor(text, draft) {
  if (!draft) return [{ type: 'text', value: text.replace(/TBD:\s*/gi, '') }];
  const out = [];
  const re = /TBD:\s*([^.]*)/gi;
  let last = 0;
  let match;
  while ((match = re.exec(text))) {
    if (match.index > last) out.push({ type: 'text', value: text.slice(last, match.index) });
    out.push({
      type: 'element',
      tagName: 'span',
      properties: { className: ['tbd'] },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['tbd-tag'] },
          children: [{ type: 'text', value: 'TBD' }],
        },
        { type: 'text', value: ` ${match[1].trim()}` },
      ],
    });
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out.length ? out : [{ type: 'text', value: text }];
}

function transform(parent, draft) {
  if (!parent?.children) return;
  for (let i = parent.children.length - 1; i >= 0; i -= 1) {
    const child = parent.children[i];
    if (child.type === 'element') {
      if (child.tagName === 'script' || child.tagName === 'style') continue;
      transform(child, draft);
    }
    if (child.type === 'text' && typeof child.value === 'string' && child.value.includes('TBD:')) {
      parent.children.splice(i, 1, ...partsFor(child.value, draft));
    }
  }
}

export function rehypeTbd() {
  return (tree) => {
    transform(tree, draftMode());
  };
}
