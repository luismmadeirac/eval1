import type { ILanguageOption, TLanguage } from "../types";

export const FALLBACK_LANGUAGE: TLanguage = "en";

export const SUPPORTED_LANGUAGES: ILanguageOption[] = [
  { label: "English", value: "en" },
  { label: "Portuguese", value: "pt" },
];

export const STORAGE_KEY = "userLanguage";
