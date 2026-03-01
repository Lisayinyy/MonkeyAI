import type { AppLanguage } from '../contexts/PortfolioContext';

type UITextKey =
  | 'nav_home'
  | 'nav_market'
  | 'nav_portfolio'
  | 'nav_insights'
  | 'nav_settings'
  | 'settings_title'
  | 'settings_subtitle'
  | 'page_portfolio'
  | 'page_daily_advice'
  | 'refresh'
  | 'refreshing'
  | 'preferences_title'
  | 'preferences_explanations'
  | 'preferences_explanations_desc'
  | 'preferences_language'
  | 'preferences_language_desc'
  | 'lang_en'
  | 'lang_zh'
  | 'edit'
  | 'confirm'
  | 'cancel';

const copy: Record<AppLanguage, Record<UITextKey, string>> = {
  en: {
    nav_home: 'Home',
    nav_market: 'Market',
    nav_portfolio: 'Portfolio',
    nav_insights: 'Insights',
    nav_settings: 'Settings',
    settings_title: 'Settings',
    settings_subtitle: 'Personalize your Monkey',
    page_portfolio: 'Portfolio',
    page_daily_advice: "Today's Investment Advice",
    refresh: 'Refresh',
    refreshing: 'Refreshing',
    preferences_title: 'Personal Agent Preferences',
    preferences_explanations: 'Detailed Explanations',
    preferences_explanations_desc: 'Show reasoning for all advice',
    preferences_language: 'Language',
    preferences_language_desc: 'Choose app display language',
    lang_en: 'English',
    lang_zh: '中文',
    edit: 'Edit',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  zh: {
    nav_home: '首页',
    nav_market: '市场',
    nav_portfolio: '持仓',
    nav_insights: '洞察',
    nav_settings: '设置',
    settings_title: '设置',
    settings_subtitle: '个性化你的 Monkey',
    page_portfolio: '持仓',
    page_daily_advice: '今日投资建议',
    refresh: '刷新',
    refreshing: '刷新中',
    preferences_title: '个人代理偏好',
    preferences_explanations: '详细解释',
    preferences_explanations_desc: '显示每条建议背后的原因',
    preferences_language: '语言',
    preferences_language_desc: '选择应用显示语言',
    lang_en: 'English',
    lang_zh: '中文',
    edit: '编辑',
    confirm: '确认',
    cancel: '取消',
  },
};

export function t(language: AppLanguage, key: UITextKey) {
  return copy[language][key] ?? copy.en[key];
}
