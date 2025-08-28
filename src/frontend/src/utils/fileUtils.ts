/**
 * File Utilities
 * Utility functions for file manipulation and operations
 */

/**
 * File size units
 */
export enum FileSizeUnit {
  BYTES = 'B',
  KILOBYTES = 'KB',
  MEGABYTES = 'MB',
  GIGABYTES = 'GB',
  TERABYTES = 'TB'
}

/**
 * File type categories
 */
export enum FileTypeCategory {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  CODE = 'code',
  DATA = 'data',
  OTHER = 'other'
}

/**
 * File information interface
 */
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  extension: string;
  category: FileTypeCategory;
}

/**
 * Formats file size in human readable format
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Gets file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Gets filename without extension
 */
export const getFilenameWithoutExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
};

/**
 * Gets file type category based on extension
 */
export const getFileTypeCategory = (extension: string): FileTypeCategory => {
  const ext = extension.toLowerCase();
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff'].includes(ext)) {
    return FileTypeCategory.IMAGE;
  }
  
  // Videos
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'].includes(ext)) {
    return FileTypeCategory.VIDEO;
  }
  
  // Audio
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'].includes(ext)) {
    return FileTypeCategory.AUDIO;
  }
  
  // Documents
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'].includes(ext)) {
    return FileTypeCategory.DOCUMENT;
  }
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) {
    return FileTypeCategory.ARCHIVE;
  }
  
  // Code files
  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'sass', 'less', 'json', 'xml', 'yaml', 'yml', 'md', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt'].includes(ext)) {
    return FileTypeCategory.CODE;
  }
  
  // Data files
  if (['csv', 'xlsx', 'xls', 'json', 'xml', 'sql', 'db', 'sqlite'].includes(ext)) {
    return FileTypeCategory.DATA;
  }
  
  return FileTypeCategory.OTHER;
};

/**
 * Gets MIME type for file extension
 */
export const getMimeType = (extension: string): string => {
  const ext = extension.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'ico': 'image/x-icon',
    'tiff': 'image/tiff',
    
    // Videos
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    'mkv': 'video/x-matroska',
    'm4v': 'video/x-m4v',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'flac': 'audio/flac',
    'aac': 'audio/aac',
    'ogg': 'audio/ogg',
    'wma': 'audio/x-ms-wma',
    'm4a': 'audio/mp4',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'rtf': 'application/rtf',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
    'bz2': 'application/x-bzip2',
    'xz': 'application/x-xz',
    
    // Code
    'js': 'application/javascript',
    'ts': 'application/typescript',
    'jsx': 'text/jsx',
    'tsx': 'text/tsx',
    'html': 'text/html',
    'css': 'text/css',
    'scss': 'text/x-scss',
    'sass': 'text/x-sass',
    'less': 'text/x-less',
    'json': 'application/json',
    'xml': 'application/xml',
    'yaml': 'application/x-yaml',
    'yml': 'application/x-yaml',
    'md': 'text/markdown',
    'py': 'text/x-python',
    'java': 'text/x-java-source',
    'cpp': 'text/x-c++src',
    'c': 'text/x-csrc',
    'cs': 'text/x-csharp',
    'php': 'application/x-httpd-php',
    'rb': 'text/x-ruby',
    'go': 'text/x-go',
    'rs': 'text/x-rust',
    'swift': 'text/x-swift',
    'kt': 'text/x-kotlin',
    
    // Data
    'csv': 'text/csv',
    'sql': 'application/sql',
    'db': 'application/x-sqlite3',
    'sqlite': 'application/x-sqlite3'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Validates file size against maximum allowed size
 */
export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * Validates file type against allowed extensions
 */
export const validateFileType = (file: File, allowedExtensions: string[]): boolean => {
  const extension = getFileExtension(file.name);
  return allowedExtensions.includes(extension.toLowerCase());
};

/**
 * Creates a file info object from File
 */
export const getFileInfo = (file: File): FileInfo => {
  const extension = getFileExtension(file.name);
  
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified),
    extension,
    category: getFileTypeCategory(extension)
  };
};

/**
 * Reads file as text
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

/**
 * Reads file as data URL
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Reads file as ArrayBuffer
 */
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Downloads a file from data URL
 */
export const downloadFileFromDataURL = (dataURL: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Downloads a file from blob
 */
export const downloadFileFromBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Creates a blob from data URL
 */
export const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Converts bytes to different units
 */
export const convertBytes = (bytes: number, unit: FileSizeUnit): number => {
  const units = {
    [FileSizeUnit.BYTES]: 1,
    [FileSizeUnit.KILOBYTES]: 1024,
    [FileSizeUnit.MEGABYTES]: 1024 * 1024,
    [FileSizeUnit.GIGABYTES]: 1024 * 1024 * 1024,
    [FileSizeUnit.TERABYTES]: 1024 * 1024 * 1024 * 1024
  };
  
  return bytes / units[unit];
};

/**
 * Gets human readable file type description
 */
export const getFileTypeDescription = (category: FileTypeCategory): string => {
  const descriptions = {
    [FileTypeCategory.IMAGE]: 'Image File',
    [FileTypeCategory.VIDEO]: 'Video File',
    [FileTypeCategory.AUDIO]: 'Audio File',
    [FileTypeCategory.DOCUMENT]: 'Document',
    [FileTypeCategory.ARCHIVE]: 'Archive',
    [FileTypeCategory.CODE]: 'Source Code',
    [FileTypeCategory.DATA]: 'Data File',
    [FileTypeCategory.OTHER]: 'Other File'
  };
  
  return descriptions[category];
};

/**
 * Checks if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Checks if file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Checks if file is an audio file
 */
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

/**
 * Checks if file is a document
 */
export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/rtf'
  ];
  
  return documentTypes.includes(file.type);
};

/**
 * Gets file icon based on type
 */
export const getFileIcon = (category: FileTypeCategory): string => {
  const icons = {
    [FileTypeCategory.IMAGE]: '📷',
    [FileTypeCategory.VIDEO]: '🎥',
    [FileTypeCategory.AUDIO]: '🎵',
    [FileTypeCategory.DOCUMENT]: '📄',
    [FileTypeCategory.ARCHIVE]: '📦',
    [FileTypeCategory.CODE]: '💻',
    [FileTypeCategory.DATA]: '📊',
    [FileTypeCategory.OTHER]: '📁'
  };
  
  return icons[category];
};

/**
 * Creates a unique filename
 */
export const createUniqueFilename = (originalName: string, existingNames: string[]): string => {
  const extension = getFileExtension(originalName);
  const nameWithoutExt = getFilenameWithoutExtension(originalName);
  let counter = 1;
  let newName = originalName;
  
  while (existingNames.includes(newName)) {
    newName = `${nameWithoutExt} (${counter}).${extension}`;
    counter++;
  }
  
  return newName;
};

/**
 * Sanitizes filename by removing invalid characters
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .trim();
};

/**
 * Gets file preview URL (for images and videos)
 */
export const getFilePreviewURL = (file: File): Promise<string> => {
  if (isImageFile(file) || isVideoFile(file)) {
    return readFileAsDataURL(file);
  }
  return Promise.reject(new Error('File type does not support preview'));
};

/**
 * Compresses image file
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculates new dimensions maintaining aspect ratio
 */
const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let { width, height } = { width: originalWidth, height: originalHeight };
  
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }
  
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
}; 