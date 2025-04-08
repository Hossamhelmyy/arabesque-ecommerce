# RTL Support in Arabesque E-commerce

This guide provides information on how we handle Right-to-Left (RTL) support in the Arabesque E-commerce application, which supports both English (LTR) and Arabic (RTL) languages.

## 1. Overview

The application is designed to fully support both Left-to-Right (LTR) and Right-to-Left (RTL) layouts. When the language is set to Arabic, the entire UI flips to RTL mode, including:

- Text alignment
- Layout direction
- Icon orientations
- Form inputs
- Navigation flows

Key features of our RTL implementation:

- Uses HTML `dir` attribute for global direction control
- Leverages Tailwind CSS for most RTL styling
- Provides helper components for directional elements
- Supports automatic font switching for Arabic

## 2. Language Context and Switching

RTL behavior is controlled by the `LanguageContext` which provides:

```tsx
export interface LanguageContextType {
  isRTL: boolean;
  toggleLanguage: () => void;
  changeLanguage: (language: string) => void;
  currentLanguage: string;
}
```

The `LanguageContext` automatically:

- Sets `isRTL` based on the current language
- Updates the `dir` attribute on the `<html>` element (`rtl` for Arabic, `ltr` for others)
- Updates the `lang` attribute on the `<html>` element
- Provides easy language switching methods

To use in components:

```tsx
import { useLanguage } from "@/context/LanguageContext";

function MyComponent() {
  const { isRTL, toggleLanguage, currentLanguage } = useLanguage();

  // Use isRTL for conditional rendering based on direction
  return (
    <div className={isRTL ? "text-right" : "text-left"}>
      {/* Component content */}
    </div>
  );
}
```

## 3. Tailwind CSS RTL Support

Our Tailwind configuration includes RTL variants that make directional styling easy:

### 3.1 Space Utilities

For flex and grid layouts, use `rtl:space-x-reverse` when using `space-x-*` utilities:

```html
<div class="flex space-x-4 rtl:space-x-reverse">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 3.2 Text Alignment

Use logical properties instead of directional ones:

✅ DO:

```html
<p class="text-start">This text aligns properly in both directions</p>
```

❌ DON'T:

```html
<p class="text-left">This won't flip in RTL mode</p>
```

### 3.3 Margin and Padding

Use logical properties or conditional classes:

```html
<!-- Preferred approach using logical properties -->
<div class="ms-4">This margin is on the start side (left in LTR, right in RTL)</div>

<!-- Alternative using conditionals -->
<div class="ml-4 rtl:ml-0 rtl:mr-4">This works too but is more verbose</div>
```

### 3.4 Icon Flipping

For icons that need to be flipped in RTL mode, use the `rtl-flip` utility class:

```html
<span class="rtl-flip">
  <ArrowRight />
</span>
```

## 4. DirectionalIcon Component

For directional elements like arrows, use the `DirectionalIcon` component:

```tsx
import { DirectionalIcon } from "@/components/ui/directional-icon";
import { ArrowLeft, ArrowRight } from "lucide-react";

<DirectionalIcon
  leftIcon={<ArrowLeft />}
  rightIcon={<ArrowRight />}
/>
```

This component automatically displays the correct icon based on the current language direction.

For simpler cases where you just need to flip a single icon, use the `FlippableIcon` component:

```tsx
import { FlippableIcon } from "@/components/ui/directional-icon";

<FlippableIcon icon={<ArrowRight />} />
```

## 5. Form Inputs and Text

### 5.1 Text Direction for Inputs

For inputs that should respect the text direction of the specific language:

```tsx
<Input
  dir="auto"  // Automatically detects direction based on content
  {...otherProps}
/>

// Or explicitly for Arabic content
<Input
  dir="rtl"
  {...otherProps}
/>
```

### 5.2 Displaying Multilingual Content

When displaying content that has translations:

```tsx
import { useLanguage } from "@/context/LanguageContext";

function ProductTitle({ product }) {
  const { isRTL } = useLanguage();

  return <h1>{isRTL && product.name_ar ? product.name_ar : product.name}</h1>;
}
```

### 5.3 Right-to-Left Form Layout

For form layouts, use grid or flex with appropriate RTL adaptations:

```tsx
<div className="grid grid-cols-2 gap-4">
  <FormField
    label={t("formField.firstName")}
    // Other props
  />
  <FormField
    label={t("formField.lastName")}
    // Other props
  />
</div>
```

## 6. Icon/Button Positioning

For absolute-positioned elements, use conditional positioning:

```tsx
<Button
  className={cn(
    "absolute top-2",
    isRTL ? "left-2" : "right-2"
  )}
>
  <X />
</Button>
```

## 7. Common Issues and Solutions

### 7.1 Icons Don't Flip Correctly

Make sure to use the `DirectionalIcon` component or `rtl-flip` utility.

### 7.2 Text Alignment Issues

Use `text-start` and `text-end` instead of `text-left` and `text-right`.

### 7.3 Spacing Problems

Add `rtl:space-x-reverse` when using `space-x-*` utilities.

### 7.4 Third-Party Components

For third-party components without RTL support, you may need to create wrapper components with additional RTL-specific styling.

### 7.5 RTL Testing

Always test your components in both LTR and RTL modes to ensure proper layout and functionality.

## 8. Translations

Translations for both languages are stored in:

- `src/i18n/locales/en.ts` (English)
- `src/i18n/locales/ar.ts` (Arabic)

Ensure all user-facing text is properly translated and accessed via the translation function:

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <p>{t("myComponent.message")}</p>;
}
```

## 9. Best Practices Summary

1. Use Tailwind's logical properties (`text-start` instead of `text-left`)
2. Add `rtl:space-x-reverse` to flex containers with `space-x-*`
3. Use the `DirectionalIcon` component for directional icons
4. Set proper `dir` attribute on multilingual inputs
5. Test all components in both LTR and RTL modes
6. Use conditional statements based on `isRTL` for complex layout changes
7. Use `cn()` utility for conditional class names based on RTL state
8. Position search icons properly in RTL mode (right side instead of left)

## 10. Component-Specific RTL Implementations

### 10.1 SearchBar Components

- For search inputs with icons, position the search icon on the right in RTL mode:

```tsx
<div className="relative">
  <Search
    className={cn(
      "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
      isRTL ? "right-3" : "left-3"
    )}
  />
  <Input
    placeholder={t("searchPlaceholder")}
    className={cn(
      "h-10 bg-background",
      isRTL ? "pr-9" : "pl-9"
    )}
  />
</div>
```

### 10.2 Product and Category Cards

- Badge positioning should adapt to RTL layout:

```tsx
<div className={cn(
  "absolute top-3 z-10 flex flex-col gap-2",
  isRTL ? "right-3" : "left-3"
)}>
  {/* Badge content */}
</div>
```

- Icon alignment in buttons should use conditional spacing:

```tsx
<Button>
  <ShoppingCart className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
  {t("addToCart")}
</Button>
```

### 10.3 File Upload Component

- Position remove buttons correctly in RTL mode:

```tsx
<button
  onClick={handleRemove}
  className={cn(
    "absolute p-1 rounded-full bg-black/60 text-white top-2",
    isRTL ? "left-2" : "right-2"
  )}
>
  <X className="h-4 w-4" />
</button>
```

### 10.4 Headers and Navigation

- Position elements correctly in navigation:

```tsx
<div className="flex items-center rtl:space-x-reverse gap-2">
  {/* Navigation items */}
</div>
```

- For icon-with-text patterns, use conditional classes:

```tsx
<h1 className="flex items-center rtl:space-x-reverse">
  <Icon className={cn("h-6 w-6", isRTL ? "ml-2" : "mr-2")} />
  {title}
</h1>
```

## 11. Recent RTL Improvements

The following components have been updated with enhanced RTL support:

1. **SearchBar Component** - Properly positioned search icon and input padding
2. **CategoriesPage Search** - Improved input and clear button positioning
3. **UserHeader Component** - Added proper icon alignment and search input support
4. **ProductCard Component** - Fixed badge positioning and button icon alignment
5. **FeaturedCategories Component** - Added proper text alignment and "View All" button with FlippableIcon
6. **File Upload Component** - Improved action button positioning for RTL layout

These improvements ensure consistent user experience across both LTR and RTL interfaces throughout the application.
