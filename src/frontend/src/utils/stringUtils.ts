// String utilities for the Securet Flow SSC application

export interface StringCaseOptions {
  preserveAcronyms?: boolean;
  separator?: string;
}

export interface TruncateOptions {
  length: number;
  suffix?: string;
  preserveWords?: boolean;
  separator?: string;
}

export interface SlugifyOptions {
  separator?: string;
  lowercase?: boolean;
  removeSpecialChars?: boolean;
}

// Convert string to different cases
export function toCamelCase(str: string, options: StringCaseOptions = {}): string {
  const { preserveAcronyms = true, separator = /[\s\-_]+/ } = options;
  
  return str
    .split(separator)
    .map((word, index) => {
      if (index === 0) {
        return preserveAcronyms && word.toUpperCase() === word 
          ? word.toLowerCase() 
          : word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

export function toPascalCase(str: string, options: StringCaseOptions = {}): string {
  const { preserveAcronyms = true, separator = /[\s\-_]+/ } = options;
  
  return str
    .split(separator)
    .map(word => {
      if (preserveAcronyms && word.toUpperCase() === word) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

export function toSnakeCase(str: string, options: StringCaseOptions = {}): string {
  const { separator = '_' } = options;
  
  return str
    .replace(/([A-Z])/g, `${separator}$1`)
    .replace(/[\s\-_]+/g, separator)
    .toLowerCase()
    .replace(new RegExp(`^${separator}`), '');
}

export function toKebabCase(str: string, options: StringCaseOptions = {}): string {
  const { separator = '-' } = options;
  
  return str
    .replace(/([A-Z])/g, `${separator}$1`)
    .replace(/[\s\-_]+/g, separator)
    .toLowerCase()
    .replace(new RegExp(`^${separator}`), '');
}

export function toTitleCase(str: string, options: StringCaseOptions = {}): string {
  const { preserveAcronyms = true } = options;
  
  return str
    .toLowerCase()
    .split(/\s+/)
    .map(word => {
      if (preserveAcronyms && word.toUpperCase() === word) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Truncate string
export function truncate(str: string, options: TruncateOptions): string {
  const { length, suffix = '...', preserveWords = true, separator = ' ' } = options;
  
  if (str.length <= length) {
    return str;
  }
  
  if (!preserveWords) {
    return str.slice(0, length) + suffix;
  }
  
  const truncated = str.slice(0, length);
  const lastSeparatorIndex = truncated.lastIndexOf(separator);
  
  if (lastSeparatorIndex === -1) {
    return str.slice(0, length) + suffix;
  }
  
  return truncated.slice(0, lastSeparatorIndex) + suffix;
}

// Slugify string
export function slugify(str: string, options: SlugifyOptions = {}): string {
  const { separator = '-', lowercase = true, removeSpecialChars = true } = options;
  
  let result = str;
  
  if (lowercase) {
    result = result.toLowerCase();
  }
  
  if (removeSpecialChars) {
    result = result.replace(/[^\w\s-]/g, '');
  }
  
  result = result.replace(/[\s\-_]+/g, separator);
  result = result.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
  
  return result;
}

// Capitalize first letter
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Capitalize first letter of each word
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Reverse string
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

// Check if string is palindrome
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
}

// Count words in string
export function countWords(str: string): number {
  if (!str.trim()) return 0;
  return str.trim().split(/\s+/).length;
}

// Count characters in string
export function countCharacters(str: string, includeSpaces: boolean = true): number {
  if (includeSpaces) {
    return str.length;
  }
  return str.replace(/\s/g, '').length;
}

// Count occurrences of substring
export function countOccurrences(str: string, substring: string): number {
  const regex = new RegExp(substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const matches = str.match(regex);
  return matches ? matches.length : 0;
}

// Remove HTML tags
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Escape HTML
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return str.replace(/[&<>"'/]/g, char => htmlEscapes[char]);
}

// Unescape HTML
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };
  
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, entity => htmlUnescapes[entity]);
}

// Generate random string
export function randomString(length: number, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

// Generate UUID
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Check if string is empty or whitespace
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

// Check if string is numeric
export function isNumeric(str: string): boolean {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

// Check if string is email
export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

// Check if string is URL
export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Check if string is phone number
export function isPhoneNumber(str: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(str.replace(/[\s\-\(\)]/g, ''));
}

// Check if string is credit card number
export function isCreditCard(str: string): boolean {
  const cleaned = str.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
}

// Mask string (e.g., credit card, phone number)
export function mask(str: string, pattern: string, _maskChar: string = '*'): string {
  let result = '';
  let strIndex = 0;
  
  for (let i = 0; i < pattern.length && strIndex < str.length; i++) {
    if (pattern[i] === '#') {
      result += str[strIndex++];
    } else {
      result += pattern[i];
    }
  }
  
  return result;
}

// Unmask string
export function unmask(str: string, pattern: string): string {
  let result = '';
  
  for (let i = 0; i < str.length && i < pattern.length; i++) {
    if (pattern[i] === '#') {
      result += str[i];
    }
  }
  
  return result;
}

// Pad string
export function pad(str: string, length: number, char: string = ' ', side: 'left' | 'right' | 'both' = 'right'): string {
  const padding = char.repeat(Math.max(0, length - str.length));
  
  switch (side) {
    case 'left':
      return padding + str;
    case 'right':
      return str + padding;
    case 'both':
      const leftPad = char.repeat(Math.floor((length - str.length) / 2));
      const rightPad = char.repeat(Math.ceil((length - str.length) / 2));
      return leftPad + str + rightPad;
    default:
      return str + padding;
  }
}

// Remove diacritics
export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Convert to ASCII
export function toASCII(str: string): string {
  return str.replace(/[^\x00-\x7F]/g, '');
}

// Convert to base64
export function toBase64(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

// Convert from base64
export function fromBase64(str: string): string {
  if (typeof atob !== 'undefined') {
    return atob(str);
  }
  return Buffer.from(str, 'base64').toString();
}

// Convert to hex
export function toHex(str: string): string {
  return str.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

// Convert from hex
export function fromHex(str: string): string {
  return str.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
}

// Convert to binary
export function toBinary(str: string): string {
  return str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

// Convert from binary
export function fromBinary(str: string): string {
  return str.match(/.{1,8}/g)?.map(byte => String.fromCharCode(parseInt(byte, 2))).join('') || '';
}

// Extract numbers from string
export function extractNumbers(str: string): number[] {
  return str.match(/\d+/g)?.map(Number) || [];
}

// Extract letters from string
export function extractLetters(str: string): string[] {
  return str.match(/[a-zA-Z]/g) || [];
}

// Extract words from string
export function extractWords(str: string): string[] {
  return str.match(/\b\w+\b/g) || [];
}

// Extract emails from string
export function extractEmails(str: string): string[] {
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
  return str.match(emailRegex) || [];
}

// Extract URLs from string
export function extractUrls(str: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return str.match(urlRegex) || [];
}

// Replace multiple occurrences
export function replaceAll(str: string, search: string, replace: string): string {
  return str.split(search).join(replace);
}

// Replace with function
export function replaceWith(str: string, pattern: RegExp, replacer: (match: string, ...args: any[]) => string): string {
  return str.replace(pattern, replacer);
}

// Split and trim
export function splitAndTrim(str: string, separator: string | RegExp = ','): string[] {
  return str.split(separator).map(s => s.trim()).filter(s => s.length > 0);
}

// Join with separator
export function joinWith(arr: string[], separator: string = ', '): string {
  return arr.filter(s => s.length > 0).join(separator);
}

// Remove duplicate characters
export function removeDuplicates(str: string): string {
  return [...new Set(str)].join('');
}

// Remove duplicate words
export function removeDuplicateWords(str: string): string {
  const words = str.split(/\s+/);
  const uniqueWords = [...new Set(words)];
  return uniqueWords.join(' ');
}

// Sort characters
export function sortCharacters(str: string, reverse: boolean = false): string {
  const sorted = str.split('').sort();
  return reverse ? sorted.reverse().join('') : sorted.join('');
}

// Sort words
export function sortWords(str: string, reverse: boolean = false): string {
  const words = str.split(/\s+/);
  const sorted = words.sort();
  return reverse ? sorted.reverse().join(' ') : sorted.join(' ');
}

// Check if string starts with
export function startsWith(str: string, prefix: string, position: number = 0): boolean {
  return str.startsWith(prefix, position);
}

// Check if string ends with
export function endsWith(str: string, suffix: string, position: number = str.length): boolean {
  return str.endsWith(suffix, position);
}

// Check if string includes
export function includes(str: string, searchString: string, position: number = 0): boolean {
  return str.includes(searchString, position);
}

// Find all occurrences
export function findAllOccurrences(str: string, searchString: string): number[] {
  const indices: number[] = [];
  let index = str.indexOf(searchString);
  
  while (index !== -1) {
    indices.push(index);
    index = str.indexOf(searchString, index + 1);
  }
  
  return indices;
}

export default {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toTitleCase,
  truncate,
  slugify,
  capitalize,
  capitalizeWords,
  reverse,
  isPalindrome,
  countWords,
  countCharacters,
  countOccurrences,
  stripHtml,
  escapeHtml,
  unescapeHtml,
  randomString,
  generateUUID,
  isEmpty,
  isNumeric,
  isEmail,
  isUrl,
  isPhoneNumber,
  isCreditCard,
  mask,
  unmask,
  pad,
  removeDiacritics,
  toASCII,
  toBase64,
  fromBase64,
  toHex,
  fromHex,
  toBinary,
  fromBinary,
  extractNumbers,
  extractLetters,
  extractWords,
  extractEmails,
  extractUrls,
  replaceAll,
  replaceWith,
  splitAndTrim,
  joinWith,
  removeDuplicates,
  removeDuplicateWords,
  sortCharacters,
  sortWords,
  startsWith,
  endsWith,
  includes,
  findAllOccurrences,
}; 