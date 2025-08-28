// Date utilities for the Securet Flow SSC application

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateFormatOptions {
  format?: 'short' | 'long' | 'relative' | 'iso' | 'custom';
  locale?: string;
  timezone?: string;
  includeTime?: boolean;
  customFormat?: string;
}

export interface RelativeTimeOptions {
  now?: Date;
  includeSeconds?: boolean;
  future?: boolean;
}

// Format a date according to the specified options
export function formatDate(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const {
    format = 'short',
    locale = 'pt-BR',
    timezone,
    includeTime = false,
    customFormat,
  } = options;

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...(includeTime && {
          hour: '2-digit',
          minute: '2-digit',
        }),
        ...(timezone && { timeZone: timezone }),
      });

    case 'long':
      return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(includeTime && {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        ...(timezone && { timeZone: timezone }),
      });

    case 'relative':
      return getRelativeTime(dateObj);

    case 'iso':
      return dateObj.toISOString();

    case 'custom':
      if (customFormat) {
        return formatCustomDate(dateObj, customFormat);
      }
      return dateObj.toLocaleDateString(locale);

    default:
      return dateObj.toLocaleDateString(locale);
  }
}

// Get relative time (e.g., "2 hours ago", "in 3 days")
export function getRelativeTime(
  date: Date | string | number,
  options: RelativeTimeOptions = {}
): string {
  const dateObj = new Date(date);
  const now = options.now || new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  const isFuture = diffInSeconds < 0;
  const absDiff = Math.abs(diffInSeconds);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(absDiff / interval.seconds);
    if (count >= 1) {
      const label = count === 1 ? interval.label : `${interval.label}s`;
      return isFuture ? `in ${count} ${label}` : `${count} ${label} ago`;
    }
  }

  return 'just now';
}

// Format custom date using a pattern
export function formatCustomDate(date: Date, pattern: string): string {
  const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');

  return pattern
    .replace('YYYY', date.getFullYear().toString())
    .replace('YY', date.getFullYear().toString().slice(-2))
    .replace('MM', pad(date.getMonth() + 1))
    .replace('M', (date.getMonth() + 1).toString())
    .replace('DD', pad(date.getDate()))
    .replace('D', date.getDate().toString())
    .replace('HH', pad(date.getHours()))
    .replace('H', date.getHours().toString())
    .replace('mm', pad(date.getMinutes()))
    .replace('m', date.getMinutes().toString())
    .replace('ss', pad(date.getSeconds()))
    .replace('s', date.getSeconds().toString())
    .replace('SSS', pad(date.getMilliseconds(), 3))
    .replace('SS', pad(date.getMilliseconds(), 2))
    .replace('S', date.getMilliseconds().toString());
}

// Get the start of a time period
export function getStartOfPeriod(date: Date, period: 'day' | 'week' | 'month' | 'quarter' | 'year'): Date {
  const newDate = new Date(date);

  switch (period) {
    case 'day':
      newDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      const day = newDate.getDay();
      const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
      newDate.setDate(diff);
      newDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      newDate.setDate(1);
      newDate.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      const month = newDate.getMonth();
      const quarterStartMonth = Math.floor(month / 3) * 3;
      newDate.setMonth(quarterStartMonth, 1);
      newDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      newDate.setMonth(0, 1);
      newDate.setHours(0, 0, 0, 0);
      break;
  }

  return newDate;
}

// Get the end of a time period
export function getEndOfPeriod(date: Date, period: 'day' | 'week' | 'month' | 'quarter' | 'year'): Date {
  const newDate = new Date(date);

  switch (period) {
    case 'day':
      newDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const day = newDate.getDay();
      const diff = newDate.getDate() - day + (day === 0 ? 0 : 7);
      newDate.setDate(diff);
      newDate.setHours(23, 59, 59, 999);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + 1, 0);
      newDate.setHours(23, 59, 59, 999);
      break;
    case 'quarter':
      const month = newDate.getMonth();
      const quarterEndMonth = Math.floor(month / 3) * 3 + 2;
      newDate.setMonth(quarterEndMonth + 1, 0);
      newDate.setHours(23, 59, 59, 999);
      break;
    case 'year':
      newDate.setMonth(11, 31);
      newDate.setHours(23, 59, 59, 999);
      break;
  }

  return newDate;
}

// Add time to a date
export function addTime(
  date: Date | string | number,
  amount: number,
  unit: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
): Date {
  const dateObj = new Date(date);
  const newDate = new Date(dateObj);

  switch (unit) {
    case 'millisecond':
      newDate.setMilliseconds(newDate.getMilliseconds() + amount);
      break;
    case 'second':
      newDate.setSeconds(newDate.getSeconds() + amount);
      break;
    case 'minute':
      newDate.setMinutes(newDate.getMinutes() + amount);
      break;
    case 'hour':
      newDate.setHours(newDate.getHours() + amount);
      break;
    case 'day':
      newDate.setDate(newDate.getDate() + amount);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + (amount * 7));
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + amount);
      break;
    case 'year':
      newDate.setFullYear(newDate.getFullYear() + amount);
      break;
  }

  return newDate;
}

// Subtract time from a date
export function subtractTime(
  date: Date | string | number,
  amount: number,
  unit: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
): Date {
  return addTime(date, -amount, unit);
}

// Get the difference between two dates
export function getDateDifference(
  date1: Date | string | number,
  date2: Date | string | number,
  unit: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' = 'day'
): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffInMs = d2.getTime() - d1.getTime();

  switch (unit) {
    case 'millisecond':
      return diffInMs;
    case 'second':
      return Math.floor(diffInMs / 1000);
    case 'minute':
      return Math.floor(diffInMs / (1000 * 60));
    case 'hour':
      return Math.floor(diffInMs / (1000 * 60 * 60));
    case 'day':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    case 'week':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    case 'month':
      return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    case 'year':
      return d2.getFullYear() - d1.getFullYear();
    default:
      return diffInMs;
  }
}

// Check if a date is today
export function isToday(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
}

// Check if a date is yesterday
export function isYesterday(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateObj.toDateString() === yesterday.toDateString();
}

// Check if a date is tomorrow
export function isTomorrow(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return dateObj.toDateString() === tomorrow.toDateString();
}

// Check if a date is in the past
export function isPast(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  return dateObj < new Date();
}

// Check if a date is in the future
export function isFuture(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  return dateObj > new Date();
}

// Check if a date is within a range
export function isWithinRange(
  date: Date | string | number,
  start: Date | string | number,
  end: Date | string | number
): boolean {
  const dateObj = new Date(date);
  const startObj = new Date(start);
  const endObj = new Date(end);
  return dateObj >= startObj && dateObj <= endObj;
}

// Get the age from a birth date
export function getAge(birthDate: Date | string | number): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Get the number of days in a month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Get the day of the year
export function getDayOfYear(date: Date | string | number): number {
  const dateObj = new Date(date);
  const start = new Date(dateObj.getFullYear(), 0, 0);
  const diff = dateObj.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Get the week number of the year
export function getWeekOfYear(date: Date | string | number): number {
  const dateObj = new Date(date);
  const start = new Date(dateObj.getFullYear(), 0, 1);
  const days = Math.floor((dateObj.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

// Parse a date string with multiple formats
export function parseDate(dateString: string): Date | null {
  const formats = [
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY/MM/DD',
    'MM-DD-YYYY',
    'DD-MM-YYYY',
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
    'YYYY-MM-DDTHH:mm:ssZ',
    'YYYY-MM-DD HH:mm:ss',
    'MM/DD/YYYY HH:mm:ss',
  ];

  for (const format of formats) {
    try {
      const parsed = parseCustomDate(dateString, format);
      if (parsed && !isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  // Try native Date parsing
  const nativeParsed = new Date(dateString);
  if (!isNaN(nativeParsed.getTime())) {
    return nativeParsed;
  }

  return null;
}

// Parse a date string with a custom format
export function parseCustomDate(dateString: string, format: string): Date | null {
  const regex = format
    .replace(/YYYY/g, '(\\d{4})')
    .replace(/YY/g, '(\\d{2})')
    .replace(/MM/g, '(\\d{2})')
    .replace(/M/g, '(\\d{1,2})')
    .replace(/DD/g, '(\\d{2})')
    .replace(/D/g, '(\\d{1,2})')
    .replace(/HH/g, '(\\d{2})')
    .replace(/H/g, '(\\d{1,2})')
    .replace(/mm/g, '(\\d{2})')
    .replace(/m/g, '(\\d{1,2})')
    .replace(/ss/g, '(\\d{2})')
    .replace(/s/g, '(\\d{1,2})')
    .replace(/SSS/g, '(\\d{3})')
    .replace(/SS/g, '(\\d{2})')
    .replace(/S/g, '(\\d{1,3})');

  const match = dateString.match(new RegExp(`^${regex}$`));
  if (!match) return null;

  const parts = match.slice(1);
  let year = 0, month = 0, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0;
  let partIndex = 0;

  // Parse based on format
  for (let i = 0; i < format.length; i++) {
    const char = format[i];
    const nextChar = format[i + 1];
    const nextNextChar = format[i + 2];
    const nextNextNextChar = format[i + 3];

    if (char === 'Y' && nextChar === 'Y' && nextNextChar === 'Y' && nextNextNextChar === 'Y') {
      year = parseInt(parts[partIndex++]);
      i += 3;
    } else if (char === 'Y' && nextChar === 'Y') {
      year = 2000 + parseInt(parts[partIndex++]);
      i += 1;
    } else if (char === 'M' && nextChar === 'M') {
      month = parseInt(parts[partIndex++]) - 1;
      i += 1;
    } else if (char === 'M') {
      month = parseInt(parts[partIndex++]) - 1;
    } else if (char === 'D' && nextChar === 'D') {
      day = parseInt(parts[partIndex++]);
      i += 1;
    } else if (char === 'D') {
      day = parseInt(parts[partIndex++]);
    } else if (char === 'H' && nextChar === 'H') {
      hour = parseInt(parts[partIndex++]);
      i += 1;
    } else if (char === 'H') {
      hour = parseInt(parts[partIndex++]);
    } else if (char === 'm' && nextChar === 'm') {
      minute = parseInt(parts[partIndex++]);
      i += 1;
    } else if (char === 'm') {
      minute = parseInt(parts[partIndex++]);
    } else if (char === 's' && nextChar === 's') {
      second = parseInt(parts[partIndex++]);
      i += 1;
    } else if (char === 's') {
      second = parseInt(parts[partIndex++]);
    } else if (char === 'S' && nextChar === 'S' && nextNextChar === 'S') {
      millisecond = parseInt(parts[partIndex++]);
      i += 2;
    } else if (char === 'S' && nextChar === 'S') {
      millisecond = parseInt(parts[partIndex++]) * 10;
      i += 1;
    } else if (char === 'S') {
      millisecond = parseInt(parts[partIndex++]);
    }
  }

  return new Date(year, month, day, hour, minute, second, millisecond);
}

// Generate a date range
export function generateDateRange(
  start: Date | string | number,
  end: Date | string | number,
  step: number = 1,
  unit: 'day' | 'week' | 'month' | 'year' = 'day'
): Date[] {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dates: Date[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current = addTime(current, step, unit);
  }

  return dates;
}

// Get business days between two dates
export function getBusinessDays(start: Date | string | number, end: Date | string | number): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let businessDays = 0;
  let current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      businessDays++;
    }
    current = addTime(current, 1, 'day');
  }

  return businessDays;
}

// Check if a date is a business day
export function isBusinessDay(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

// Get the next business day
export function getNextBusinessDay(date: Date | string | number): Date {
  let nextDay = addTime(date, 1, 'day');
  while (!isBusinessDay(nextDay)) {
    nextDay = addTime(nextDay, 1, 'day');
  }
  return nextDay;
}

// Get the previous business day
export function getPreviousBusinessDay(date: Date | string | number): Date {
  let prevDay = subtractTime(date, 1, 'day');
  while (!isBusinessDay(prevDay)) {
    prevDay = subtractTime(prevDay, 1, 'day');
  }
  return prevDay;
}

export default {
  formatDate,
  getRelativeTime,
  formatCustomDate,
  getStartOfPeriod,
  getEndOfPeriod,
  addTime,
  subtractTime,
  getDateDifference,
  isToday,
  isYesterday,
  isTomorrow,
  isPast,
  isFuture,
  isWithinRange,
  getAge,
  getDaysInMonth,
  getDayOfYear,
  getWeekOfYear,
  parseDate,
  parseCustomDate,
  generateDateRange,
  getBusinessDays,
  isBusinessDay,
  getNextBusinessDay,
  getPreviousBusinessDay,
}; 