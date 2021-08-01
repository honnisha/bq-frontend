import { createI18n } from "vue3-i18n";
import yaml from 'js-yaml'
import enLang from './assets/translations/en.yml?raw'
import ruLang from './assets/translations/ru.yml?raw'

const messages = {
  en: yaml.load(enLang),
  ru: yaml.load(ruLang),
}

const i18n = createI18n({
  locale: "ru",
  messages: messages,
})

export default i18n;
