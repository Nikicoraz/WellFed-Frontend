import { createI18n } from 'vue-i18n'
import it from './localizations/it'
import en from './localizations/en'


export const i18n = createI18n({
    locale: 'it',
    fallbackLocale: 'en',
    messages: {
        it: it,
        en: en
    }
});