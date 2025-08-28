import DOMPurify from 'dompurify';

export interface SanitizeOptions {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ALLOWED_URI_REGEXP?: RegExp;
  FORBID_TAGS?: string[];
  FORBID_ATTR?: string[];
  STRIP_IGNORE_TAG?: boolean;
  STRIP_IGNORE_TAG_BODY?: string[];
}

// Default security options
const DEFAULT_OPTIONS = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'div'
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'src', 'alt', 'width', 'height', 'class'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
  STRIP_IGNORE_TAG: true,
  STRIP_IGNORE_TAG_BODY: ['script', 'style', 'iframe', 'object', 'embed']
};

// Strict options for user-generated content
const STRICT_OPTIONS: SanitizeOptions = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
  ALLOWED_ATTR: [],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'a', 'img'],
  STRIP_IGNORE_TAG: true,
  STRIP_IGNORE_TAG_BODY: ['script', 'style', 'iframe', 'object', 'embed']
};

// Permissive options for trusted content
const PERMISSIVE_OPTIONS: SanitizeOptions = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'div',
    'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class', 'style', 'colspan', 'rowspan'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  STRIP_IGNORE_TAG: true
};

export class Sanitizer {
  private static instance: Sanitizer;
  private options: SanitizeOptions;

  private constructor(options: SanitizeOptions = DEFAULT_OPTIONS) {
    this.options = options;
  }

  static getInstance(options?: SanitizeOptions): Sanitizer {
    if (!Sanitizer.instance) {
      Sanitizer.instance = new Sanitizer(options);
    }
    return Sanitizer.instance;
  }

  // Sanitize HTML content
  sanitizeHtml(html: string, options?: SanitizeOptions): string {
    if (!html) return '';
    
    const sanitizeOptions = {
      ...this.options,
      ...options
    };

    try {
      return DOMPurify.sanitize(html, sanitizeOptions);
    } catch (error) {
      console.error('Sanitization error:', error);
      return '';
    }
  }

  // Sanitize text content (remove all HTML)
  sanitizeText(text: string): string {
    if (!text) return '';
    
    try {
      return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
    } catch (error) {
      console.error('Text sanitization error:', error);
      return '';
    }
  }

  // Sanitize URL
  sanitizeUrl(url: string): string {
    if (!url) return '';
    
    try {
      return DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i });
    } catch (error) {
      console.error('URL sanitization error:', error);
      return '';
    }
  }

  // Sanitize object properties recursively
  sanitizeObject<T>(obj: T, options?: SanitizeOptions): T {
    if (!obj) return obj;
    
    if (typeof obj === 'string') {
      return this.sanitizeHtml(obj, options) as T;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, options)) as T;
    }
    
    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value, options);
      }
      return sanitized as T;
    }
    
    return obj;
  }

  // Validate if content is safe
  isSafe(html: string, options?: SanitizeOptions): boolean {
    if (!html) return true;
    
    const sanitized = this.sanitizeHtml(html, options);
    return sanitized === html;
  }

  // Get sanitization statistics
  getSanitizationStats(html: string, options?: SanitizeOptions): {
    originalLength: number;
    sanitizedLength: number;
    removedTags: number;
    removedAttributes: number;
  } {
    const originalLength = html.length;
    const sanitized = this.sanitizeHtml(html, options);
    const sanitizedLength = sanitized.length;
    
    // Count removed tags (basic estimation)
    const originalTags = (html.match(/<[^>]+>/g) || []).length;
    const sanitizedTags = (sanitized.match(/<[^>]+>/g) || []).length;
    const removedTags = originalTags - sanitizedTags;
    
    // Count removed attributes (basic estimation)
    const originalAttrs = (html.match(/\s[a-zA-Z-]+=/g) || []).length;
    const sanitizedAttrs = (sanitized.match(/\s[a-zA-Z-]+=/g) || []).length;
    const removedAttributes = originalAttrs - sanitizedAttrs;
    
    return {
      originalLength,
      sanitizedLength,
      removedTags,
      removedAttributes
    };
  }
}

// Convenience functions
export const sanitizeHtml = (html: string, options?: SanitizeOptions): string => {
  return Sanitizer.getInstance().sanitizeHtml(html, options);
};

export const sanitizeText = (text: string): string => {
  return Sanitizer.getInstance().sanitizeText(text);
};

export const sanitizeUrl = (url: string): string => {
  return Sanitizer.getInstance().sanitizeUrl(url);
};

export const sanitizeObject = <T>(obj: T, options?: SanitizeOptions): T => {
  return Sanitizer.getInstance().sanitizeObject(obj, options);
};

export const isSafe = (html: string, options?: SanitizeOptions): boolean => {
  return Sanitizer.getInstance().isSafe(html, options);
};

// Pre-configured sanitizers
export const strictSanitizer = Sanitizer.getInstance(STRICT_OPTIONS);
export const permissiveSanitizer = Sanitizer.getInstance(PERMISSIVE_OPTIONS);
export const defaultSanitizer = Sanitizer.getInstance();

export default Sanitizer; 