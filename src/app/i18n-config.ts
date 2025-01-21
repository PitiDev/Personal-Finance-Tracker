export const i18n = {
    defaultLocale: 'lo',
    locales: ['lo', 'en', 'th', 'jp'],
} as const

export type Locale = (typeof i18n)['locales'][number]

export const getDictionary = async (locale: Locale) => {
    const dictionary = await import(`../dictionaries/${locale}.json`)
    return dictionary
}