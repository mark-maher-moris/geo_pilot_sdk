import { GEOPilotConfig, BlogDesignConfig, ThemeConfig } from '../types';

/**
 * Merges static theme configuration with dynamic design configuration
 * Dynamic design takes precedence over static theme
 */
export function mergeThemeConfig(
  staticConfig: GEOPilotConfig,
  dynamicDesign?: BlogDesignConfig | null
): GEOPilotConfig {
  if (!dynamicDesign) {
    return staticConfig;
  }

  const mergedTheme: ThemeConfig = {
    // Start with static theme config
    ...staticConfig.theme,
    
    // Override with dynamic design theme
    primaryColor: dynamicDesign.theme?.customColors?.primary || staticConfig.theme?.primaryColor,
    secondaryColor: dynamicDesign.theme?.customColors?.secondary || staticConfig.theme?.secondaryColor,
    fontFamily: dynamicDesign.typography?.fontFamily || staticConfig.theme?.fontFamily,
    layout: dynamicDesign.layout?.type || staticConfig.theme?.layout,
    
    // Component visibility settings
    showAuthor: dynamicDesign.components?.blogCard?.showAuthor ?? staticConfig.theme?.showAuthor,
    showDate: dynamicDesign.components?.blogCard?.showDate ?? staticConfig.theme?.showDate,
    showReadingTime: dynamicDesign.components?.blogCard?.showReadingTime ?? staticConfig.theme?.showReadingTime,
    showCategories: dynamicDesign.components?.blogCard?.showCategories ?? staticConfig.theme?.showCategories,
    showTags: dynamicDesign.components?.blogCard?.showTags ?? staticConfig.theme?.showTags,
    showExcerpt: dynamicDesign.components?.blogCard?.showExcerpt ?? staticConfig.theme?.showExcerpt,
    showFeaturedImage: dynamicDesign.components?.blogCard?.showImage ?? staticConfig.theme?.showFeaturedImage,
    
    // Custom CSS from dynamic design
    customCSS: dynamicDesign.customCSS || staticConfig.theme?.customCSS,
  };

  return {
    ...staticConfig,
    theme: mergedTheme,
    design: dynamicDesign
  };
}

/**
 * Gets CSS custom properties from design configuration
 */
export function getCSSVariables(design?: BlogDesignConfig | null): Record<string, string> {
  if (!design?.theme?.customColors) {
    return {};
  }

  const colors = design.theme.customColors as Record<string, string>;
  const vars: Record<string, string> = {
    '--primary-color': colors.primary,
    '--background-color': colors.background,
    '--text-color': colors.text,
    '--heading-color': colors.heading || colors.text,
  };
  // Include optional extras when present for backward compatibility
  if (colors.secondary) vars['--secondary-color'] = colors.secondary;
  if (colors.accent) vars['--accent-color'] = colors.accent;
  if (colors.surface) vars['--surface-color'] = colors.surface;
  if (colors.textSecondary) vars['--text-secondary-color'] = colors.textSecondary;
  if (colors.border) vars['--border-color'] = colors.border;
  if (colors.success) vars['--success-color'] = colors.success;
  if (colors.warning) vars['--warning-color'] = colors.warning;
  if (colors.error) vars['--error-color'] = colors.error;
  return vars;
}

/**
 * Gets font family CSS from typography configuration
 */
export function getFontFamilyCSS(design?: BlogDesignConfig | null): string {
  if (!design?.typography) {
    return 'Inter, system-ui, sans-serif';
  }

  const { fontFamily, headingFont, bodyFont } = design.typography;
  
  // Map font values to actual CSS font families
  const fontMap: Record<string, string> = {
    'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'inter': 'var(--font-inter), Inter, sans-serif',
    'roboto': 'var(--font-roboto), Roboto, sans-serif',
    'open-sans': 'var(--font-open-sans), "Open Sans", sans-serif',
    'lato': 'var(--font-lato), Lato, sans-serif',
    'montserrat': 'var(--font-montserrat), Montserrat, sans-serif',
    'playfair': 'var(--font-playfair), "Playfair Display", serif',
    'merriweather': 'var(--font-merriweather), Merriweather, serif',
    'fira-code': 'var(--font-fira-code), "Fira Code", monospace',
    'poppins': 'var(--font-poppins), Poppins, sans-serif',
    'nunito': 'var(--font-nunito), Nunito, sans-serif',
    'raleway': 'var(--font-raleway), Raleway, sans-serif',
    'oswald': 'var(--font-oswald), Oswald, sans-serif',
    'lora': 'var(--font-lora), Lora, serif',
    'crimson-text': 'var(--font-crimson-text), "Crimson Text", serif',
    'libre-baskerville': 'var(--font-libre-baskerville), "Libre Baskerville", serif',
    'source-code-pro': 'var(--font-source-code-pro), "Source Code Pro", monospace',
    'jetbrains-mono': 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
    'work-sans': 'var(--font-work-sans), "Work Sans", sans-serif',
    'georgia': 'Georgia, serif',
    'times-new-roman': '"Times New Roman", serif',
    'arial': 'Arial, sans-serif',
    'helvetica': 'Helvetica, sans-serif',
    'verdana': 'Verdana, sans-serif',
    'trebuchet-ms': '"Trebuchet MS", sans-serif',
    'courier-new': '"Courier New", monospace',
    'impact': 'Impact, sans-serif',
    'comic-sans': '"Comic Sans MS", cursive',
    'papyrus': 'Papyrus, fantasy'
  };
  
  // Use specific fonts if available, otherwise fallback to general fontFamily
  const headingFontFamily = fontMap[headingFont] || fontMap[fontFamily] || 'Inter, system-ui, sans-serif';
  const bodyFontFamily = fontMap[bodyFont] || fontMap[fontFamily] || 'Inter, system-ui, sans-serif';
  
  return `${headingFontFamily}, ${bodyFontFamily}`;
}

/**
 * Gets heading font family CSS from typography configuration
 */
export function getHeadingFontFamilyCSS(design?: BlogDesignConfig | null): string {
  if (!design?.typography) {
    return 'Inter, system-ui, sans-serif';
  }

  const { fontFamily, headingFont } = design.typography;
  
  // Map font values to actual CSS font families
  const fontMap: Record<string, string> = {
    'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'inter': 'var(--font-inter), Inter, sans-serif',
    'roboto': 'var(--font-roboto), Roboto, sans-serif',
    'open-sans': 'var(--font-open-sans), "Open Sans", sans-serif',
    'lato': 'var(--font-lato), Lato, sans-serif',
    'montserrat': 'var(--font-montserrat), Montserrat, sans-serif',
    'playfair': 'var(--font-playfair), "Playfair Display", serif',
    'merriweather': 'var(--font-merriweather), Merriweather, serif',
    'fira-code': 'var(--font-fira-code), "Fira Code", monospace',
    'poppins': 'var(--font-poppins), Poppins, sans-serif',
    'nunito': 'var(--font-nunito), Nunito, sans-serif',
    'raleway': 'var(--font-raleway), Raleway, sans-serif',
    'oswald': 'var(--font-oswald), Oswald, sans-serif',
    'lora': 'var(--font-lora), Lora, serif',
    'crimson-text': 'var(--font-crimson-text), "Crimson Text", serif',
    'libre-baskerville': 'var(--font-libre-baskerville), "Libre Baskerville", serif',
    'source-code-pro': 'var(--font-source-code-pro), "Source Code Pro", monospace',
    'jetbrains-mono': 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
    'work-sans': 'var(--font-work-sans), "Work Sans", sans-serif',
    'georgia': 'Georgia, serif',
    'times-new-roman': '"Times New Roman", serif',
    'arial': 'Arial, sans-serif',
    'helvetica': 'Helvetica, sans-serif',
    'verdana': 'Verdana, sans-serif',
    'trebuchet-ms': '"Trebuchet MS", sans-serif',
    'courier-new': '"Courier New", monospace',
    'impact': 'Impact, sans-serif',
    'comic-sans': '"Comic Sans MS", cursive',
    'papyrus': 'Papyrus, fantasy'
  };
  
  return fontMap[headingFont] || fontMap[fontFamily] || 'Inter, system-ui, sans-serif';
}

/**
 * Gets body font family CSS from typography configuration
 */
export function getBodyFontFamilyCSS(design?: BlogDesignConfig | null): string {
  if (!design?.typography) {
    return 'Inter, system-ui, sans-serif';
  }

  const { fontFamily, bodyFont } = design.typography;
  
  // Map font values to actual CSS font families
  const fontMap: Record<string, string> = {
    'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'inter': 'var(--font-inter), Inter, sans-serif',
    'roboto': 'var(--font-roboto), Roboto, sans-serif',
    'open-sans': 'var(--font-open-sans), "Open Sans", sans-serif',
    'lato': 'var(--font-lato), Lato, sans-serif',
    'montserrat': 'var(--font-montserrat), Montserrat, sans-serif',
    'playfair': 'var(--font-playfair), "Playfair Display", serif',
    'merriweather': 'var(--font-merriweather), Merriweather, serif',
    'fira-code': 'var(--font-fira-code), "Fira Code", monospace',
    'poppins': 'var(--font-poppins), Poppins, sans-serif',
    'nunito': 'var(--font-nunito), Nunito, sans-serif',
    'raleway': 'var(--font-raleway), Raleway, sans-serif',
    'oswald': 'var(--font-oswald), Oswald, sans-serif',
    'lora': 'var(--font-lora), Lora, serif',
    'crimson-text': 'var(--font-crimson-text), "Crimson Text", serif',
    'libre-baskerville': 'var(--font-libre-baskerville), "Libre Baskerville", serif',
    'source-code-pro': 'var(--font-source-code-pro), "Source Code Pro", monospace',
    'jetbrains-mono': 'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
    'work-sans': 'var(--font-work-sans), "Work Sans", sans-serif',
    'georgia': 'Georgia, serif',
    'times-new-roman': '"Times New Roman", serif',
    'arial': 'Arial, sans-serif',
    'helvetica': 'Helvetica, sans-serif',
    'verdana': 'Verdana, sans-serif',
    'trebuchet-ms': '"Trebuchet MS", sans-serif',
    'courier-new': '"Courier New", monospace',
    'impact': 'Impact, sans-serif',
    'comic-sans': '"Comic Sans MS", cursive',
    'papyrus': 'Papyrus, fantasy'
  };
  
  return fontMap[bodyFont] || fontMap[fontFamily] || 'Inter, system-ui, sans-serif';
}

/**
 * Gets responsive layout classes based on design configuration
 */
export function getLayoutClasses(design?: BlogDesignConfig | null): string {
  if (!design?.layout) {
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  }

  const { type, columns, spacing } = design.layout;
  
  const spacingClasses = {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
  };

  switch (type) {
    case 'list':
      return 'space-y-6';
    case 'masonry':
      return `columns-1 md:columns-2 lg:columns-${Math.min(columns, 3)} ${spacingClasses[spacing]}`;
    case 'mosaic':
      return `grid ${columnClasses[columns as keyof typeof columnClasses] || columnClasses[3]} ${spacingClasses[spacing]}`;
    case 'grid':
    default:
      return `grid ${columnClasses[columns as keyof typeof columnClasses] || columnClasses[3]} ${spacingClasses[spacing]}`;
  }
}

/**
 * Gets component visibility settings
 */
export function getComponentSettings(design?: BlogDesignConfig | null, component: 'blogCard' | 'blogPost' = 'blogCard') {
  if (!design?.components) {
    return {
      showAuthor: true,
      showDate: true,
      showReadingTime: true,
      showCategories: true,
      showTags: true,
      showExcerpt: true,
      showFeaturedImage: true,
      showShareButtons: true,
      showRelatedPosts: true
    };
  }

  const componentConfig = design.components[component];
  if (!componentConfig) {
    return {
      showAuthor: true,
      showDate: true,
      showReadingTime: true,
      showCategories: true,
      showTags: true,
      showExcerpt: true,
      showFeaturedImage: true,
      showShareButtons: true,
      showRelatedPosts: true
    };
  }

  // Handle different component types
  if (component === 'blogCard') {
    const blogCardConfig = componentConfig as any; // Type assertion for blog card config
    return {
      showAuthor: blogCardConfig.showAuthor ?? true,
      showDate: blogCardConfig.showDate ?? true,
      showReadingTime: blogCardConfig.showReadingTime ?? true,
      showCategories: blogCardConfig.showCategories ?? true,
      showTags: blogCardConfig.showTags ?? true,
      showExcerpt: blogCardConfig.showExcerpt ?? true,
      showFeaturedImage: blogCardConfig.showImage ?? true,
      showShareButtons: true, // Not applicable for blog cards
      showRelatedPosts: true  // Not applicable for blog cards
    };
  } else {
    const blogPostConfig = componentConfig as any; // Type assertion for blog post config
    return {
      showAuthor: blogPostConfig.showAuthor ?? true,
      showDate: blogPostConfig.showDate ?? true,
      showReadingTime: blogPostConfig.showReadingTime ?? true,
      showCategories: true, // Not applicable for blog posts
      showTags: true,       // Not applicable for blog posts
      showExcerpt: true,    // Not applicable for blog posts
      showFeaturedImage: true, // Not applicable for blog posts
      showShareButtons: blogPostConfig.showShareButtons ?? true,
      showRelatedPosts: blogPostConfig.showRelatedPosts ?? true
    };
  }
}

/**
 * Applies design configuration to a component's style
 */
export function applyDesignStyles(
  design?: BlogDesignConfig | null,
  baseStyles: React.CSSProperties = {}
): React.CSSProperties {
  const cssVariables = getCSSVariables(design);
  const fontFamily = getFontFamilyCSS(design);
  
  return {
    ...baseStyles,
    ...cssVariables,
    fontFamily,
    // Apply max width from layout if specified
    maxWidth: design?.layout?.maxWidth || baseStyles.maxWidth,
  };
}

/**
 * Applies heading font styles from design configuration
 */
export function applyHeadingFontStyles(
  design?: BlogDesignConfig | null,
  baseStyles: React.CSSProperties = {}
): React.CSSProperties {
  const cssVariables = getCSSVariables(design);
  const headingFontFamily = getHeadingFontFamilyCSS(design);
  
  return {
    ...baseStyles,
    ...cssVariables,
    fontFamily: headingFontFamily,
    // Apply max width from layout if specified
    maxWidth: design?.layout?.maxWidth || baseStyles.maxWidth,
  };
}

/**
 * Applies body font styles from design configuration
 */
export function applyBodyFontStyles(
  design?: BlogDesignConfig | null,
  baseStyles: React.CSSProperties = {}
): React.CSSProperties {
  const cssVariables = getCSSVariables(design);
  const bodyFontFamily = getBodyFontFamilyCSS(design);
  
  return {
    ...baseStyles,
    ...cssVariables,
    fontFamily: bodyFontFamily,
    // Apply max width from layout if specified
    maxWidth: design?.layout?.maxWidth || baseStyles.maxWidth,
  };
}
