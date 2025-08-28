import { EMAIL_REGEX, URL_REGEX, PASSWORD_REGEX } from './constants';

// Type definitions
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
  message?: string;
}

// Base validation function
export function validate(value: any, rules: ValidationRule): ValidationResult {
  // Required validation
  if (rules.required && (value === undefined || value === null || value === '')) {
    return {
      isValid: false,
      message: rules.message || 'This field is required',
    };
  }

  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return { isValid: true };
  }

  // Min length validation
  if (rules.minLength && String(value).length < rules.minLength) {
    return {
      isValid: false,
      message: rules.message || `Minimum length is ${rules.minLength} characters`,
    };
  }

  // Max length validation
  if (rules.maxLength && String(value).length > rules.maxLength) {
    return {
      isValid: false,
      message: rules.message || `Maximum length is ${rules.maxLength} characters`,
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(String(value))) {
    return {
      isValid: false,
      message: rules.message || 'Invalid format',
    };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return {
        isValid: false,
        message: customError,
      };
    }
  }

  return { isValid: true };
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  return validate(email, {
    required: true,
    pattern: EMAIL_REGEX,
    message: 'Please enter a valid email address',
  });
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  return validate(password, {
    required: true,
    minLength: 8,
    pattern: PASSWORD_REGEX,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  });
}

// URL validation
export function validateUrl(url: string): ValidationResult {
  return validate(url, {
    pattern: URL_REGEX,
    message: 'Please enter a valid URL',
  });
}

// Phone validation
export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return validate(phone, {
    pattern: phoneRegex,
    message: 'Please enter a valid phone number',
  });
}

// Required validation
export function validateRequired(value: any, fieldName?: string): ValidationResult {
  return validate(value, {
    required: true,
    message: fieldName ? `${fieldName} is required` : 'This field is required',
  });
}

// Min length validation
export function validateMinLength(value: string, minLength: number): ValidationResult {
  return validate(value, {
    minLength,
    message: `Minimum length is ${minLength} characters`,
  });
}

// Max length validation
export function validateMaxLength(value: string, maxLength: number): ValidationResult {
  return validate(value, {
    maxLength,
    message: `Maximum length is ${maxLength} characters`,
  });
}

// Number validation
export function validateNumber(value: any): ValidationResult {
  return validate(value, {
    pattern: /^\d+$/,
    message: 'Please enter a valid number',
  });
}

// Integer validation
export function validateInteger(value: any): ValidationResult {
  return validate(value, {
    pattern: /^-?\d+$/,
    message: 'Please enter a valid integer',
  });
}

// Decimal validation
export function validateDecimal(value: any, decimals: number = 2): ValidationResult {
  const decimalRegex = new RegExp(`^-?\\d+(\\.\\d{1,${decimals}})?$`);
  return validate(value, {
    pattern: decimalRegex,
    message: `Please enter a valid decimal number with up to ${decimals} decimal places`,
  });
}

// Date validation
export function validateDate(date: string): ValidationResult {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return validate(date, {
    pattern: dateRegex,
    message: 'Please enter a valid date (YYYY-MM-DD)',
  });
}

// Time validation
export function validateTime(time: string): ValidationResult {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  return validate(time, {
    pattern: timeRegex,
    message: 'Please enter a valid time (HH:MM:SS)',
  });
}

// IP address validation
export function validateIpAddress(ip: string): ValidationResult {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return validate(ip, {
    pattern: ipRegex,
    message: 'Please enter a valid IP address',
  });
}

// MAC address validation
export function validateMacAddress(mac: string): ValidationResult {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return validate(mac, {
    pattern: macRegex,
    message: 'Please enter a valid MAC address',
  });
}

// Credit card validation (Luhn algorithm)
export function validateCreditCard(cardNumber: string): ValidationResult {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return {
      isValid: false,
      message: 'Please enter a valid credit card number',
    };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return {
    isValid: sum % 10 === 0,
    message: sum % 10 === 0 ? undefined : 'Invalid credit card number',
  };
}

// File validation
export function validateFile(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
} = {}): ValidationResult {
  const { maxSize, allowedTypes } = options;

  if (!file) {
    return {
      isValid: false,
      message: 'Please select a file',
    };
  }

  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      message: `File size must be less than ${formatBytes(maxSize)}`,
    };
  }

  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
}

// Array validation
export function validateArray(value: any[], options: {
  minLength?: number;
  maxLength?: number;
  unique?: boolean;
} = {}): ValidationResult {
  const { minLength, maxLength, unique } = options;

  if (!Array.isArray(value)) {
    return {
      isValid: false,
      message: 'Value must be an array',
    };
  }

  if (minLength && value.length < minLength) {
    return {
      isValid: false,
      message: `Array must have at least ${minLength} items`,
    };
  }

  if (maxLength && value.length > maxLength) {
    return {
      isValid: false,
      message: `Array must have no more than ${maxLength} items`,
    };
  }

  if (unique && value.length !== new Set(value).size) {
    return {
      isValid: false,
      message: 'Array items must be unique',
    };
  }

  return { isValid: true };
}

// Object validation
export function validateObject(value: any, requiredFields: string[] = []): ValidationResult {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {
      isValid: false,
      message: 'Value must be an object',
    };
  }

  for (const field of requiredFields) {
    if (!(field in value)) {
      return {
        isValid: false,
        message: `Missing required field: ${field}`,
      };
    }
  }

  return { isValid: true };
}

// Form validation
export function validateForm(values: Record<string, any>, rules: Record<string, ValidationRule>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const result = validate(values[field], rule);
    if (!result.isValid) {
      errors[field] = result.message!;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Async validation
export function validateAsync(
  value: any,
  asyncValidator: (value: any) => Promise<string | undefined>
): Promise<ValidationResult> {
  return asyncValidator(value).then((error) => ({
    isValid: !error,
    message: error,
  }));
}

// Composite validation
export function validateComposite(value: any, validators: ValidationRule[]): ValidationResult {
  for (const validator of validators) {
    const result = validate(value, validator);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
}

// Conditional validation
export function validateConditional(
  value: any,
  condition: boolean,
  validator: ValidationRule
): ValidationResult {
  if (!condition) {
    return { isValid: true };
  }
  return validate(value, validator);
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Export all validators
export default {
  validate,
  validateEmail,
  validatePassword,
  validateUrl,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validateInteger,
  validateDecimal,
  validateDate,
  validateTime,
  validateIpAddress,
  validateMacAddress,
  validateCreditCard,
  validateFile,
  validateArray,
  validateObject,
  validateForm,
  validateAsync,
  validateComposite,
  validateConditional,
}; 