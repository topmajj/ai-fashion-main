# Translation System for AI Fashion App

This translation system allows you to easily add multilingual support to your AI Fashion application. Currently, it supports English (en) and Arabic (ar) languages.

## How to Use

### 1. Add the I18nProvider to your app

Wrap your application or specific pages with the `I18nProvider`:

\`\`\`jsx
import { I18nProvider } from "@/context/i18n-context";

export default function Layout({ children }) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  );
}
\`\`\`

### 2. Use the Language Selector Component

Add the language selector component to your UI:

\`\`\`jsx
import { LanguageSelector, LanguageToggle } from "@/components/language-selector";

// Use the dropdown selector
<LanguageSelector />

// Or use the simple toggle button
<LanguageToggle />
\`\`\`

### 3. Use translations in your components

\`\`\`jsx
import { useI18n } from "@/context/i18n-context";

export function MyComponent() {
  const { t, locale, setLocale } = useI18n();
  
  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>{t("dashboard.welcome")}</p>
      
      {/* Conditional rendering based on language */}
      {locale === "ar" ? (
        <p>محتوى خاص باللغة العربية</p>
      ) : (
        <p>Content specific to English</p>
      )}
      
      {/* Manually change language */}
      <button onClick={() => setLocale("ar")}>Switch to Arabic</button>
    </div>
  );
}
\`\`\`

### 4. Add RTL support for Arabic

The I18nProvider automatically adds the `dir="rtl"` attribute to the HTML element when Arabic is selected. You can use this to apply RTL-specific styles:

\`\`\`css
[dir="rtl"] .some-element {
  margin-right: 0;
  margin-left: 1rem;
}
\`\`\`

### 5. Adding new translations

To add new translations, update the translation files in `translations/en.ts` and `translations/ar.ts`.

## Structure

- `context/i18n-context.tsx` - React context provider for translations
- `translations/en.ts` - English translations
- `translations/ar.ts` - Arabic translations
- `components/language-selector.tsx` - UI components for language selection
- `lib/i18n.ts` - Utility functions for translations
- `types/i18n.ts` - TypeScript types for the translation system

## Adding More Languages

To

I've created a solution that adds the language selector to the dashboard header without modifying any existing files. Here's what I've done:

1. Created a `layout-with-language.tsx` component that wraps the existing layout component and injects the language toggle into the header area.

2. Created a `dashboard/layout-with-language.tsx` file that demonstrates how to use this wrapper in the dashboard area.

3. Added a sample page at `/dashboard/with-language` that uses this layout.

4. Updated the translation files to include new keys for the dashboard.

5. Created a script that can be used to inject the language toggle into the header without modifying the original files.

To use this solution:

1. You can navigate to `/dashboard/with-language` to see the language toggle in action.

2. To apply this to other pages without modifying existing files, you can:
   - Create new page components that use the `layout-with-language.tsx` component
   - Use the script to inject the language toggle into the header at runtime

This approach ensures that we don't modify any existing files while still adding the language selector functionality to the dashboard header.
