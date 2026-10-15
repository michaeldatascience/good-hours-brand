export function stripTbd(value: string) {
  return value.replace(/TBD:\s*/gi, '');
}

export function tbdSegments(raw: string, draft: boolean) {
  if (!draft) return [{ tbd: false, text: stripTbd(raw) }];
  const out: { tbd: boolean; text: string }[] = [];
  const re = /TBD:\s*([^.]*)/gi;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw))) {
    if (match.index > last) out.push({ tbd: false, text: raw.slice(last, match.index) });
    out.push({ tbd: true, text: match[1].trim() });
    last = match.index + match[0].length;
  }
  if (last < raw.length) out.push({ tbd: false, text: raw.slice(last) });
  if (!out.length) out.push({ tbd: false, text: raw });
  return out;
}

export function formatUsd(amount: number) {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

export function savingsAmount(itemPrices: number[], bundlePrice: number) {
  const sum = itemPrices.reduce((total, price) => total + price, 0);
  return sum - bundlePrice;
}

export function mailHref(email: string) {
  return `mailto:${stripTbd(email)}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
