import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'dashed';
  className?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  multiple = false,
  accept,
  maxSize,
  maxFiles = 10,
  disabled = false,
  size = 'md',
  variant = 'default',
  className,
  error,
  helperText,
  placeholder = 'Arraste arquivos aqui ou clique para selecionar'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantClasses = {
    default: 'border-2 border-gray-300 bg-gray-50',
    outline: 'border-2 border-gray-300 bg-white',
    dashed: 'border-2 border-dashed border-gray-300 bg-gray-50'
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `Arquivo muito grande. Tamanho máximo: ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert('Erros de validação:\n' + errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const newFiles = multiple 
        ? [...selectedFiles, ...validFiles].slice(0, maxFiles)
        : validFiles.slice(0, 1);
      
      setSelectedFiles(newFiles);
      onFileSelect?.(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect?.(newFiles);
  };

  const removeAllFiles = () => {
    setSelectedFiles([]);
    onFileSelect?.([]);
  };

  return (
    <div className={clsx('space-y-3', className)}>
      {/* Upload Area */}
      <div
        className={clsx(
          'relative border-2 rounded-lg transition-colors cursor-pointer',
          sizeClasses[size],
          variantClasses[variant],
          isDragOver && 'border-blue-500 bg-blue-50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500',
          !disabled && 'hover:border-gray-400'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <CloudArrowUpIcon className={clsx(
            'mx-auto text-gray-400',
            size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-10 w-10' : 'h-12 w-12'
          )} />
          
          <p className="mt-2 text-sm text-gray-600">
            {placeholder}
          </p>
          
          <p className="mt-1 text-xs text-gray-500">
            {accept && `Tipos aceitos: ${accept}`}
            {maxSize && ` • Tamanho máximo: ${formatFileSize(maxSize)}`}
            {multiple && maxFiles > 1 && ` • Máximo ${maxFiles} arquivos`}
          </p>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Arquivos selecionados ({selectedFiles.length})
            </h4>
            {multiple && selectedFiles.length > 1 && (
              <button
                type="button"
                onClick={removeAllFiles}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remover todos
              </button>
            )}
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Error/Helper Text */}
      {(error || helperText) && (
        <p className={clsx(
          'text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload; 