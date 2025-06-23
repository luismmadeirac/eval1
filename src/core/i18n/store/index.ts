import IntlMessageFormat from "intl-messageformat";
import get from "lodash/get";
import merge from "lodash/merge";
import { makeAutoObservable, runInAction } from "mobx";
import coreEn from "../locales/en/core.json";
import corePt from "../locales/pt/core.json";
import type { ILanguageOption, ITranslations, TLanguage } from "../types";
import { FALLBACK_LANGUAGE, STORAGE_KEY, SUPPORTED_LANGUAGES } from "../constants/lenguage";

export class TranslationStore {

    private coreTranslations: ITranslations = {
        en: coreEn,
        pt: corePt,
    };

    private translations: ITranslations = {};
    private messageCache: Map<string, IntlMessageFormat> = new Map();
    currentLocale: TLanguage = FALLBACK_LANGUAGE;
    isLoading: boolean = true;
    isInitialized: boolean = false;
    private loadedLanguages: Set<TLanguage> = new Set();


    constructor() {
        makeAutoObservable(this);
        this.translations = this.coreTranslations;
        this.initializeLanguage();
        this.loadTranslations();
    }

    private initializeLanguage() {
        if (typeof window === "undefined") return;

        const savedLocale = localStorage.getItem(STORAGE_KEY) as TLanguage;
        if (this.isValidLanguage(savedLocale)) {
            this.setLanguage(savedLocale);
            return;
        }

        const browserLang = this.getBrowserLanguage();
        this.setLanguage(browserLang);
    }

    private async loadTranslations(): Promise<void> {
        try {
            runInAction(() => {
                this.isInitialized = true;
            });

            await this.loadPrimaryLanguages();

            this.loadRemainingLanguages();
        } catch (error) {

            console.error("Failed in translation initialization:", error);

            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    private async loadPrimaryLanguages(): Promise<void> {
        try {
            const languagesToLoad = new Set<TLanguage>([this.currentLocale]);
            if (this.currentLocale !== FALLBACK_LANGUAGE) {
                languagesToLoad.add(FALLBACK_LANGUAGE);
            }
            const loadPromises = Array.from(languagesToLoad).map((lang) => this.loadLanguageTranslations(lang));
            await Promise.all(loadPromises);
            runInAction(() => {
                this.isLoading = false;
            });
        } catch (error) {
            console.error("Failed to load primary languages:", error);
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    private loadRemainingLanguages(): void {
        const remainingLanguages = SUPPORTED_LANGUAGES.map((lang) => lang.value).filter(
            (lang) =>
                !this.loadedLanguages.has(lang as TLanguage) && lang !== this.currentLocale && lang !== FALLBACK_LANGUAGE
        );
        Promise.all(remainingLanguages.map((lang) => this.loadLanguageTranslations(lang as TLanguage))).catch((error) => {
            console.error("Failed to load some remaining languages:", error);
        });
    }

    private async loadLanguageTranslations(language: TLanguage): Promise<void> {
        if (this.loadedLanguages.has(language)) return;

        try {
            const translations = await this.importLanguageFile(language);
            runInAction(() => {
                this.translations[language] = merge({}, this.coreTranslations[language] || {}, translations.default);
                this.loadedLanguages.add(language);
                this.messageCache.clear();
            });
        } catch (error) {
            console.error(`Failed to load translations for ${language}:`, error);
        }
    }

    private importLanguageFile(language: TLanguage): Promise<any> {
        switch (language) {
            case "en":
                return import("../locales/en/translations.json");
            case "pt":
                return import("../locales/pt/translations.json");
            default:
                throw new Error(`Unsupported language: ${language}`);
        }
    }

    private isValidLanguage(lang: string | null): lang is TLanguage {
        return lang !== null && this.availableLanguages.some((l) => l.value === lang);
    }

    private findSimilarLanguage(lang: string): TLanguage | null {
        const normalizedLang = lang.toLowerCase();

        const similarLang = this.availableLanguages.find(
            (l) => normalizedLang.includes(l.value.toLowerCase()) || l.value.toLowerCase().includes(normalizedLang)
        );

        return similarLang ? similarLang.value : null;
    }

    private getBrowserLanguage(): TLanguage {
        const browserLang = navigator.language;

        if (this.isValidLanguage(browserLang)) {
            return browserLang;
        }

        const baseLang = browserLang.split("-")[0];
        if (this.isValidLanguage(baseLang)) {
            return baseLang as TLanguage;
        }
        const similarLang = this.findSimilarLanguage(browserLang) || this.findSimilarLanguage(baseLang);

        return similarLang || FALLBACK_LANGUAGE;
    }

    private getCacheKey(key: string, locale: TLanguage): string {
        return `${locale}:${key}`;
    }

    private getMessageInstance(key: string, locale: TLanguage): IntlMessageFormat | null {
        const cacheKey = this.getCacheKey(key, locale);

        if (this.messageCache.has(cacheKey)) {
            return this.messageCache.get(cacheKey) || null;
        }

        const message = get(this.translations[locale], key);
        if (!message) return null;

        try {
            const formatter = new IntlMessageFormat(message as any, locale);
            this.messageCache.set(cacheKey, formatter);
            return formatter;
        } catch (error) {
            console.error(`Failed to create message formatter for key "${key}":`, error);
            return null;
        }
    }

    t(key: string, params?: Record<string, any>): string {
        try {
            let formatter = this.getMessageInstance(key, this.currentLocale);

            if (!formatter && this.currentLocale !== FALLBACK_LANGUAGE) {
                formatter = this.getMessageInstance(key, FALLBACK_LANGUAGE);
            }

            if (formatter) {
                return formatter.format(params || {}) as string;
            }

            return key;
        } catch (error) {
            console.error(`Translation error for key "${key}":`, error);
            return key;
        }
    }

    async setLanguage(lng: TLanguage): Promise<void> {
        try {
            if (!this.isValidLanguage(lng)) {
                throw new Error(`Invalid language: ${lng}`);
            }

            if (!this.loadedLanguages.has(lng)) {
                await this.loadLanguageTranslations(lng);
            }

            if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEY, lng);
                document.documentElement.lang = lng;
            }

            runInAction(() => {
                this.currentLocale = lng;
                this.messageCache.clear(); // Clear cache when language changes
            });
        } catch (error) {
            console.error("Failed to set language:", error);
        }
    }


    get availableLanguages(): ILanguageOption[] {
        return SUPPORTED_LANGUAGES;
    }
}
