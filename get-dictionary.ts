import type { Locale } from './i18n-config'

const dictionaries = {
    en: () => import('./public/locales/en/common.json').then((module) => module.default),
    lo: () => import('./public/locales/lo/common.json').then((module) => module.default),
    th: () => import('./public/locales/th/common.json').then((module) => module.default),
    jp: () => import('./public/locales/jp/common.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
    if (!locale) {
        // console.error('Locale is undefined');
        return dictionaries['en']();
    }

    if (!(locale in dictionaries)) {
        console.error(`Dictionary for locale '${locale}' not found`);
        return dictionaries['en']();
    }

    return dictionaries[locale as keyof typeof dictionaries]();
}