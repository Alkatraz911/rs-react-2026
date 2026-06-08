export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'] as const;
export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export interface ImageValidationResult {
  valid: boolean;
  error: string | null;
}

export const validateImageFile = (
  file: File | null | undefined
): ImageValidationResult => {
  if (!file) {
    return { valid: false, error: 'Image is required' };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return {
      valid: false,
      error: 'Image must be a PNG or JPEG file',
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image must be smaller than ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB`,
    };
  }
  return { valid: true, error: null };
};

export const imageToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
