export interface TranslationDictionary {
  common: {
    [key: string]: string
  }
  auth: {
    [key: string]: string
  }
  navigation: {
    [key: string]: string
  }
  dashboard: {
    title: string
    subtitle: string
    welcome: string
    summary: string
    recentActivity: string
    quickActions: string
    stats: string
    viewAll: string
    noData: string
    loading: string
    instructions: string
    languageInfo: string
    enjoyMessage: string
    tools: {
      [key: string]: string
    }
  }
  settings: {
    [key: string]: string
  }
  errors: {
    [key: string]: string
  }
  ai: {
    [key: string]: string
  }
  fashion: {
    [key: string]: string
  }
  sidebar: {
    [key: string]: string
  }
}
