'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import IconButton from './IconButton';

interface ImageUploadProps {
  projectId: string;
  type: string;
  currentImage?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  projectId,
  type,
  currentImage,
  onUploadComplete,
  onRemove,
  label,
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const uploadingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!projectId) {
      alert('Project ID is required');
      return;
    }

    if (uploadingRef.current) {
      console.warn('[ImageUpload] Upload already in progress');
      return;
    }

    uploadingRef.current = true;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      formData.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        onUploadComplete(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      uploadingRef.current = false;
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading && inputRef.current) {
      inputRef.current.click();
    }
  };

  if (currentImage) {
    return (
      <div className="relative group">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={currentImage}
            alt={label || 'Uploaded image'}
            fill
            className="object-cover"
          />
        </div>
        {onRemove && !disabled && (
          <div className="absolute top-2 right-2">
            <IconButton
              icon="trash"
              variant="danger"
              size="sm"
              onClick={onRemove}
              label="Remove image"
            />
          </div>
        )}
        {label && (
          <p className="text-sm text-charcoal/70 mt-2">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
        disabled={disabled || uploading}
      />
      
      <div
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${disabled || uploading 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
            : 'border-gray-300 hover:border-bronze-500 cursor-pointer bg-white'
          }
        `}
      >
        <div className="text-charcoal/60">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">
            {uploading ? 'Uploading...' : (label || 'Click to upload image')}
          </p>
          <p className="text-sm mt-1">PNG, JPG up to 10MB</p>
        </div>
      </div>
    </div>
  );
}



