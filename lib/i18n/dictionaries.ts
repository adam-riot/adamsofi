import type { Locale } from "./config";
import ms, { type Dict } from "./dict/ms";
import en from "./dict/en";
import zh from "./dict/zh";

const dicts: Record<Locale, Dict> = { ms, en, zh };

export function getDict(locale: Locale): Dict {
  return dicts[locale] ?? ms;
}

export type { Dict };
