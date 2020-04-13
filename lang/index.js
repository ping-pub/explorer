/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-28 21:13:04
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-04 17:34:13
 * @FilePath: \look-web\src\utils\lang\index.js
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import cn from './cn'
import en from './en'
import it from './it'
import fr from './fr'
import ru from './ru'

const messages = {
  en,
  cn,
  it,
  fr,
  ru
}

let lang = window.localStorage.getItem('lang')

if (!lang) {
  lang = window.navigator.language === 'zh-CN' ? 'cn' : window.navigator.language === 'it' ? 'it' : window.navigator.language === 'fr' ? 'fr' : window.navigator.language === 'ru' ? 'ru' : 'en'
}

const i18n = new VueI18n({
  locale: lang, // set locale
  messages,
})

export default i18n