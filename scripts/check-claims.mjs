import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const root = process.cwd();

const phrasePatterns = [
  'pain[\\s-]+reliefs?',
  'medical[\\s-]+grades?',
  'clinically[\\s-]+proven',
  'doctor[\\s-]+recommended',
  'fda[\\s-]+approved',
  'fda[\\s-]+cleared',
  'hair[\\s-]+growths?',
  'weight[\\s-]+loss(?:es)?',
  'fat[\\s-]+loss(?:es)?',
  'cellular[\\s-]+repairs?',
];

const wordPattern =
  '\\b(?:treat(?:s|ed|ing|ment|ments)?|cure[sd]?|heal(?:s|ed|ing|ings)?|inflammations?|arthritis|injur(?:y|ies)|clinical(?:ly)?|collagen|wrinkles?|acne|detox(?:es|ed|ing)?|immunity|mitochondria(?:l)?)\\b';

const phraseRe = new RegExp(`\\b(?:${phrasePatterns.join('|')})\\b`, 'gi');
const wordRe = new RegExp(wordPattern, 'gi');
const dashRe = /[\u2013\u2014]|&ndash;|&mdash;|&#8211;|&#8212;|&#x2013;|&#x2014;/gi;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function stripDisclaimer(text) {
  const folded = text.replace(/wellnessDisclaimer:\s*>-?\r?\n(?:[ \t].*(?:\r?\n|$))*/g, 'wellnessDisclaimer: ""\n');
  return folded.replace(/wellnessDisclaimer:\s*(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|[^\n]*)/g, 'wellnessDisclaimer: ""');
}

function scan(rel, text) {
  const hits = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const lineNo = index + 1;
    let rest = line;
    phraseRe.lastIndex = 0;
    const phrases = rest.match(phraseRe) ?? [];
    for (const found of phrases) {
      hits.push({ rel, lineNo, word: found.toLowerCase() });
    }
    rest = rest.replace(phraseRe, ' ');
    wordRe.lastIndex = 0;
    const words = rest.match(wordRe) ?? [];
    for (const found of words) {
      hits.push({ rel, lineNo, word: found.toLowerCase() });
    }
    dashRe.lastIndex = 0;
    const dashes = line.match(dashRe) ?? [];
    for (const found of dashes) {
      hits.push({ rel, lineNo, word: found });
    }
  });
  return hits;
}

const files = [
  ...walk(path.join(root, 'src/content')),
  ...walk(path.join(root, 'src')).filter((file) => file.endsWith('.astro')),
];

const hits = [];
for (const file of files) {
  const rel = path.relative(root, file);
  let text = fs.readFileSync(file, 'utf8');
  if (rel.replaceAll('\\', '/') === 'src/content/settings.yaml') {
    text = stripDisclaimer(text);
  }
  hits.push(...scan(rel, text));
}

if (hits.length) {
  console.error('Claim check failed. Banned words or dashes:\n');
  for (const hit of hits) {
    console.error(`${hit.rel}:${hit.lineNo}: ${hit.word}`);
  }
  process.exit(1);
}

console.log('Claim check passed.');

const settingsPath = path.join(root, 'src/content/settings.yaml');
const settings = parse(fs.readFileSync(settingsPath, 'utf8'));
if (settings.draft === false) {
  const tbds = [];
  for (const file of walk(path.join(root, 'src/content'))) {
    const rel = path.relative(root, file);
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (line.includes('TBD:')) tbds.push(`${rel}:${index + 1}: ${line.trim()}`);
    });
  }
  if (tbds.length) {
    console.log('\nDraft mode is off. TBD values still in content:\n');
    for (const line of tbds) console.log(line);
  } else {
    console.log('Draft mode is off. No TBD values left in content.');
  }
}
