import { ref, watch, computed, type Ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { commonPinia } from '@renderer/store'
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
interface AppI18n {
  lang: Ref<string>
  AntDesignLang: ComputedRef<object>
  setLang: (params: string) => void
  t: any
}
export default function vueI18n(): AppI18n {
  const { locale, t } = useI18n()
  const pinia: any = commonPinia()

  const lang: Ref<string> = ref(localStorage.getItem('lang') || 'zh')

  // const AntDesignLang = ref(lang.value === 'zh' ? zhCN : enUS)

  /** 监听语言变化 并传递给pinia*/
  watch(
    () => locale.value,
    (newLocale, _oldLocale) => {
      // console.log(`Language changed from ${oldLocale} to ${newLocale}`)
      pinia.lang = newLocale
      lang.value = newLocale
      // console.log('lang.value', lang.value)
      // 在这里执行语言变化后的操作
    }
  )
  const setLang = (params: string): void => {
    localStorage.setItem('lang', params)
    lang.value = params
    locale.value = params
  }
  const AntDesignLang = computed(() => (lang.value === 'zh' ? zhCN : enUS))
  return {
    lang,
    AntDesignLang,
    setLang,
    t
  }
}
