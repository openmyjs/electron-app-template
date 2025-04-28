// locales/i18n.ts
import { createI18n } from 'vue-i18n'
import en from './lang/en-us'
import zh from './lang/zh-cn'
// import en from './en-us'
// import zh from './zh-cn'
const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh', // 从本地存储获取语言设置，默认为中文
  fallbackLocale: 'en', // 备选语言
  globalInjection: true, // 全局注入 $t 方法
  messages: {
    en,
    zh
  },
  legacy: false
})

export default i18n
